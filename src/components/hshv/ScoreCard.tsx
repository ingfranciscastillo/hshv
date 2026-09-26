import { useMemo } from "react";
import type { AnalysisReport } from "@/lib/headers/types";
import { m } from "@/paraglide/messages.js";
import { getLocale } from "@/paraglide/runtime.js";
import { ExportButtons } from "./ExportButtons";
import { LEVELS, STATUS, STATUS_ORDER } from "./status";

function hostOf(url: string) {
	try {
		return new URL(url).host;
	} catch {
		return url;
	}
}

export function ScoreCard({ report }: { report: AnalysisReport }) {
	const level = LEVELS[report.level];
	const counts = useMemo(() => {
		const c = { secure: 0, improvable: 0, missing: 0, insecure: 0 };
		for (const f of report.findings) c[f.status]++;
		return c;
	}, [report.findings]);

	return (
		<section
			aria-labelledby="report-title"
			className="reveal border-t border-rule pt-8"
		>
			<div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
				<div className="lg:col-span-5">
					<div className="font-mono text-xs text-muted-foreground">
						{m.score_label()}
					</div>
					<div className="mt-8 flex items-end gap-3">
						<span
							className={`font-serif text-[8rem] leading-[0.8] tracking-[-0.04em] tabular-nums sm:text-[10rem] ${level.text}`}
						>
							{report.score}
						</span>
						<span className="pb-2 font-mono text-sm text-muted-foreground">
							/ 100
						</span>
					</div>
					<div
						className={`mt-5 pb-1 font-serif text-3xl leading-[1.1] italic ${level.text}`}
					>
						{level.label()}
					</div>
				</div>

				<div className="space-y-8 lg:col-span-7">
					<div className="space-y-3">
						<h2
							id="report-title"
							className="text-3xl leading-[1.1] break-words sm:text-4xl"
						>
							{hostOf(report.finalUrl)}
						</h2>
					</div>

					<dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
						{STATUS_ORDER.map((s) => (
							<div key={s}>
								<dt className="font-mono text-xs text-muted-foreground">
									{STATUS[s].label()}
								</dt>
								<dd
									className={`mt-1 font-serif text-4xl leading-none tabular-nums ${counts[s] ? STATUS[s].text : "text-muted-foreground/60"}`}
								>
									{counts[s]}
								</dd>
							</div>
						))}
					</dl>

					<dl className="grid gap-x-6 gap-y-3 border-t border-border pt-5 font-mono text-xs sm:grid-cols-[auto_1fr]">
						<dt className="text-muted-foreground">{m.report_final_url()}</dt>
						<dd className="break-all">{report.finalUrl}</dd>
						<dt className="text-muted-foreground">{m.report_http_status()}</dt>
						<dd>{report.statusCode}</dd>
						<dt className="text-muted-foreground">{m.report_date()}</dt>
						<dd>{new Date(report.fetchedAt).toLocaleString(getLocale())}</dd>
						<dt className="text-muted-foreground">{m.report_source()}</dt>
						<dd>
							{report.source === "firecrawl"
								? m.source_firecrawl()
								: m.source_direct()}
						</dd>
					</dl>

					<ExportButtons report={report} />
				</div>
			</div>
		</section>
	);
}
