import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

import { buildFindings } from "./rules";
import { computeScore } from "./scoring";
import { validateTargetUrl } from "./ssrf";
import type { AnalysisReport } from "./types";

const inputSchema = z.object({
  url: z.string().min(4).max(2048),
  useFirecrawl: z.boolean().optional(),
});

// Simple in-memory throttle per requester IP (per-isolate; best effort on Workers).
const RATE: Map<string, { count: number; resetAt: number }> = new Map();
const WINDOW_MS = 60_000;
const MAX_REQ = 15;

function rateCheck(ip: string) {
  const now = Date.now();
  const entry = RATE.get(ip);
  if (!entry || entry.resetAt < now) {
    RATE.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQ) return false;
  entry.count++;
  return true;
}

function headersToObject(h: Headers): Record<string, string> {
  const obj: Record<string, string> = {};
  h.forEach((v, k) => { obj[k] = v; });
  return obj;
}

async function directFetch(url: string): Promise<{ headers: Record<string, string>; status: number; finalUrl: string }> {
  const res = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: { "User-Agent": "HTTP-Security-Headers-Validator/1.0 (+lovable)" },
    signal: AbortSignal.timeout(10_000),
  });
  return { headers: headersToObject(res.headers), status: res.status, finalUrl: res.url || url };
}

async function firecrawlFetch(url: string): Promise<{ headers: Record<string, string>; status: number; finalUrl: string }> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error("Firecrawl no está configurado. Conecta el conector Firecrawl para habilitar este modo.");
  }
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ url, formats: ["rawHtml"], onlyMainContent: false }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`Firecrawl error ${res.status}`);
  const json = (await res.json()) as { data?: { metadata?: Record<string, unknown> } } | { metadata?: Record<string, unknown> };
  const meta = (("data" in json && json.data?.metadata) || ("metadata" in json && json.metadata) || {}) as Record<string, unknown>;
  // Firecrawl returns headers within metadata; surface what is available.
  const headers: Record<string, string> = {};
  for (const [k, v] of Object.entries(meta)) {
    if (typeof v === "string" && k.includes("-")) headers[k] = v;
  }
  const status = typeof meta.statusCode === "number" ? (meta.statusCode as number) : 200;
  const finalUrl = typeof meta.sourceURL === "string" ? (meta.sourceURL as string) : url;
  return { headers, status, finalUrl };
}

export const analyzeUrl = createServerFn({ method: "POST" })
  .inputValidator((d) => inputSchema.parse(d))
  .handler(async ({ data }): Promise<AnalysisReport> => {
    const ip = (() => { try { return getRequestIP({ xForwardedFor: true }) ?? "unknown"; } catch { return "unknown"; } })();
    if (!rateCheck(ip)) throw new Error("Demasiadas solicitudes. Espera un minuto e intenta de nuevo.");

    const v = validateTargetUrl(data.url);
    if (!v.ok) throw new Error(v.error);

    let result: { headers: Record<string, string>; status: number; finalUrl: string };
    let source: "direct" | "firecrawl" = "direct";
    try {
      result = await directFetch(v.url.toString());
    } catch (err) {
      if (data.useFirecrawl) {
        result = await firecrawlFetch(v.url.toString());
        source = "firecrawl";
      } else {
        const msg = err instanceof Error ? err.message : "Fallo de red";
        throw new Error(`No se pudo conectar al sitio: ${msg}`);
      }
    }

    const findings = buildFindings(result.headers);
    const { score, level, summary } = computeScore(findings);

    return {
      url: data.url,
      finalUrl: result.finalUrl,
      statusCode: result.status,
      fetchedAt: new Date().toISOString(),
      source,
      score,
      level,
      summary,
      findings,
      rawHeaders: result.headers,
    };
  });