// Site-wide metadata shared by route heads.
export const SITE = {
	url: "https://hshv.vercel.app",
	name: "HSHV · HTTP Security Headers Validator",
	author: "Francis Miguel Castillo Cruz",
	description:
		"Analiza los headers HTTP de cualquier sitio, obtén una puntuación de seguridad de 0 a 100 y recomendaciones listas para copiar.",
	image: "https://hshv.vercel.app/og-image.png",
	imageAlt: "HSHV: audita los headers HTTP de cualquier sitio.",
} as const;

export const canonical = (path: string) => `${SITE.url}${path}`;
