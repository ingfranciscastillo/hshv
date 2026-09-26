import {
	CheckCircleIcon,
	type Icon,
	ShieldWarningIcon,
	WarningCircleIcon,
	XCircleIcon,
} from "@phosphor-icons/react";
import type {
	AnalysisReport,
	HeaderCategory,
	HeaderStatus,
} from "@/lib/headers/types";

export const STATUS: Record<
	HeaderStatus,
	{ label: string; icon: Icon; text: string }
> = {
	secure: {
		label: "Seguro",
		icon: CheckCircleIcon,
		text: "text-status-secure",
	},
	improvable: {
		label: "Mejorable",
		icon: WarningCircleIcon,
		text: "text-status-improvable",
	},
	missing: { label: "Ausente", icon: XCircleIcon, text: "text-status-missing" },
	insecure: {
		label: "Inseguro",
		icon: ShieldWarningIcon,
		text: "text-status-insecure",
	},
};

export const STATUS_ORDER: HeaderStatus[] = [
	"secure",
	"improvable",
	"missing",
	"insecure",
];

export const LEVELS: Record<
	AnalysisReport["level"],
	{ label: string; text: string }
> = {
	excellent: { label: "Excelente", text: "text-status-secure" },
	acceptable: { label: "Aceptable", text: "text-primary" },
	deficient: { label: "Deficiente", text: "text-status-improvable" },
	critical: { label: "Crítico", text: "text-status-insecure" },
};

export const CATEGORY_TITLES: Record<HeaderCategory, string> = {
	critical: "Críticos",
	recommended: "Recomendados",
	informational: "Informativos",
};

export const CATEGORIES: HeaderCategory[] = [
	"critical",
	"recommended",
	"informational",
];
