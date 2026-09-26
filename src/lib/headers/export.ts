import { t } from "@/lib/i18n";
import { m } from "@/paraglide/messages.js";
import { getLocale } from "@/paraglide/runtime.js";
import type { AnalysisReport, HeaderFinding } from "./types";

const STATUS_LABEL: Record<HeaderFinding["status"], () => string> = {
	secure: m.status_secure,
	improvable: m.status_improvable,
	missing: m.status_missing,
	insecure: m.status_insecure,
};

const STATUS_COLOR: Record<HeaderFinding["status"], string> = {
	secure: "#16a34a",
	improvable: "#d97706",
	missing: "#dc2626",
	insecure: "#b91c1c",
};

const LEVEL_LABEL: Record<AnalysisReport["level"], () => string> = {
	excellent: m.level_excellent,
	acceptable: m.level_acceptable,
	deficient: m.level_deficient,
	critical: m.level_critical,
};

const CATEGORY_LABEL: Record<HeaderFinding["category"], () => string> = {
	critical: m.category_critical,
	recommended: m.category_recommended,
	informational: m.category_informational,
};

const HTML_ENTITIES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

function escapeHtml(s: string) {
	return s.replace(/[&<>"']/g, (c) => HTML_ENTITIES[c] ?? c);
}

export function reportToHtml(r: AnalysisReport): string {
	const locale = getLocale();
	const counts = { secure: 0, improvable: 0, missing: 0, insecure: 0 };
	for (const f of r.findings) counts[f.status]++;
	const summary = (Object.keys(counts) as HeaderFinding["status"][])
		.map((s) => `${STATUS_LABEL[s]()}: ${counts[s]}`)
		.join(" / ");

	const rows = r.findings
		.map(
			(f) => `
    <tr>
      <td><strong>${escapeHtml(f.name)}</strong><div style="color:#64748b;font-size:12px">${escapeHtml(CATEGORY_LABEL[f.category]())}</div></td>
      <td><span style="color:${STATUS_COLOR[f.status]};font-weight:600">${escapeHtml(STATUS_LABEL[f.status]())}</span></td>
      <td><code style="background:#0f172a;color:#e2e8f0;padding:2px 6px;border-radius:4px;word-break:break-all">${escapeHtml(f.detected ?? m.finding_not_present())}</code></td>
      <td>${escapeHtml(t(f.description))}</td>
      <td>${escapeHtml(t(f.risk))}</td>
      <td><code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;word-break:break-all">${escapeHtml(t(f.recommendation))}</code></td>
    </tr>`,
		)
		.join("");

	return `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><title>${escapeHtml(m.export_title())}: ${escapeHtml(r.url)}</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0b1220;color:#e2e8f0;margin:0;padding:32px}
  .card{background:#111a2e;border:1px solid #1e293b;border-radius:12px;padding:24px;margin-bottom:24px}
  h1{margin:0 0 8px;font-size:24px}
  .url{color:#94a3b8;word-break:break-all}
  .score{font-size:64px;font-weight:800;line-height:1}
  table{width:100%;border-collapse:collapse;background:#111a2e}
  th,td{padding:12px;border-bottom:1px solid #1e293b;vertical-align:top;text-align:left;font-size:13px}
  th{background:#0f172a;color:#94a3b8;text-transform:uppercase;font-size:11px;letter-spacing:.05em}
</style></head><body>
<div class="card">
  <h1>${escapeHtml(m.export_title())}</h1>
  <div class="url">${escapeHtml(r.finalUrl)}</div>
  <div style="margin-top:16px;display:flex;align-items:flex-end;gap:24px;flex-wrap:wrap">
    <div><div class="score">${r.score}</div><div style="color:#94a3b8">/ 100 &middot; ${escapeHtml(LEVEL_LABEL[r.level]())}</div></div>
    <div style="flex:1;min-width:240px">${escapeHtml(summary)}</div>
  </div>
  <div style="margin-top:12px;color:#64748b;font-size:12px">${escapeHtml(m.report_date())}: ${escapeHtml(new Date(r.fetchedAt).toLocaleString(locale))} / ${escapeHtml(m.report_http_status())}: ${r.statusCode} / ${escapeHtml(m.report_source())}: ${escapeHtml(r.source === "firecrawl" ? m.source_firecrawl() : m.source_direct())}</div>
</div>
<div class="card" style="padding:0;overflow:hidden">
<table>
<thead><tr><th>Header</th><th>${escapeHtml(m.th_status())}</th><th>${escapeHtml(m.th_value())}</th><th>${escapeHtml(m.th_description())}</th><th>${escapeHtml(m.th_risk())}</th><th>${escapeHtml(m.th_recommendation())}</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</div>
</body></html>`;
}

export function downloadFile(filename: string, content: string, mime: string) {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportJson(r: AnalysisReport) {
	const host = (() => {
		try {
			return new URL(r.finalUrl).hostname;
		} catch {
			return "report";
		}
	})();
	downloadFile(
		`headers-${host}-${Date.now()}.json`,
		JSON.stringify(r, null, 2),
		"application/json",
	);
}

export function exportHtml(r: AnalysisReport) {
	const host = (() => {
		try {
			return new URL(r.finalUrl).hostname;
		} catch {
			return "report";
		}
	})();
	downloadFile(
		`headers-${host}-${Date.now()}.html`,
		reportToHtml(r),
		"text/html",
	);
}
