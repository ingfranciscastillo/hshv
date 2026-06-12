import { Card } from "@/components/ui/card";
import type { AnalysisReport } from "@/lib/headers/types";

const LEVELS: Record<
	AnalysisReport["level"],
	{ label: string; color: string; bg: string }
> = {
	excellent: {
		label: "Excelente",
		color: "text-emerald-300",
		bg: "from-emerald-500/20",
	},
	acceptable: {
		label: "Aceptable",
		color: "text-cyan-300",
		bg: "from-cyan-500/20",
	},
	deficient: {
		label: "Deficiente",
		color: "text-amber-300",
		bg: "from-amber-500/20",
	},
	critical: {
		label: "Crítico",
		color: "text-rose-300",
		bg: "from-rose-500/20",
	},
};

export function ScoreCard({ report }: { report: AnalysisReport }) {
	const meta = LEVELS[report.level];
	return (
		<Card
			className={`p-6 sm:p-8 bg-transparent border-border animate-in fade-in slide-in-from-bottom-2`}
		>
			<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
						Puntuación de seguridad
					</div>
					<div className="flex items-baseline gap-3">
						<div
							className={`text-7xl font-bold tabular-nums ${meta.color}`}
							style={{ fontFamily: "Space Grotesk, sans-serif" }}
						>
							{report.score}
						</div>
						<div className="text-muted-foreground">/ 100</div>
					</div>
					<div
						className={`mt-1 text-sm font-semibold uppercase tracking-wider ${meta.color}`}
					>
						{meta.label}
					</div>
				</div>
				<div className="flex-1 sm:max-w-md">
					<div className="text-sm text-foreground/80 mb-2">
						{report.summary}
					</div>
					<div className="h-2 rounded-full bg-secondary overflow-hidden">
						<div
							className="h-full rounded-full transition-all duration-700"
							style={{
								width: `${report.score}%`,
								background:
									"linear-gradient(90deg,oklch(0.65 0.23 25),oklch(0.82 0.17 85),oklch(0.78 0.18 165))",
							}}
						/>
					</div>
					<div className="mt-3 text-xs text-muted-foreground break-all">
						{report.finalUrl} · status {report.statusCode} ·{" "}
						{new Date(report.fetchedAt).toLocaleString()} · {report.source}
					</div>
				</div>
			</div>
		</Card>
	);
}
