import { ArrowRightIcon, CircleNotchIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Props {
	onSubmit: (url: string, useFirecrawl: boolean) => void;
	loading: boolean;
}

export function UrlForm({ onSubmit, loading }: Props) {
	const [url, setUrl] = useState("");
	const [fc, setFc] = useState(false);

	const handle = (e: React.FormEvent) => {
		e.preventDefault();
		let value = url.trim();
		if (!value) return;
		if (!/^https?:\/\//i.test(value)) value = `https://${value}`;
		onSubmit(value, fc);
	};

	return (
		<form onSubmit={handle} className="space-y-5">
			<div className="space-y-2">
				<Label
					htmlFor="target-url"
					className="font-mono text-xs font-normal text-muted-foreground"
				>
					URL del sitio
				</Label>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Input
						id="target-url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://example.com"
						className="h-14 flex-1 border-input bg-card px-4 font-mono text-base shadow-none md:text-[15px] dark:bg-card"
						disabled={loading}
						required
						maxLength={2048}
						autoComplete="url"
						spellCheck={false}
					/>
					<button
						type="submit"
						disabled={loading}
						className="group inline-flex h-14 shrink-0 cursor-pointer items-center justify-center gap-3 bg-foreground px-7 text-[15px] font-medium text-background transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
					>
						{loading ? (
							<>
								<CircleNotchIcon
									className="size-4 animate-spin"
									aria-hidden="true"
								/>
								Analizando
							</>
						) : (
							<>
								Analizar
								<ArrowRightIcon
									className="size-[18px] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
									aria-hidden="true"
								/>
							</>
						)}
					</button>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<Switch
					id="fc"
					checked={fc}
					onCheckedChange={setFc}
					disabled={loading}
				/>
				<Label
					htmlFor="fc"
					className="cursor-pointer text-sm font-normal text-muted-foreground"
				>
					Reintentar con Firecrawl si el fetch directo falla
				</Label>
			</div>
		</form>
	);
}
