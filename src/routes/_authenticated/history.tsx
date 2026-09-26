import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { DashboardCards } from "@/components/hshv/DashboardCards";
import { AppFooter } from "@/components/hshv/Footer";
import { AppHeader } from "@/components/hshv/Header";
import { HistoryTable } from "@/components/hshv/HistoryTable";
import { clearHistory, loadHistory } from "@/lib/headers/storage";
import type { AnalysisReport } from "@/lib/headers/types";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authenticated/history")({
	head: () => ({
		meta: [
			{ title: m.meta_history_title() },
			{ name: "description", content: m.meta_history_description() },
			{ name: "robots", content: "noindex, nofollow" },
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
		<div className="flex min-h-[100dvh] flex-col">
			<AppHeader />
			<main className="mx-auto w-full max-w-6xl flex-1 space-y-16 px-4 pt-14 pb-24 sm:px-8 sm:pt-20">
				<div className="reveal">
					<h1 className="text-5xl leading-[1.05] sm:text-6xl">
						{m.history_title()}
					</h1>
					<p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-muted-foreground">
						{m.history_subtitle()}
					</p>
				</div>
				<div className="reveal" style={{ "--i": 1 } as React.CSSProperties}>
					<DashboardCards items={items} />
				</div>
				<div className="reveal" style={{ "--i": 2 } as React.CSSProperties}>
					<HistoryTable
						items={items}
						onClear={() => {
							clearHistory();
						}}
					/>
				</div>
			</main>
			<AppFooter />
		</div>
	);
}
