import { Link } from "@tanstack/react-router";
import { History, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { authClient } from "#/lib/auth-client";

export function AppHeader() {
	const { data: session, isPending } = authClient.useSession();

	const handleSignOut = async () => {
		void (await authClient.signOut());
	};

	return (
		<header className="sticky backdrop-blur-xs border-b border-border top-0 z-10">
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
					{session?.user ? (
						<>
							<span className="hidden md:inline text-xs text-muted-foreground ml-2 font-mono truncate max-w-[160px]">
								{session.user.email}
							</span>
							<button
								type="button"
								onClick={handleSignOut}
								className="px-3 py-1.5 rounded-md hover:bg-secondary flex items-center gap-1 cursor-pointer"
							>
								<LogOut className="size-4" /> Salir
							</button>
						</>
					) : !isPending ? (
						<Link
							to="/auth"
							className="px-3 py-1.5 rounded-md hover:bg-secondary [&.active]:text-primary flex items-center gap-1"
						>
							<LogIn className="size-4" /> Acceder
						</Link>
					) : null}
				</nav>
			</div>
		</header>
	);
}
