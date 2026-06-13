import { Copy, FileCode2, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportHtml, exportJson } from "@/lib/headers/export";
import type { AnalysisReport } from "@/lib/headers/types";

export function ExportButtons({ report }: { report: AnalysisReport }) {
	return (
		<div className="flex flex-wrap gap-2">
			<Button variant="outline" size="sm" onClick={() => exportJson(report)}>
				<FileJson className="size-4 mr-2" aria-hidden="true" /> JSON
			</Button>
			<Button variant="outline" size="sm" onClick={() => exportHtml(report)}>
				<FileCode2 className="size-4 mr-2" aria-hidden="true" /> HTML
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() =>
					navigator.clipboard.writeText(JSON.stringify(report, null, 2))
				}
			>
				<Copy className="size-4 mr-2" aria-hidden="true" /> Copiar JSON
			</Button>
		</div>
	);
}
