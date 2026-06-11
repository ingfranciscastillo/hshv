import type { AnalysisReport } from "./types";

const KEY = "hshv:history";
const MAX = 50;

export function loadHistory(): AnalysisReport[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? (JSON.parse(raw) as AnalysisReport[]) : [];
	} catch {
		return [];
	}
}

export function saveToHistory(report: AnalysisReport) {
	if (typeof window === "undefined") return;
	const cur = loadHistory();
	const next = [report, ...cur].slice(0, MAX);
	localStorage.setItem(KEY, JSON.stringify(next));
	window.dispatchEvent(new Event("hshv:history-updated"));
}

export function clearHistory() {
	if (typeof window === "undefined") return;
	localStorage.removeItem(KEY);
	window.dispatchEvent(new Event("hshv:history-updated"));
}
