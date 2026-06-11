import type { AnalysisReport, HeaderFinding } from "./types";

function statusLabel(s: HeaderFinding["status"]) {
	return s === "secure"
		? "✅ Seguro"
		: s === "improvable"
			? "⚠️ Mejorable"
			: s === "missing"
				? "❌ Ausente"
				: "🚨 Inseguro";
}

function statusColor(s: HeaderFinding["status"]) {
	return s === "secure"
		? "#16a34a"
		: s === "improvable"
			? "#d97706"
			: s === "missing"
				? "#dc2626"
				: "#b91c1c";
}

function escapeHtml(s: string) {
	return s.replace(/[&<>"']/g, (c) => {
		return {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
		}[c]!;
	});
}

export function reportToHtml(r: AnalysisReport): string {
	const rows = r.findings
		.map(
			(f) => `
    <tr>
      <td><strong>${escapeHtml(f.name)}</strong><div style="color:#64748b;font-size:12px">${f.category}</div></td>
      <td><span style="color:${statusColor(f.status)};font-weight:600">${statusLabel(f.status)}</span></td>
      <td><code style="background:#0f172a;color:#e2e8f0;padding:2px 6px;border-radius:4px;word-break:break-all">${escapeHtml(f.detected ?? "—")}</code></td>
      <td>${escapeHtml(f.description)}</td>
      <td>${escapeHtml(f.risk)}</td>
      <td><code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;word-break:break-all">${escapeHtml(f.recommendation)}</code></td>
    </tr>`,
		)
		.join("");

	return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Reporte — ${escapeHtml(r.url)}</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0b1220;color:#e2e8f0;margin:0;padding:32px}
  .card{background:#111a2e;border:1px solid #1e293b;border-radius:12px;padding:24px;margin-bottom:24px}
  h1{margin:0 0 8px;font-size:24px}
  .url{color:#94a3b8;word-break:break-all}
  .score{font-size:64px;font-weight:800;line-height:1}
  .bar{height:10px;background:#1e293b;border-radius:6px;overflow:hidden;margin-top:12px}
  .bar > div{height:100%;background:linear-gradient(90deg,#ef4444,#f59e0b,#10b981)}
  table{width:100%;border-collapse:collapse;background:#111a2e}
  th,td{padding:12px;border-bottom:1px solid #1e293b;vertical-align:top;text-align:left;font-size:13px}
  th{background:#0f172a;color:#94a3b8;text-transform:uppercase;font-size:11px;letter-spacing:.05em}
</style></head><body>
<div class="card">
  <h1>HTTP Security Headers Report</h1>
  <div class="url">${escapeHtml(r.finalUrl)}</div>
  <div style="margin-top:16px;display:flex;align-items:flex-end;gap:24px;flex-wrap:wrap">
    <div><div class="score">${r.score}</div><div style="color:#94a3b8">/ 100 · ${r.level}</div></div>
    <div style="flex:1;min-width:240px"><div>${escapeHtml(r.summary)}</div><div class="bar"><div style="width:${r.score}%"></div></div></div>
  </div>
  <div style="margin-top:12px;color:#64748b;font-size:12px">Analizado ${new Date(r.fetchedAt).toLocaleString()} · status ${r.statusCode} · fuente ${r.source}</div>
</div>
<div class="card" style="padding:0;overflow:hidden">
<table>
<thead><tr><th>Header</th><th>Estado</th><th>Valor</th><th>Descripción</th><th>Riesgo</th><th>Recomendación</th></tr></thead>
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
