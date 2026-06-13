import { SiBuymeacoffee, SiGithub } from "@icons-pack/react-simple-icons";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { ExportButtons } from "@/components/hshv/ExportButtons";
import { AppHeader } from "@/components/hshv/Header";
import { ReportView } from "@/components/hshv/ReportView";
import { ScoreCard } from "@/components/hshv/ScoreCard";
import { UrlForm } from "@/components/hshv/UrlForm";
import { Toaster } from "@/components/ui/sonner";
import { analyzeUrl } from "@/lib/headers/analyze.functions";
import { saveToHistory } from "@/lib/headers/storage";
import type { AnalysisReport } from "@/lib/headers/types";

const FEATURES = [
	{
		title: "Detección automática",
		desc: "Analiza CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy y Permissions-Policy en segundos.",
	},
	{
		title: "Reporte accionable",
		desc: "Identifica configuraciones faltantes o débiles y muestra exactamente qué debes corregir.",
	},
	{
		title: "Score de seguridad",
		desc: "Obtén una puntuación de 0 a 100 basada en buenas prácticas modernas y riesgos detectados.",
	},
] as const;

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{
				title: "HTTP Security Headers Validator — Analiza headers de seguridad",
			},
			{
				name: "description",
				content:
					"Analiza los headers HTTP de cualquier sitio, evalúa riesgos y obtén recomendaciones accionables.",
			},
			{ property: "og:title", content: "HTTP Security Headers Validator" },
			{
				property: "og:description",
				content:
					"Reporte de seguridad accionable a partir de los headers HTTP de cualquier URL.",
			},
		],
	}),
	component: IndexPage,
});

function IndexPage() {
	const [report, setReport] = useState<AnalysisReport | null>(null);
	const fn = useServerFn(analyzeUrl);
	const mutation = useMutation({
		mutationFn: (vars: { url: string; useFirecrawl: boolean }) =>
			fn({ data: vars }),
		onSuccess: (r) => {
			setReport(r);
			saveToHistory(r);
		},
		onError: (e: unknown) => {
			const msg = e instanceof Error ? e.message : "Error desconocido";
			toast.error(msg);
		},
	});

	return (
		<div className="min-h-screen flex flex-col">
			<AppHeader />
			<Toaster theme="dark" position="top-right" richColors />
			<main
				id="main-content"
				className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8"
			>
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded"
				>
					Saltar al contenido
				</a>
				<section className="text-center max-w-2xl mx-auto space-y-3">
					<div className="inline-block text-xs uppercase tracking-widest text-primary border border-primary/30 rounded-full px-3 py-1">
						HEADERS · SCORING · EXPORT
					</div>
					<h1
						className="text-3xl sm:text-5xl font-bold"
						style={{ fontFamily: "Space Grotesk, sans-serif" }}
					>
						Audita los headers HTTP de cualquier sitio
					</h1>
					<p className="text-muted-foreground">
						Inspeccionamos la respuesta del servidor, evaluamos las políticas de
						seguridad y te damos recomendaciones listas para copiar.
					</p>
				</section>

				<section className="max-w-3xl mx-auto">
					<UrlForm
						onSubmit={(url, fc) => mutation.mutate({ url, useFirecrawl: fc })}
						loading={mutation.isPending}
					/>
				</section>

				{report && (
					<>
						<ScoreCard report={report} />
						<div className="flex justify-end">
							<ExportButtons report={report} />
						</div>
						<ReportView report={report} />
					</>
				)}

				{!report && (
					<section className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4">
						{FEATURES.map((f) => (
							<div
								key={f.title}
								className="p-5 rounded-lg border border-border backdrop-blur-xs"
							>
								<div className="text-sm font-bold text-primary">{f.title}</div>
								<div className="text-sm text-muted-foreground mt-1">
									{f.desc}
								</div>
							</div>
						))}
					</section>
				)}
			</main>
			<footer className="text-center text-xs text-muted-foreground py-8 flex flex-col items-center gap-3">
				<div className="flex items-center gap-4">
					<a
						href="https://github.com/ingfranciscastillo"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 hover:text-primary transition-colors"
					>
						<SiGithub className="size-3.5" />
						GitHub
					</a>
					<span className="opacity-30">·</span>
					<a
						href="https://buymeacoffee.com/ingfranciscastillo"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 hover:text-primary transition-colors"
					>
						<SiBuymeacoffee className="size-3.5" />
						Buy me a coffee
					</a>
				</div>
			</footer>
		</div>
	);
}
