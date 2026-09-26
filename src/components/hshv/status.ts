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
import { m } from "@/paraglide/messages.js";

// Labels are functions so they resolve in the current locale at render time.

export const STATUS: Record<
	HeaderStatus,
	{ label: () => string; icon: Icon; text: string }
> = {
	secure: {
		label: m.status_secure,
		icon: CheckCircleIcon,
		text: "text-status-secure",
	},
	improvable: {
		label: m.status_improvable,
		icon: WarningCircleIcon,
		text: "text-status-improvable",
	},
	missing: {
		label: m.status_missing,
		icon: XCircleIcon,
		text: "text-status-missing",
	},
	insecure: {
		label: m.status_insecure,
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
	{ label: () => string; text: string }
> = {
	excellent: { label: m.level_excellent, text: "text-status-secure" },
	acceptable: { label: m.level_acceptable, text: "text-primary" },
	deficient: { label: m.level_deficient, text: "text-status-improvable" },
	critical: { label: m.level_critical, text: "text-status-insecure" },
};

export const CATEGORY_TITLES: Record<HeaderCategory, () => string> = {
	critical: m.category_critical,
	recommended: m.category_recommended,
	informational: m.category_informational,
};

export const CATEGORIES: HeaderCategory[] = [
	"critical",
	"recommended",
	"informational",
];

export const headersCount = (count: number) =>
	count === 1
		? m.headers_count_one({ count })
		: m.headers_count_other({ count });
