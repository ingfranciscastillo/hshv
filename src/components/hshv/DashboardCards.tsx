import { memo, useMemo } from "react";
import type { AnalysisReport } from "@/lib/headers/types";
import { m } from "@/paraglide/messages.js";

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
		<dl className="grid border-y border-rule sm:grid-cols-[1fr_1fr_1.6fr]">
			<div className="py-6 sm:pr-8">
				<dt className="font-mono text-xs text-muted-foreground">
					{m.stats_total()}
				</dt>
				<dd className="mt-3 font-serif text-6xl leading-none tabular-nums">
					{stats.total}
				</dd>
			</div>
			<div className="border-t border-border py-6 sm:border-t-0 sm:border-l sm:px-8">
				<dt className="font-mono text-xs text-muted-foreground">
					{m.stats_average()}
				</dt>
				<dd className="mt-3 flex items-end gap-2">
					<span className="font-serif text-6xl leading-none tabular-nums">
						{stats.avg}
					</span>
					<span className="pb-1 font-mono text-xs text-muted-foreground">
						/ 100
					</span>
				</dd>
			</div>
			<div className="border-t border-border py-6 sm:border-t-0 sm:border-l sm:pl-8">
				<dt className="font-mono text-xs text-muted-foreground">
					{m.stats_top_missing()}
				</dt>
				<dd className="mt-3">
					{stats.topMissing.length ? (
						<ol className="space-y-1.5 font-mono text-[13px]">
							{stats.topMissing.map(([n, c]) => (
								<li key={n} className="flex justify-between gap-4">
									<span className="truncate">{n}</span>
									<span className="text-status-missing tabular-nums">{c}</span>
								</li>
							))}
						</ol>
					) : (
						<p className="text-sm text-muted-foreground">{m.stats_no_data()}</p>
					)}
				</dd>
			</div>
		</dl>
	);
});
