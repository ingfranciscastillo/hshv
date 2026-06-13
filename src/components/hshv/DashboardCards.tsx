import { Activity, AlertOctagon, TrendingUp } from "lucide-react";
import { memo, useMemo } from "react";
import { Card } from "@/components/ui/card";
import type { AnalysisReport } from "@/lib/headers/types";

interface DashboardCardsProps {
	items: AnalysisReport[];
}

export const DashboardCards = memo(function DashboardCards({
	items,
}: DashboardCardsProps) {
	const stats = useMemo(() => {
		const total = items.length;
		const avg = total
			? Math.round(items.reduce((s, r) => s + r.score, 0) / total)
			: 0;
		const missingCount: Record<string, number> = {};
		for (const r of items)
			for (const f of r.findings)
				if (f.status === "missing")
					missingCount[f.name] = (missingCount[f.name] ?? 0) + 1;
		const topMissing = Object.entries(missingCount)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 5);
		return { total, avg, topMissing };
	}, [items]);

	return (
		<div className="grid gap-4 sm:grid-cols-3">
			<Card className="p-5 bg-transparent backdrop-blur-xs border-border">
				<div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
					<Activity className="size-4 text-primary" aria-hidden="true" />{" "}
					Análisis
				</div>
				<div
					className="mt-2 text-4xl font-bold tabular-nums"
					style={{ fontFamily: "Space Grotesk, sans-serif" }}
				>
					{stats.total}
				</div>
			</Card>
			<Card className="p-5 bg-transparent backdrop-blur-xs border-border">
				<div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
					<TrendingUp className="size-4 text-primary" aria-hidden="true" />{" "}
					Score promedio
				</div>
				<div
					className="mt-2 text-4xl font-bold tabular-nums"
					style={{ fontFamily: "Space Grotesk, sans-serif" }}
				>
					{stats.avg}
				</div>
			</Card>
			<Card className="p-5 bg-transparent backdrop-blur-xs border-border">
				<div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
					<AlertOctagon className="size-4 text-primary" aria-hidden="true" />{" "}
					Headers más ausentes
				</div>
				{stats.topMissing.length ? (
					<ul className="mt-2 space-y-1 text-sm">
						{stats.topMissing.map(([n, c]) => (
							<li key={n} className="flex justify-between gap-2">
								<span className="truncate">{n}</span>
								<span className="text-muted-foreground tabular-nums">{c}</span>
							</li>
						))}
					</ul>
				) : (
					<div className="mt-2 text-sm text-muted-foreground">Sin datos.</div>
				)}
			</Card>
		</div>
	);
});
