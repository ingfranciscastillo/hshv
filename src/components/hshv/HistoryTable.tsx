import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportJson } from "@/lib/headers/export";
import type { AnalysisReport } from "@/lib/headers/types";

export function HistoryTable({
	items,
	onClear,
}: {
	items: AnalysisReport[];
	onClear: () => void;
}) {
	if (!items.length) {
		return (
			<div className="text-center text-muted-foreground py-12 border border-dashed border-border rounded-lg">
				Sin análisis aún. Ejecuta uno desde la página principal.
			</div>
		);
	}
	return (
		<div className="bg-transparent backdrop-blur-xs border border-border rounded-lg overflow-hidden">
			<div className="flex items-center justify-between p-3 border-b border-border">
				<div className="text-sm text-muted-foreground">
					{items.length} análisis
				</div>
				<Button variant="ghost" size="sm" onClick={onClear}>
					<Trash2 className="size-4 mr-1" /> Limpiar
				</Button>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead className="bg-background/50 text-xs uppercase tracking-wider text-muted-foreground">
						<tr>
							<th className="text-left p-3">Fecha</th>
							<th className="text-left p-3">URL</th>
							<th className="text-right p-3">Score</th>
							<th className="text-left p-3">Nivel</th>
							<th className="p-3"></th>
						</tr>
					</thead>
					<tbody>
						{items.map((r, i) => (
							<tr
								// biome-ignore lint/suspicious/noArrayIndexKey: funciona
								key={i}
								className="border-t border-border hover:bg-background/30"
							>
								<td className="p-3 text-muted-foreground whitespace-nowrap">
									{new Date(r.fetchedAt).toLocaleString()}
								</td>
								<td className="p-3 break-all max-w-xs">{r.finalUrl}</td>
								<td className="p-3 text-right font-bold tabular-nums">
									{r.score}
								</td>
								<td className="p-3 capitalize">{r.level}</td>
								<td className="p-3 text-right">
									<Button
										variant="outline"
										size="sm"
										onClick={() => exportJson(r)}
									>
										JSON
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
