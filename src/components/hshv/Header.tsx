import { Link } from "@tanstack/react-router";
import { History, ShieldCheck } from "lucide-react";

export function AppHeader() {
	return (
		<header className="border-b border-border bg-card/40 backdrop-blur sticky top-0 z-10">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
				<Link to="/" className="flex items-center gap-2 font-bold">
					<ShieldCheck className="size-5 text-primary" />
					<span style={{ fontFamily: "Space Grotesk, sans-serif" }}>HSHV</span>
					<span className="text-xs text-muted-foreground font-normal hidden sm:inline">
						/ HTTP Security Headers Validator
					</span>
				</Link>
				<nav className="flex items-center gap-1 text-sm">
					<Link
						to="/"
						className="px-3 py-1.5 rounded-md hover:bg-secondary [&.active]:text-primary"
						activeOptions={{ exact: true }}
					>
						Analizar
					</Link>
					<Link
						to="/history"
						className="px-3 py-1.5 rounded-md hover:bg-secondary [&.active]:text-primary flex items-center gap-1"
					>
						<History className="size-4" /> Historial
					</Link>
				</nav>
			</div>
		</header>
	);
}
