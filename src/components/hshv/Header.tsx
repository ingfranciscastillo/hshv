import { Link, useLocation } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client";
import { m } from "@/paraglide/messages.js";
import { getLocale, locales, localizeHref } from "@/paraglide/runtime.js";
import { LogoMark } from "./LogoMark";

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
					<Link to="/" className="flex items-center gap-3">
						<LogoMark className="h-[22px] w-auto" />
						<span className="font-serif text-[26px] leading-none tracking-tight">
							HSHV
						</span>
						<span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">
							Security Headers Validator
						</span>
					</Link>
					<nav className="flex items-center gap-5 text-sm sm:gap-7">
						<Link to="/" className={NAV_LINK} activeOptions={{ exact: true }}>
							{m.nav_analyze()}
						</Link>
						<Link to="/history" className={NAV_LINK}>
							{m.nav_history()}
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
									{m.nav_sign_out()}
								</button>
							</>
						) : !isPending ? (
							<Link to="/auth" className={NAV_LINK}>
								{m.nav_sign_in()}
							</Link>
						) : null}
						<LanguageSwitcher />
					</nav>
				</div>
			</div>
		</header>
	);
}

function LanguageSwitcher() {
	// The router location is already de-localized (see the rewrite in router.tsx).
	const href = useLocation({ select: (l) => l.pathname + l.searchStr });
	const current = getLocale();

	return (
		<ul
			aria-label={m.language_label()}
			className="flex items-center gap-1.5 border-l border-border pl-5 font-mono text-xs sm:pl-7"
		>
			{locales.map((locale, i) => (
				<li key={locale} className="flex items-center gap-1.5">
					{i > 0 && (
						<span aria-hidden="true" className="text-muted-foreground/50">
							/
						</span>
					)}
					<a
						href={localizeHref(href, { locale })}
						hrefLang={locale}
						lang={locale}
						aria-current={locale === current ? "true" : undefined}
						className={
							locale === current
								? "text-foreground"
								: "text-muted-foreground transition-colors hover:text-foreground"
						}
					>
						{locale.toUpperCase()}
					</a>
				</li>
			))}
		</ul>
	);
}
