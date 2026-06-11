import { Activity, AlertOctagon, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { AnalysisReport } from "@/lib/headers/types";

export function DashboardCards({ items }: { items: AnalysisReport[] }) {
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

	return (
		<div className="grid gap-4 sm:grid-cols-3">
			<Card className="p-5 bg-transparent border-border">
				<div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
					<Activity className="size-4 text-primary" /> Análisis
				</div>
				<div
					className="mt-2 text-4xl font-bold tabular-nums"
					style={{ fontFamily: "Space Grotesk, sans-serif" }}
				>
					{total}
				</div>
			</Card>
			<Card className="p-5 bg-transparent border-border">
				<div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
					<TrendingUp className="size-4 text-primary" /> Score promedio
				</div>
				<div
					className="mt-2 text-4xl font-bold tabular-nums"
					style={{ fontFamily: "Space Grotesk, sans-serif" }}
				>
					{avg}
				</div>
			</Card>
			<Card className="p-5 bg-transparent border-border">
				<div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
					<AlertOctagon className="size-4 text-primary" /> Headers más ausentes
				</div>
				{topMissing.length ? (
					<ul className="mt-2 space-y-1 text-sm">
						{topMissing.map(([n, c]) => (
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
}
