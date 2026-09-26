import { memo, useMemo } from "react";
import type { AnalysisReport } from "@/lib/headers/types";
import { HeaderRow } from "./HeaderRow";
import { CATEGORIES, CATEGORY_TITLES, headersCount } from "./status";

export const ReportView = memo(function ReportView({
	report,
}: {
	report: AnalysisReport;
}) {
	const grouped = useMemo(() => {
		return CATEGORIES.map((c) => ({
			category: c,
			items: report.findings.filter((f) => f.category === c),
		})).filter((g) => g.items.length > 0);
	}, [report.findings]);

	return (
		<div className="space-y-20">
			{grouped.map((g, i) => (
				<section
					key={g.category}
					aria-labelledby={`cat-${g.category}`}
					className="reveal"
					style={{ "--i": i + 1 } as React.CSSProperties}
				>
					<div className="flex items-baseline justify-between gap-4 border-t border-rule pt-6">
						<h2 id={`cat-${g.category}`} className="text-4xl leading-none">
							{CATEGORY_TITLES[g.category]()}
						</h2>
						<span className="font-mono text-xs text-muted-foreground">
							{headersCount(g.items.length)}
						</span>
					</div>
					<div className="mt-4 divide-y divide-border">
						{g.items.map((f) => (
							<HeaderRow key={f.name} f={f} />
						))}
					</div>
				</section>
			))}
		</div>
	);
});
