import { m } from "@/paraglide/messages.js";
import {
	baseLocale,
	getLocale,
	locales,
	localizeHref,
} from "@/paraglide/runtime.js";

// Site-wide metadata shared by route heads.
export const SITE = {
	url: "https://hshv.vercel.app",
	name: "HSHV · HTTP Security Headers Validator",
	author: "Francis Miguel Castillo Cruz",
} as const;

const OG_LOCALE = { es: "es_ES", en: "en_US" } as const;

/** Absolute URL of `path` in the current (or given) locale. */
export const canonical = (path: string, locale = getLocale()) =>
	`${SITE.url}${localizeHref(path, { locale })}`;

/** hreflang alternates for every locale plus x-default. */
export const alternates = (path: string) => [
	...locales.map((locale) => ({
		rel: "alternate",
		hrefLang: locale,
		href: canonical(path, locale),
	})),
	{
		rel: "alternate",
		hrefLang: "x-default",
		href: canonical(path, baseLocale),
	},
];

export const ogImage = () =>
	`${SITE.url}/${getLocale() === "en" ? "og-image-en.png" : "og-image.png"}`;

/** Locale-dependent meta shared by every page. */
export const localeMeta = () => {
	const locale = getLocale();
	return [
		{ name: "description", content: m.meta_site_description() },
		{ property: "og:locale", content: OG_LOCALE[locale] },
		...locales
			.filter((l) => l !== locale)
			.map((l) => ({ property: "og:locale:alternate", content: OG_LOCALE[l] })),
		{ property: "og:image", content: ogImage() },
		{ property: "og:image:alt", content: m.meta_image_alt() },
		{ name: "twitter:image", content: ogImage() },
		{ name: "twitter:image:alt", content: m.meta_image_alt() },
	];
};
