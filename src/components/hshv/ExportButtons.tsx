import {
	BracketsCurlyIcon,
	CopyIcon,
	FileHtmlIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { exportHtml, exportJson } from "@/lib/headers/export";
import type { AnalysisReport } from "@/lib/headers/types";
import { m } from "@/paraglide/messages.js";

const BTN =
	"inline-flex h-10 cursor-pointer items-center gap-2 border border-input px-4 text-sm transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-accent active:scale-[0.98]";

export function ExportButtons({ report }: { report: AnalysisReport }) {
	return (
		<div className="flex flex-wrap gap-2">
			<button type="button" className={BTN} onClick={() => exportJson(report)}>
				<BracketsCurlyIcon className="size-[18px]" aria-hidden="true" />
				JSON
			</button>
			<button type="button" className={BTN} onClick={() => exportHtml(report)}>
				<FileHtmlIcon className="size-[18px]" aria-hidden="true" />
				HTML
			</button>
			<button
				type="button"
				className={BTN}
				onClick={() =>
					navigator.clipboard
						.writeText(JSON.stringify(report, null, 2))
						.then(() => toast.success(m.copied_json()))
						.catch(() => toast.error(m.copy_failed()))
				}
			>
				<CopyIcon className="size-[18px]" aria-hidden="true" />
				{m.copy_json()}
			</button>
		</div>
	);
}
