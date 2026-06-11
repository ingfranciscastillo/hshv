import type { AnalysisReport, HeaderFinding } from "./types";

export function computeScore(findings: HeaderFinding[]): {
	score: number;
	level: AnalysisReport["level"];
	summary: string;
} {
	const totalWeight = findings.reduce((s, f) => s + f.weight, 0);
	const earned = findings.reduce((s, f) => s + f.weight * f.score, 0);
	const score = Math.round((earned / totalWeight) * 100);

	const level: AnalysisReport["level"] =
		score >= 90
			? "excellent"
			: score >= 70
				? "acceptable"
				: score >= 40
					? "deficient"
					: "critical";

	const counts = { missing: 0, insecure: 0, improvable: 0, secure: 0 };
	for (const f of findings) counts[f.status]++;
	const summary = `${counts.secure} OK · ${counts.improvable} mejorables · ${counts.missing} ausentes · ${counts.insecure} inseguros`;

	return { score, level, summary };
}
