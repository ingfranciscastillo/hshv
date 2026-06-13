import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	ClientOnly,
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
	useRouter,
} from "@tanstack/react-router";
import { lazy } from "react";
import appCss from "../styles.css?url";

const FaultyTerminalClient = lazy(() =>
	import("@/components/FaultyTerminalClient").then((m) => ({
		default: m.default,
	})),
);

interface MyRouterContext {
	queryClient: QueryClient;
}

function NotFoundComponent() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="max-w-md text-center">
				<h1 className="text-7xl font-bold text-foreground">404</h1>
				<h2 className="mt-4 text-xl font-semibold text-foreground">
					Page not found
				</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<div className="mt-6">
					<Link
						to="/"
						className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Go home
					</Link>
				</div>
			</div>
		</div>
	);
}

function ErrorComponent({
	error: _error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	// Error logged server-side only
	const router = useRouter();

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="max-w-md text-center">
				<h1 className="text-xl font-semibold tracking-tight text-foreground">
					This page didn't load
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Something went wrong on our end. You can try refreshing or head back
					home.
				</p>
				<div className="mt-6 flex flex-wrap justify-center gap-2">
					<button
						type="button"
						onClick={() => {
							router.invalidate();
							reset();
						}}
						className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Try again
					</button>
					<a
						href="/"
						className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
					>
						Go home
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
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap",
			},
			{ rel: "canonical", href: "https://hshv.vercel.app/" },
		],
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es" className="dark">
			<head>
				<HeadContent />
			</head>
			<body>
				<div
					style={{
						position: "fixed",
						inset: 0,
						zIndex: 0,
						background: "#1a1f2e",
					}}
				>
					<ClientOnly fallback={null}>
						<FaultyTerminalClient
							scale={1.5}
							gridMul={[2, 1]}
							digitSize={1.2}
							timeScale={0.5}
							scanlineIntensity={0.5}
							glitchAmount={1}
							flickerAmount={1}
							noiseAmp={1}
							curvature={0.1}
							tint="#1a1f2e"
							mouseReact
							mouseStrength={0.5}
							pageLoadAnimation
							brightness={0.6}
						/>
					</ClientOnly>
				</div>

				<div style={{ position: "relative", zIndex: 1 }}>{children}</div>
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
