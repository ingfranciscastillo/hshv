import { memo, useMemo } from "react";
import type { AnalysisReport, HeaderCategory } from "@/lib/headers/types";
import { HeaderRow } from "./HeaderRow";

const TITLES: Record<HeaderCategory, string> = {
	critical: "Críticos",
	recommended: "Recomendados",
	informational: "Informativos",
};

const CATEGORIES: HeaderCategory[] = [
	"critical",
	"recommended",
	"informational",
];

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
		<div className="space-y-8">
			{grouped.map((g) => (
				<section key={g.category}>
					<h2 className="text-lg font-bold mb-3 flex items-center gap-2">
						<span className="inline-block size-2 rounded-full bg-primary" />{" "}
						{TITLES[g.category]}
					</h2>
					<div className="space-y-3">
						{g.items.map((f) => (
							<HeaderRow key={f.name} f={f} />
						))}
					</div>
				</section>
			))}
		</div>
	);
});
