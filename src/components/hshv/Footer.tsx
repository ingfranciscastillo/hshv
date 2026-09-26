import { SiBuymeacoffee, SiGithub } from "@icons-pack/react-simple-icons";
import { LogoMark } from "./LogoMark";

export function AppFooter() {
	return (
		<footer className="mx-auto w-full max-w-6xl px-4 sm:px-8">
			<div className="flex flex-col gap-4 border-t border-rule py-8 sm:flex-row sm:items-center sm:justify-between">
				<span className="flex items-center gap-2.5">
					<LogoMark className="h-[18px] w-auto" />
					<span className="font-serif text-xl leading-none">HSHV</span>
				</span>
				<div className="flex items-center gap-6 text-sm text-muted-foreground">
					<a
						href="https://github.com/ingfranciscastillo"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 transition-colors hover:text-foreground"
					>
						<SiGithub className="size-3.5" aria-hidden="true" />
						GitHub
					</a>
					<a
						href="https://buymeacoffee.com/ingfranciscastillo"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 transition-colors hover:text-foreground"
					>
						<SiBuymeacoffee className="size-3.5" aria-hidden="true" />
						Buy me a coffee
					</a>
				</div>
			</div>
		</footer>
	);
}
