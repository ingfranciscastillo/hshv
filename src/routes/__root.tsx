import { TanStackDevtools } from "@tanstack/react-devtools";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
	useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import FaultyTerminalClient from "@/components/FaultyTerminalClient";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

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

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
	console.error(error);
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
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:site", content: "@Lovable" },
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
		],
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<script suppressHydrationWarning>
					{`document.documentElement.classList.add('dark')`}
				</script>
				<HeadContent />
			</head>
			<body>
				<div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
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
				</div>

				<div style={{ position: "relative", zIndex: 1 }}>{children}</div>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

function RootComponent() {
	const { queryClient } = Route.useRouteContext();

	return (
		<QueryClientProvider client={queryClient}>
			{/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
			<Outlet />
		</QueryClientProvider>
	);
}
