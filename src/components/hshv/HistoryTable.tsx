import { ArrowRightIcon, TrashIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { exportJson } from "@/lib/headers/export";
import type { AnalysisReport } from "@/lib/headers/types";
import { m } from "@/paraglide/messages.js";
import { getLocale } from "@/paraglide/runtime.js";
import { LEVELS } from "./status";

export function HistoryTable({
	items,
	onClear,
}: {
	items: AnalysisReport[];
	onClear: () => void;
}) {
	if (!items.length) {
		return (
			<div className="border-t border-rule pt-10 pb-16">
				<h2 className="text-3xl leading-tight">
					{m.history_empty_before()}
					<em>{m.history_empty_emphasis()}</em>
				</h2>
				<p className="mt-3 max-w-[48ch] text-muted-foreground">
					{m.history_empty_body()}
				</p>
				<Link
					to="/"
					className="group mt-8 inline-flex h-11 items-center gap-3 bg-foreground px-6 text-sm font-medium text-background transition-transform active:scale-[0.98]"
				>
					{m.history_empty_cta()}
					<ArrowRightIcon
						className="size-[18px] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
						aria-hidden="true"
					/>
				</Link>
			</div>
		);
	}
	return (
		<section aria-labelledby="records-title">
			<div className="flex items-baseline justify-between gap-4 border-t border-rule pt-6">
				<h2 id="records-title" className="text-3xl leading-none">
					{m.records_title()}
				</h2>
				<div className="flex items-center gap-5">
					<span className="font-mono text-xs text-muted-foreground">
						{items.length === 1
							? m.records_count_one({ count: items.length })
							: m.records_count_other({ count: items.length })}
					</span>
					<button
						type="button"
						onClick={onClear}
						className="flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
					>
						<TrashIcon className="size-[18px]" aria-hidden="true" />
						{m.records_clear()}
					</button>
				</div>
			</div>
			<div className="mt-4 overflow-x-auto">
				<table className="w-full min-w-[640px] text-sm">
					<thead className="font-mono text-xs text-muted-foreground">
						<tr>
							<th className="py-3 pr-4 text-left font-normal">{m.th_date()}</th>
							<th className="py-3 pr-4 text-left font-normal">{m.th_url()}</th>
							<th className="py-3 pr-4 text-right font-normal">
								{m.th_score()}
							</th>
							<th className="py-3 pr-4 text-left font-normal">
								{m.th_level()}
							</th>
							<th className="py-3">
								<span className="sr-only">{m.th_actions()}</span>
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border border-t border-border">
						{items.map((r, i) => {
							const level = LEVELS[r.level];
							return (
								<tr
									// biome-ignore lint/suspicious/noArrayIndexKey: funciona
									key={i}
									className="transition-colors hover:bg-muted/60"
								>
									<td className="py-4 pr-4 font-mono text-xs whitespace-nowrap text-muted-foreground">
										{new Date(r.fetchedAt).toLocaleString(getLocale())}
									</td>
									<td className="max-w-xs py-4 pr-4 font-mono text-[13px] break-all">
										{r.finalUrl}
									</td>
									<td
										className={`py-4 pr-4 text-right font-serif text-2xl leading-none tabular-nums ${level.text}`}
									>
										{r.score}
									</td>
									<td className={`py-4 pr-4 font-serif italic ${level.text}`}>
										{level.label()}
									</td>
									<td className="py-4 text-right">
										<button
											type="button"
											onClick={() => exportJson(r)}
											className="cursor-pointer border border-input px-3 py-1.5 font-mono text-xs transition-colors hover:bg-accent"
										>
											JSON
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</section>
	);
}
