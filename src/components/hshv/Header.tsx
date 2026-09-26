import { Link } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client";

const NAV_LINK =
	"relative py-1 text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground [&.active]:after:absolute [&.active]:after:inset-x-0 [&.active]:after:-bottom-[18px] [&.active]:after:h-[2px] [&.active]:after:bg-primary";

export function AppHeader() {
	const { data: session, isPending } = authClient.useSession();

	const handleSignOut = async () => {
		void (await authClient.signOut());
	};

	return (
		<header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md">
			<div className="mx-auto max-w-6xl px-4 sm:px-8">
				<div className="flex h-16 items-center justify-between gap-6 border-b border-rule">
					<Link to="/" className="flex items-baseline gap-3">
						<span className="font-serif text-[26px] leading-none tracking-tight">
							HSHV
						</span>
						<span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
							Security Headers Validator
						</span>
					</Link>
					<nav className="flex items-center gap-5 text-sm sm:gap-7">
						<Link to="/" className={NAV_LINK} activeOptions={{ exact: true }}>
							Analizar
						</Link>
						<Link to="/history" className={NAV_LINK}>
							Historial
						</Link>
						{session?.user ? (
							<>
								<span className="hidden max-w-[180px] truncate font-mono text-xs text-muted-foreground md:inline">
									{session.user.email}
								</span>
								<button
									type="button"
									onClick={handleSignOut}
									className="cursor-pointer py-1 text-muted-foreground transition-colors hover:text-foreground"
								>
									Salir
								</button>
							</>
						) : !isPending ? (
							<Link to="/auth" className={NAV_LINK}>
								Acceder
							</Link>
						) : null}
					</nav>
				</div>
			</div>
		</header>
	);
}
