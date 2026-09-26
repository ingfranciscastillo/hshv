import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppFooter } from "@/components/hshv/Footer";
import { AppHeader } from "@/components/hshv/Header";
import { ReportView } from "@/components/hshv/ReportView";
import { ScoreCard } from "@/components/hshv/ScoreCard";
import { CATEGORIES, CATEGORY_TITLES } from "@/components/hshv/status";
import { UrlForm } from "@/components/hshv/UrlForm";
import { Toaster } from "@/components/ui/sonner";
import { analyzeUrl } from "@/lib/headers/analyze.functions";
import { RULES } from "@/lib/headers/rules";
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

const CHECKED = CATEGORIES.map((c) => ({
	category: c,
	names: RULES.filter((r) => r.category === c).map((r) => r.name),
}));

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
	const reportRef = useRef<HTMLDivElement>(null);
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

	// Bring the new report into view once it renders.
	useEffect(() => {
		if (!report || !reportRef.current) return;
		const reduce = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		reportRef.current.scrollIntoView({
			behavior: reduce ? "auto" : "smooth",
			block: "start",
		});
	}, [report]);

	return (
		<div className="flex min-h-[100dvh] flex-col">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
			>
				Saltar al contenido
			</a>
			<AppHeader />
			<Toaster position="top-right" richColors />
			<main
				id="main-content"
				className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-8"
			>
				<section className="grid gap-14 pt-14 pb-20 sm:pt-20 lg:grid-cols-12 lg:gap-12 lg:pb-24">
					<div className="reveal lg:col-span-8">
						<div className="font-mono text-xs text-muted-foreground">
							Informe de seguridad HTTP
						</div>
						<h1 className="mt-5 pb-1 text-5xl leading-[1.08] sm:text-6xl lg:text-[3.6rem] xl:text-[4rem]">
							Audita los headers HTTP de <em>cualquier</em> sitio.
						</h1>
						<p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
							Inspeccionamos la respuesta del servidor, puntuamos sus políticas
							de seguridad y te damos la configuración lista para copiar.
						</p>
						<div className="mt-10 max-w-xl">
							<UrlForm
								onSubmit={(url, fc) =>
									mutation.mutate({ url, useFirecrawl: fc })
								}
								loading={mutation.isPending}
							/>
						</div>
					</div>

					<aside
						aria-labelledby="checked-title"
						className="reveal lg:col-span-3 lg:col-start-10 lg:pt-10"
						style={{ "--i": 2 } as React.CSSProperties}
					>
						<h2
							id="checked-title"
							className="border-t border-rule pt-4 text-2xl leading-tight"
						>
							Lo que revisamos
						</h2>
						<div className="mt-6 space-y-6">
							{CHECKED.map((g) => (
								<div key={g.category}>
									<div className="text-sm text-muted-foreground italic font-serif">
										{CATEGORY_TITLES[g.category]}
									</div>
									<ul className="mt-2 space-y-1.5 font-mono text-[13px]">
										{g.names.map((n) => (
											<li key={n} className="break-words">
												{n}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</aside>
				</section>

				<div ref={reportRef} className="scroll-mt-24">
					{mutation.isPending && !report && <ReportSkeleton />}
					{report && (
						<div className="space-y-20 pb-24">
							<ScoreCard report={report} />
							<ReportView report={report} />
						</div>
					)}
				</div>

				{!report && !mutation.isPending && (
					<section
						aria-labelledby="features-title"
						className="grid gap-10 border-t border-rule pt-8 pb-24 lg:grid-cols-12 lg:gap-12"
					>
						<h2
							id="features-title"
							className="text-4xl leading-[1.05] lg:col-span-4"
						>
							Qué obtienes
						</h2>
						<dl className="space-y-10 lg:col-span-8">
							{FEATURES.map((f) => (
								<div
									key={f.title}
									className="grid gap-2 sm:grid-cols-[14rem_1fr] sm:gap-8"
								>
									<dt className="font-serif text-xl leading-snug">{f.title}</dt>
									<dd className="max-w-[52ch] leading-relaxed text-muted-foreground">
										{f.desc}
									</dd>
								</div>
							))}
						</dl>
					</section>
				)}
			</main>
			<AppFooter />
		</div>
	);
}

function ReportSkeleton() {
	return (
		<>
			<output className="sr-only">Analizando el sitio</output>
			<div
				aria-hidden="true"
				className="grid animate-pulse gap-10 border-t border-rule pt-8 pb-24 motion-reduce:animate-none lg:grid-cols-12 lg:gap-12"
			>
				<div className="space-y-5 lg:col-span-5">
					<div className="h-3 w-40 bg-muted" />
					<div className="h-32 w-56 bg-muted" />
					<div className="h-7 w-32 bg-muted" />
				</div>
				<div className="space-y-4 lg:col-span-7">
					<div className="h-9 w-2/3 bg-muted" />
					<div className="h-4 w-full bg-muted" />
					<div className="h-4 w-5/6 bg-muted" />
					<div className="grid grid-cols-4 gap-6 pt-4">
						{[0, 1, 2, 3].map((i) => (
							<div key={i} className="h-12 bg-muted" />
						))}
					</div>
				</div>
			</div>
		</>
	);
}
