import type { HeaderFinding, HeaderCategory, HeaderStatus } from "./types";

type Eval = Omit<HeaderFinding, "name" | "category" | "weight">;

interface Rule {
  name: string;
  category: HeaderCategory;
  weight: number;
  evaluate: (value: string | null) => Eval;
}

const ok = (detected: string, description: string, recommendation: string): Eval => ({
  status: "secure",
  detected,
  description,
  risk: "Sin riesgo conocido con esta configuración.",
  recommendation,
  score: 1,
});

const improvable = (detected: string, description: string, risk: string, recommendation: string, score = 0.6): Eval => ({
  status: "improvable",
  detected,
  description,
  risk,
  recommendation,
  score,
});

const missing = (description: string, risk: string, recommendation: string): Eval => ({
  status: "missing",
  detected: null,
  description,
  risk,
  recommendation,
  score: 0,
});

const insecure = (detected: string, description: string, risk: string, recommendation: string): Eval => ({
  status: "insecure",
  detected,
  description,
  risk,
  recommendation,
  score: 0,
});

export const RULES: Rule[] = [
  {
    name: "Content-Security-Policy",
    category: "critical",
    weight: 25,
    evaluate: (v) => {
      const desc = "Define qué fuentes de contenido (scripts, estilos, imágenes, frames) puede cargar la página.";
      if (!v) return missing(desc,
        "Sin CSP, un atacante con XSS puede ejecutar scripts arbitrarios sin restricciones.",
        "Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'");
      const lower = v.toLowerCase();
      if (lower.includes("unsafe-inline") || lower.includes("unsafe-eval") || lower.includes("*"))
        return improvable(v, desc,
          "El uso de 'unsafe-inline', 'unsafe-eval' o comodines (*) reduce drásticamente la protección frente a XSS.",
          "Eliminar 'unsafe-inline'/'unsafe-eval' y restringir dominios usando hashes o nonces.", 0.5);
      return ok(v, desc, "Mantener la política y revisar periódicamente nuevas directivas.");
    },
  },
  {
    name: "Strict-Transport-Security",
    category: "critical",
    weight: 20,
    evaluate: (v) => {
      const desc = "Obliga a los navegadores a usar HTTPS para todas las conexiones futuras al dominio.";
      if (!v) return missing(desc,
        "Permite ataques de downgrade y MITM en la primera conexión sobre HTTP.",
        "Strict-Transport-Security: max-age=63072000; includeSubDomains; preload");
      const m = /max-age=(\d+)/i.exec(v);
      const age = m ? Number(m[1]) : 0;
      if (age < 15552000)
        return improvable(v, desc,
          `max-age=${age} es menor a 6 meses; el navegador olvidará la política rápidamente.`,
          "Usar al menos max-age=31536000 e idealmente includeSubDomains y preload.", 0.6);
      return ok(v, desc, "Considerar añadir preload e incluirlo en hstspreload.org.");
    },
  },
  {
    name: "X-Frame-Options",
    category: "critical",
    weight: 12,
    evaluate: (v) => {
      const desc = "Previene que la página sea embebida en iframes maliciosos (clickjacking).";
      if (!v) return missing(desc,
        "Un atacante puede embeber el sitio en un iframe y engañar al usuario para que haga clics no deseados.",
        "X-Frame-Options: DENY");
      const u = v.toUpperCase();
      if (u === "DENY" || u === "SAMEORIGIN") return ok(v, desc, "Configuración correcta.");
      return improvable(v, desc, "Valor no estándar; algunos navegadores lo ignorarán.", "Usar DENY o SAMEORIGIN.", 0.5);
    },
  },
  {
    name: "X-Content-Type-Options",
    category: "critical",
    weight: 8,
    evaluate: (v) => {
      const desc = "Impide que el navegador adivine (sniff) el tipo MIME de la respuesta.";
      if (!v) return missing(desc,
        "Permite ataques tipo MIME sniffing que pueden convertir contenido en ejecutable.",
        "X-Content-Type-Options: nosniff");
      if (v.toLowerCase().trim() === "nosniff") return ok(v, desc, "Mantener.");
      return insecure(v, desc, "Valor distinto a 'nosniff' es inválido.", "X-Content-Type-Options: nosniff");
    },
  },
  {
    name: "Referrer-Policy",
    category: "critical",
    weight: 8,
    evaluate: (v) => {
      const desc = "Controla qué información del referrer se envía al navegar a otros sitios.";
      if (!v) return missing(desc,
        "Se filtran URLs completas a sitios externos, potencialmente exponiendo tokens o info sensible.",
        "Referrer-Policy: strict-origin-when-cross-origin");
      const good = ["no-referrer", "strict-origin", "strict-origin-when-cross-origin", "same-origin"];
      if (good.includes(v.toLowerCase().trim())) return ok(v, desc, "Configuración recomendada.");
      if (v.toLowerCase().includes("unsafe-url"))
        return insecure(v, desc, "unsafe-url envía siempre el referrer completo, incluso sobre HTTP.", "Referrer-Policy: strict-origin-when-cross-origin");
      return improvable(v, desc, "Política poco restrictiva.", "Referrer-Policy: strict-origin-when-cross-origin", 0.6);
    },
  },
  {
    name: "Permissions-Policy",
    category: "critical",
    weight: 7,
    evaluate: (v) => {
      const desc = "Restringe el acceso a APIs del navegador (cámara, micrófono, geolocalización, etc.).";
      if (!v) return missing(desc,
        "Sin restricciones, scripts de terceros pueden solicitar APIs sensibles.",
        "Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()");
      return ok(v, desc, "Revisar que las directivas cubran al menos camera, microphone y geolocation.");
    },
  },
  {
    name: "Cross-Origin-Opener-Policy",
    category: "recommended",
    weight: 5,
    evaluate: (v) => {
      const desc = "Aísla el contexto de navegación frente a popups de otros orígenes.";
      if (!v) return missing(desc, "Permite ataques tipo XS-Leaks vía window.opener.", "Cross-Origin-Opener-Policy: same-origin");
      if (v.toLowerCase().includes("same-origin")) return ok(v, desc, "Correcto.");
      return improvable(v, desc, "Política débil.", "Cross-Origin-Opener-Policy: same-origin", 0.6);
    },
  },
  {
    name: "Cross-Origin-Embedder-Policy",
    category: "recommended",
    weight: 4,
    evaluate: (v) => {
      const desc = "Requiere que los recursos embebidos opten explícitamente a ser cargados (CORP/CORS).";
      if (!v) return missing(desc, "Sin COEP no se pueden usar APIs aisladas como SharedArrayBuffer de forma segura.", "Cross-Origin-Embedder-Policy: require-corp");
      if (v.toLowerCase().includes("require-corp") || v.toLowerCase().includes("credentialless")) return ok(v, desc, "Correcto.");
      return improvable(v, desc, "Valor no aporta aislamiento.", "Cross-Origin-Embedder-Policy: require-corp", 0.5);
    },
  },
  {
    name: "Cross-Origin-Resource-Policy",
    category: "recommended",
    weight: 4,
    evaluate: (v) => {
      const desc = "Indica qué orígenes pueden incluir este recurso.";
      if (!v) return missing(desc, "Otros sitios pueden incluir tus recursos en ataques de side-channel.", "Cross-Origin-Resource-Policy: same-origin");
      if (v.toLowerCase().includes("same-origin") || v.toLowerCase().includes("same-site")) return ok(v, desc, "Correcto.");
      return improvable(v, desc, "cross-origin permite uso desde cualquier sitio.", "Cross-Origin-Resource-Policy: same-origin", 0.5);
    },
  },
  {
    name: "Server",
    category: "informational",
    weight: 3,
    evaluate: (v) => {
      const desc = "Identifica el servidor web. Si revela versión facilita ataques dirigidos.";
      if (!v) return ok("(no enviado)", desc, "Mantener oculto.");
      if (/\d/.test(v))
        return insecure(v, desc, "Expone versión del servidor: ayuda a un atacante a buscar exploits específicos.", "Ocultar la versión o eliminar el header en la configuración del servidor/proxy.");
      return improvable(v, desc, "Idealmente este header no se envía.", "Eliminar el header Server en la configuración del servidor.", 0.7);
    },
  },
  {
    name: "X-Powered-By",
    category: "informational",
    weight: 4,
    evaluate: (v) => {
      const desc = "Indica la tecnología del backend (PHP, Express, ASP.NET, etc.).";
      if (!v) return ok("(no enviado)", desc, "Mantener oculto.");
      return insecure(v, desc, "Revela el stack tecnológico: facilita la búsqueda de vulnerabilidades conocidas.", "Eliminar el header X-Powered-By en la app o proxy.");
    },
  },
];

export function buildFindings(headers: Record<string, string>): HeaderFinding[] {
  const lower: Record<string, string> = {};
  for (const [k, v] of Object.entries(headers)) lower[k.toLowerCase()] = v;
  return RULES.map((r) => {
    const val = lower[r.name.toLowerCase()] ?? null;
    const ev = r.evaluate(val);
    return { name: r.name, category: r.category, weight: r.weight, ...ev };
  });
}

export const _statusOrder: HeaderStatus[] = ["insecure", "missing", "improvable", "secure"];