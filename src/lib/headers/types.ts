import type { Text } from "@/lib/i18n";

export type HeaderStatus = "secure" | "improvable" | "missing" | "insecure";
export type HeaderCategory = "critical" | "recommended" | "informational";

export interface HeaderFinding {
	name: string;
	category: HeaderCategory;
	status: HeaderStatus;
	detected: string | null;
	// Message references (or plain strings for reports saved before i18n).
	description: Text;
	risk: Text;
	recommendation: Text;
	score: number; // 0..1 contribution within its weight
	weight: number;
}

export interface AnalysisReport {
	url: string;
	finalUrl: string;
	statusCode: number;
	fetchedAt: string;
	source: "direct" | "firecrawl";
	score: number; // 0-100
	level: "critical" | "deficient" | "acceptable" | "excellent";
	summary: string;
	findings: HeaderFinding[];
	rawHeaders: Record<string, string>;
}
