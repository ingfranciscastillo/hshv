import {
	AlertTriangle,
	CheckCircle2,
	ShieldAlert,
	XCircle,
} from "lucide-react";
import type { HeaderFinding } from "@/lib/headers/types";

const STATUS = {
	secure: {
		icon: CheckCircle2,
		label: "Seguro",
		color: "text-emerald-400",
		border: "border-l-emerald-500",
	},
	improvable: {
		icon: AlertTriangle,
		label: "Mejorable",
		color: "text-amber-400",
		border: "border-l-amber-500",
	},
	missing: {
		icon: XCircle,
		label: "Ausente",
		color: "text-rose-400",
		border: "border-l-rose-500",
	},
	insecure: {
		icon: ShieldAlert,
		label: "Inseguro",
		color: "text-red-500",
		border: "border-l-red-600",
	},
} as const;

export function HeaderRow({ f }: { f: HeaderFinding }) {
	const s = STATUS[f.status];
	const Icon = s.icon;
	return (
		<div
			className={`p-4 sm:p-5 bg-transparent border border-border border-l-4 ${s.border} rounded-lg`}
		>
			<div className="flex items-start justify-between gap-4 flex-wrap">
				<div className="flex items-center gap-3">
					<Icon className={`size-5 ${s.color}`} />
					<div>
						<h3 className="font-semibold text-base">{f.name}</h3>
						<div className="text-xs uppercase tracking-wider text-muted-foreground">
							{f.category}
						</div>
					</div>
				</div>
				<span
					className={`text-xs font-bold uppercase tracking-wider ${s.color}`}
				>
					{s.label}
				</span>
			</div>
			<div className="mt-4 space-y-3 text-sm">
				<div>
					<div className="text-xs text-muted-foreground mb-1">
						Valor detectado
					</div>
					<code className="block bg-background/60 border border-border rounded px-2 py-1.5 text-xs break-all">
						{f.detected ?? "— no presente —"}
					</code>
				</div>
				<div>
					<div className="text-xs text-muted-foreground mb-1">Descripción</div>
					<p className="text-foreground/85">{f.description}</p>
				</div>
				<div>
					<div className="text-xs text-muted-foreground mb-1">Riesgo</div>
					<p className="text-foreground/85">{f.risk}</p>
				</div>
				<div>
					<div className="text-xs text-muted-foreground mb-1">
						Recomendación
					</div>
					<code className="block bg-primary/10 border border-primary/30 text-primary rounded px-2 py-1.5 text-xs break-all">
						{f.recommendation}
					</code>
				</div>
			</div>
		</div>
	);
}
