import { Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
		<form onSubmit={handle} className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row">
				<div className="relative flex-1">
					<Shield
						className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary"
						aria-hidden="true"
					/>
					<Input
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://example.com"
						className="pl-10 h-12 text-base bg-card border-border"
						disabled={loading}
						required
						maxLength={2048}
					/>
				</div>
				<Button
					type="submit"
					disabled={loading}
					size="lg"
					className="h-12 px-8 font-semibold"
				>
					{loading ? (
						<Loader2 className="size-4 animate-spin" aria-hidden="true" />
					) : (
						"Analizar"
					)}
				</Button>
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
					className="text-sm text-muted-foreground cursor-pointer"
				>
					Reintentar con Firecrawl si el fetch directo falla
				</Label>
			</div>
		</form>
	);
}
