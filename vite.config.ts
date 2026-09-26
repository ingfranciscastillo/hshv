import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		paraglideVitePlugin({
			project: "./project.inlang",
			outdir: "./src/paraglide",
			emitTsDeclarations: true,
			// The URL decides the locale: Spanish at the root, English under /en.
			strategy: ["url", "cookie", "preferredLanguage", "baseLocale"],
			urlPatterns: [
				// API routes are not localized.
				{
					pattern: "/api/:path(.*)?",
					localized: [
						["es", "/api/:path(.*)?"],
						["en", "/api/:path(.*)?"],
					],
				},
				{
					pattern: "/:path(.*)?",
					localized: [
						["en", "/en/:path(.*)?"],
						["es", "/:path(.*)?"],
					],
				},
			],
		}),
		devtools(),
		nitro(),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
