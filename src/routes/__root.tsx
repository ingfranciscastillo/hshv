import { IconContext, type IconProps } from "@phosphor-icons/react";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	type ErrorComponentProps,
	HeadContent,
	Link,
	Outlet,
	Scripts,
	useRouter,
} from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import appCss from "../styles.css?url";

// Phosphor Light everywhere; icons inherit color and are sized via className.
const ICONS: IconProps = { weight: "light", color: "currentColor" };

interface MyRouterContext {
	queryClient: QueryClient;
}

function NotFoundComponent() {
	return (
		<div className="flex min-h-[100dvh] items-center px-4 sm:px-8">
			<div className="mx-auto w-full max-w-5xl">
				<div className="border-t border-rule pt-6 font-mono text-xs text-muted-foreground">
					Error 404
				</div>
				<h1 className="mt-6 text-5xl leading-[1.05] sm:text-7xl">
					Esta página <em>no existe.</em>
				</h1>
				<p className="mt-5 max-w-[48ch] text-muted-foreground">
					La dirección que buscas se movió o nunca estuvo aquí.
				</p>
				<Link
					to="/"
					className="mt-8 inline-flex h-11 items-center bg-foreground px-6 text-sm font-medium text-background transition-transform active:scale-[0.98]"
				>
					Volver al inicio
				</Link>
			</div>
		</div>
	);
}

function ErrorComponent({ reset }: ErrorComponentProps) {
	// Error logged server-side only
	const router = useRouter();

	return (
		<div className="flex min-h-[100dvh] items-center px-4 sm:px-8">
			<div className="mx-auto w-full max-w-5xl">
				<div className="border-t border-rule pt-6 font-mono text-xs text-muted-foreground">
					Error
				</div>
				<h1 className="mt-6 text-4xl leading-[1.1] sm:text-6xl">
					La página no <em>cargó.</em>
				</h1>
				<p className="mt-5 max-w-[48ch] text-muted-foreground">
					Algo falló de nuestro lado. Intenta de nuevo o vuelve al inicio.
				</p>
				<div className="mt-8 flex flex-wrap gap-3">
					<button
						type="button"
						onClick={() => {
							router.invalidate();
							reset();
						}}
						className="inline-flex h-11 cursor-pointer items-center bg-foreground px-6 text-sm font-medium text-background transition-transform active:scale-[0.98]"
					>
						Reintentar
					</button>
					<a
						href="/"
						className="inline-flex h-11 items-center border border-input px-6 text-sm font-medium transition-colors hover:bg-accent"
					>
						Volver al inicio
					</a>
				</div>
			</div>
		</div>
	);
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: SITE.name },
			{ name: "description", content: SITE.description },
			{ name: "author", content: SITE.author },
			{ property: "og:site_name", content: "HSHV" },
			{ property: "og:locale", content: "es_ES" },
			{ property: "og:type", content: "website" },
			{ property: "og:image", content: SITE.image },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:alt", content: SITE.imageAlt },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:image", content: SITE.image },
			{ name: "twitter:image:alt", content: SITE.imageAlt },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/favicon.ico", sizes: "48x48" },
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
			{ rel: "manifest", href: "/manifest.json" },
			{ rel: "dns-prefetch", href: "https://api.firecrawl.dev" },
		],
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<head>
				<HeadContent />
				{/* Rendered here: route meta is deduped by name, which would drop one. */}
				<meta
					name="theme-color"
					media="(prefers-color-scheme: light)"
					content="#f6f7f9"
				/>
				<meta
					name="theme-color"
					media="(prefers-color-scheme: dark)"
					content="#101216"
				/>
			</head>
			<body>
				<div className="app-backdrop" aria-hidden="true" />

				<div style={{ position: "relative", zIndex: 1 }}>
					<IconContext.Provider value={ICONS}>{children}</IconContext.Provider>
				</div>
				<Scripts />
			</body>
		</html>
	);
}

function RootComponent() {
	const { queryClient } = Route.useRouteContext();

	return (
		<QueryClientProvider client={queryClient}>
			<Outlet />
		</QueryClientProvider>
	);
}
