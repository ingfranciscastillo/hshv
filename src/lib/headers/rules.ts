import { msg, type Text } from "@/lib/i18n";
import type { HeaderCategory, HeaderFinding, HeaderStatus } from "./types";

type Eval = Omit<HeaderFinding, "name" | "category" | "weight">;

interface Rule {
	name: string;
	category: HeaderCategory;
	weight: number;
	evaluate: (value: string | null) => Eval;
}

// Texts are message references resolved on the client, so a stored report
// renders in whichever locale the viewer uses. Header configurations are
// language-neutral and stay as plain strings.

const ok = (
	detected: string | null,
	description: Text,
	recommendation: Text,
): Eval => ({
	status: "secure",
	detected,
	description,
	risk: msg("rule_ok_risk"),
	recommendation,
	score: 1,
});

const improvable = (
	detected: string,
	description: Text,
	risk: Text,
	recommendation: Text,
	score = 0.6,
): Eval => ({
	status: "improvable",
	detected,
	description,
	risk,
	recommendation,
	score,
});

const missing = (
	description: Text,
	risk: Text,
	recommendation: Text,
): Eval => ({
	status: "missing",
	detected: null,
	description,
	risk,
	recommendation,
	score: 0,
});

const insecure = (
	detected: string,
	description: Text,
	risk: Text,
	recommendation: Text,
): Eval => ({
	status: "insecure",
	detected,
	description,
	risk,
	recommendation,
	score: 0,
});

export const RULES: Rule[] = [
	{
		name: "Content-Security-Policy",
		category: "critical",
		weight: 25,
		evaluate: (v) => {
			const desc = msg("rule_csp_desc");
			if (!v)
				return missing(
					desc,
					msg("rule_csp_missing_risk"),
					"Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'",
				);
			const lower = v.toLowerCase();
			if (
				lower.includes("unsafe-inline") ||
				lower.includes("unsafe-eval") ||
				lower.includes("*")
			)
				return improvable(
					v,
					desc,
					msg("rule_csp_unsafe_risk"),
					msg("rule_csp_unsafe_rec"),
					0.5,
				);
			return ok(v, desc, msg("rule_csp_ok_rec"));
		},
	},
	{
		name: "Strict-Transport-Security",
		category: "critical",
		weight: 20,
		evaluate: (v) => {
			const desc = msg("rule_hsts_desc");
			if (!v)
				return missing(
					desc,
					msg("rule_hsts_missing_risk"),
					"Strict-Transport-Security: max-age=63072000; includeSubDomains; preload",
				);
			const m = /max-age=(\d+)/i.exec(v);
			const age = m ? Number(m[1]) : 0;
			if (age < 15552000)
				return improvable(
					v,
					desc,
					msg("rule_hsts_short_risk", { age }),
					msg("rule_hsts_short_rec"),
					0.6,
				);
			return ok(v, desc, msg("rule_hsts_ok_rec"));
		},
	},
	{
		name: "X-Frame-Options",
		category: "critical",
		weight: 12,
		evaluate: (v) => {
			const desc = msg("rule_xfo_desc");
			if (!v)
				return missing(
					desc,
					msg("rule_xfo_missing_risk"),
					"X-Frame-Options: DENY",
				);
			const u = v.toUpperCase();
			if (u === "DENY" || u === "SAMEORIGIN")
				return ok(v, desc, msg("rule_config_correct"));
			return improvable(
				v,
				desc,
				msg("rule_xfo_nonstandard_risk"),
				msg("rule_xfo_nonstandard_rec"),
				0.5,
			);
		},
	},
	{
		name: "X-Content-Type-Options",
		category: "critical",
		weight: 8,
		evaluate: (v) => {
			const desc = msg("rule_xcto_desc");
			if (!v)
				return missing(
					desc,
					msg("rule_xcto_missing_risk"),
					"X-Content-Type-Options: nosniff",
				);
			if (v.toLowerCase().trim() === "nosniff")
				return ok(v, desc, msg("rule_keep"));
			return insecure(
				v,
				desc,
				msg("rule_xcto_invalid_risk"),
				"X-Content-Type-Options: nosniff",
			);
		},
	},
	{
		name: "Referrer-Policy",
		category: "critical",
		weight: 8,
		evaluate: (v) => {
			const desc = msg("rule_rp_desc");
			if (!v)
				return missing(
					desc,
					msg("rule_rp_missing_risk"),
					"Referrer-Policy: strict-origin-when-cross-origin",
				);
			const good = [
				"no-referrer",
				"strict-origin",
				"strict-origin-when-cross-origin",
				"same-origin",
			];
			if (good.includes(v.toLowerCase().trim()))
				return ok(v, desc, msg("rule_config_recommended"));
			if (v.toLowerCase().includes("unsafe-url"))
				return insecure(
					v,
					desc,
					msg("rule_rp_unsafe_risk"),
					"Referrer-Policy: strict-origin-when-cross-origin",
				);
			return improvable(
				v,
				desc,
				msg("rule_rp_weak_risk"),
				"Referrer-Policy: strict-origin-when-cross-origin",
				0.6,
			);
		},
	},
	{
		name: "Permissions-Policy",
		category: "critical",
		weight: 7,
		evaluate: (v) => {
			const desc = msg("rule_pp_desc");
			if (!v)
				return missing(
					desc,
					msg("rule_pp_missing_risk"),
					"Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()",
				);
			return ok(v, desc, msg("rule_pp_ok_rec"));
		},
	},
	{
		name: "Cross-Origin-Opener-Policy",
		category: "recommended",
		weight: 5,
		evaluate: (v) => {
			const desc = msg("rule_coop_desc");
			if (!v)
				return missing(
					desc,
					msg("rule_coop_missing_risk"),
					"Cross-Origin-Opener-Policy: same-origin",
				);
			if (v.toLowerCase().includes("same-origin"))
				return ok(v, desc, msg("rule_correct"));
			return improvable(
				v,
				desc,
				msg("rule_weak_policy"),
				"Cross-Origin-Opener-Policy: same-origin",
				0.6,
			);
		},
	},
	{
		name: "Cross-Origin-Embedder-Policy",
		category: "recommended",
		weight: 4,
		evaluate: (v) => {
			const desc = msg("rule_coep_desc");
			if (!v)
				return missing(
					desc,
					msg("rule_coep_missing_risk"),
					"Cross-Origin-Embedder-Policy: require-corp",
				);
			if (
				v.toLowerCase().includes("require-corp") ||
				v.toLowerCase().includes("credentialless")
			)
				return ok(v, desc, msg("rule_correct"));
			return improvable(
				v,
				desc,
				msg("rule_coep_weak_risk"),
				"Cross-Origin-Embedder-Policy: require-corp",
				0.5,
			);
		},
	},
	{
		name: "Cross-Origin-Resource-Policy",
		category: "recommended",
		weight: 4,
		evaluate: (v) => {
			const desc = msg("rule_corp_desc");
			if (!v)
				return missing(
					desc,
					msg("rule_corp_missing_risk"),
					"Cross-Origin-Resource-Policy: same-origin",
				);
			if (
				v.toLowerCase().includes("same-origin") ||
				v.toLowerCase().includes("same-site")
			)
				return ok(v, desc, msg("rule_correct"));
			return improvable(
				v,
				desc,
				msg("rule_corp_weak_risk"),
				"Cross-Origin-Resource-Policy: same-origin",
				0.5,
			);
		},
	},
	{
		name: "Server",
		category: "informational",
		weight: 3,
		evaluate: (v) => {
			const desc = msg("rule_server_desc");
			if (!v) return ok(null, desc, msg("rule_keep_hidden"));
			if (/\d/.test(v))
				return insecure(
					v,
					desc,
					msg("rule_server_version_risk"),
					msg("rule_server_version_rec"),
				);
			return improvable(
				v,
				desc,
				msg("rule_server_present_risk"),
				msg("rule_server_present_rec"),
				0.7,
			);
		},
	},
	{
		name: "X-Powered-By",
		category: "informational",
		weight: 4,
		evaluate: (v) => {
			const desc = msg("rule_xpb_desc");
			if (!v) return ok(null, desc, msg("rule_keep_hidden"));
			return insecure(v, desc, msg("rule_xpb_risk"), msg("rule_xpb_rec"));
		},
	},
];

export function buildFindings(
	headers: Record<string, string>,
): HeaderFinding[] {
	const lower: Record<string, string> = {};
	for (const [k, v] of Object.entries(headers)) lower[k.toLowerCase()] = v;
	return RULES.map((r) => {
		const val = lower[r.name.toLowerCase()] ?? null;
		const ev = r.evaluate(val);
		return { name: r.name, category: r.category, weight: r.weight, ...ev };
	});
}

export const _statusOrder: HeaderStatus[] = [
	"insecure",
	"missing",
	"improvable",
	"secure",
];
