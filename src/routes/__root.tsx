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
			{ title: "HTTP Security Headers Validator" },
			{
				name: "description",
				content:
					"Analiza los headers HTTP de cualquier sitio, detecta riesgos y obtén recomendaciones accionables.",
			},
			{ name: "author", content: "Lovable" },
			{ property: "og:title", content: "HTTP Security Headers Validator" },
			{
				property: "og:description",
				content:
					"Analiza los headers HTTP de cualquier sitio y obtén un reporte de seguridad.",
			},
			{ property: "og:type", content: "website" },
			{
				name: "theme-color",
				media: "(prefers-color-scheme: light)",
				content: "#f6f7f9",
			},
			{
				name: "theme-color",
				media: "(prefers-color-scheme: dark)",
				content: "#101216",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{ rel: "canonical", href: "https://hshv.vercel.app/" },
			{ rel: "dns-prefetch", href: "https://api.firecrawl.dev" },
		],
		script: [
			{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "WebApplication",
					name: "HTTP Security Headers Validator",
					description:
						"Analiza los headers HTTP de cualquier sitio, detecta riesgos y obtén recomendaciones accionables.",
					url: "https://hshv.vercel.app/",
					applicationCategory: "SecurityApplication",
					operatingSystem: "Any",
					offers: {
						"@type": "Offer",
						price: "0",
						priceCurrency: "USD",
					},
				}),
			},
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
