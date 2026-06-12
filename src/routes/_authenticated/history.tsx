import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { DashboardCards } from "@/components/hshv/DashboardCards";
import { AppHeader } from "@/components/hshv/Header";
import { HistoryTable } from "@/components/hshv/HistoryTable";
import { clearHistory, loadHistory } from "@/lib/headers/storage";
import type { AnalysisReport } from "@/lib/headers/types";

export const Route = createFileRoute("/_authenticated/history")({
	head: () => ({
		meta: [
			{ title: "Historial — HTTP Security Headers Validator" },
			{
				name: "description",
				content:
					"Dashboard de análisis previos y métricas locales de seguridad de headers HTTP.",
			},
			{ property: "og:title", content: "Historial de análisis" },
			{
				property: "og:description",
				content: "Métricas y registros de tus análisis de headers HTTP.",
			},
		],
	}),
	component: HistoryPage,
});

function HistoryPage() {
	const [items, setItems] = useState<AnalysisReport[]>([]);

	const syncHistory = useCallback(() => {
		setItems(loadHistory());
	}, []);

	useEffect(() => {
		syncHistory();
		window.addEventListener("hshv:history-updated", syncHistory);
		window.addEventListener("storage", syncHistory);
		return () => {
			window.removeEventListener("hshv:history-updated", syncHistory);
			window.removeEventListener("storage", syncHistory);
		};
	}, [syncHistory]);

	return (
		<div className="min-h-screen">
			<AppHeader />
			<main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
				<div>
					<h1
						className="text-2xl sm:text-3xl font-bold"
						style={{ fontFamily: "Space Grotesk, sans-serif" }}
					>
						Historial & Dashboard
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Datos guardados localmente en este navegador.
					</p>
				</div>
				<DashboardCards items={items} />
				<HistoryTable
					items={items}
					onClear={() => {
						clearHistory();
					}}
				/>
			</main>
		</div>
	);
}
