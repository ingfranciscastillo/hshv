import type { HeaderFinding } from "@/lib/headers/types";
import { STATUS } from "./status";

export function HeaderRow({ f }: { f: HeaderFinding }) {
	const s = STATUS[f.status];
	const Icon = s.icon;
	return (
		<article className="grid gap-5 py-8 lg:grid-cols-12 lg:gap-12">
			<div className="lg:col-span-4">
				<h3 className="font-mono text-[15px] font-medium tracking-normal break-words">
					{f.name}
				</h3>
				<div className={`mt-2 flex items-center gap-2 text-sm ${s.text}`}>
					<Icon className="size-[18px]" aria-hidden="true" />
					{s.label}
				</div>
			</div>

			<div className="space-y-5 lg:col-span-8">
				<p className="max-w-[68ch] text-[15px] leading-relaxed">
					{f.description}
				</p>
				<p className="max-w-[68ch] text-[15px] leading-relaxed text-muted-foreground">
					<span className="font-medium text-foreground">Riesgo. </span>
					{f.risk}
				</p>

				<div className="grid gap-4 xl:grid-cols-2">
					<div className="space-y-2">
						<div className="font-mono text-xs text-muted-foreground">
							Valor detectado
						</div>
						<code className="block bg-muted px-3 py-2.5 text-xs leading-relaxed break-all">
							{f.detected ?? (
								<span className="text-muted-foreground italic">
									No presente
								</span>
							)}
						</code>
					</div>
					<div className="space-y-2">
						<div className="font-mono text-xs text-muted-foreground">
							Recomendación
						</div>
						<code className="block border-l-2 border-primary bg-primary/[0.07] px-3 py-2.5 text-xs leading-relaxed break-all">
							{f.recommendation}
						</code>
					</div>
				</div>
			</div>
		</article>
	);
}
