import { CircleNotchIcon } from "@phosphor-icons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "#/lib/auth-client";
import { AppHeader } from "@/components/hshv/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { canonical } from "@/lib/site";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/auth")({
	validateSearch: z.object({
		redirect: z.string().optional(),
	}),
	head: () => ({
		meta: [
			{ title: m.meta_auth_title() },
			{ name: "description", content: m.meta_auth_description() },
			{ name: "robots", content: "noindex, follow" },
		],
		links: [{ rel: "canonical", href: canonical("/auth") }],
	}),
	component: AuthPage,
});

const credsSchema = () =>
	z.object({
		email: z.email(m.auth_err_email()).trim().max(255),
		password: z.string().min(8, m.auth_err_password()).max(72),
	});

function AuthPage() {
	const [tab, setTab] = useState<"login" | "signup">("login");
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const { redirect } = Route.useSearch();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const parsed = credsSchema().safeParse({ email, password });
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setLoading(true);
		try {
			if (tab === "login") {
				const res = await authClient.signIn.email({
					email: parsed.data.email,
					password: parsed.data.password,
				});

				if (res.error) {
					toast.error(res.error.message || m.auth_err_credentials());
					return;
				}

				toast.success(m.auth_signed_in());
				navigate({ to: redirect || "/history" });
			} else {
				const res = await authClient.signUp.email({
					email: parsed.data.email,
					password: parsed.data.password,
					name: parsed.data.email.split("@")[0],
				});

				if (res.error) {
					toast.error(res.error.message || m.auth_err_signup());
					return;
				}

				toast.success("Cuenta creada. Revisa tu correo para confirmar.");
				setTab("login");
				setPassword("");
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : m.auth_err_generic();
			toast.error(
				msg.includes("Invalid login") ? m.auth_err_credentials() : msg,
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-[100dvh] flex-col">
			<AppHeader />
			<Toaster position="top-right" richColors />
			<main className="mx-auto grid w-full max-w-6xl flex-1 content-start gap-14 px-4 pt-14 pb-24 sm:px-8 sm:pt-20 lg:grid-cols-12 lg:gap-12">
				<div className="reveal lg:col-span-5">
					<h1 className="pb-1 text-5xl leading-[1.08] sm:text-6xl">
						{tab === "login" ? (
							<>
								{m.auth_login_before()}
								<em>{m.auth_login_emphasis()}</em>
							</>
						) : (
							<>
								{m.auth_signup_before()}
								<em>{m.auth_signup_emphasis()}</em>
							</>
						)}
					</h1>
					<p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-muted-foreground">
						{m.auth_subtitle()}
					</p>
				</div>

				<div
					className="reveal lg:col-span-6 lg:col-start-7"
					style={{ "--i": 1 } as React.CSSProperties}
				>
					<Tabs
						value={tab}
						onValueChange={(v) => setTab(v as "login" | "signup")}
					>
						<TabsList
							variant="line"
							className="mb-8 h-auto w-full justify-start gap-6 border-b border-rule p-0"
						>
							<TabsTrigger
								value="login"
								className="flex-none px-0 pb-3 text-[15px] font-normal"
							>
								{m.auth_tab_login()}
							</TabsTrigger>
							<TabsTrigger
								value="signup"
								className="flex-none px-0 pb-3 text-[15px] font-normal"
							>
								{m.auth_tab_signup()}
							</TabsTrigger>
						</TabsList>

						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label
									htmlFor="email"
									className="font-mono text-xs font-normal text-muted-foreground"
								>
									{m.auth_email()}
								</Label>
								<Input
									id="email"
									type="email"
									autoComplete="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="tu@dominio.com"
									className="h-12 bg-card px-4 text-[15px] shadow-none dark:bg-card"
								/>
							</div>
							<div className="space-y-2">
								<Label
									htmlFor="password"
									className="font-mono text-xs font-normal text-muted-foreground"
								>
									{m.auth_password()}
								</Label>
								<Input
									id="password"
									type="password"
									autoComplete={
										tab === "login" ? "current-password" : "new-password"
									}
									required
									minLength={8}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									aria-describedby="password-help"
									className="h-12 bg-card px-4 text-[15px] shadow-none dark:bg-card"
								/>
								<p id="password-help" className="text-xs text-muted-foreground">
									{m.auth_password_help()}
								</p>
							</div>
							<button
								type="submit"
								disabled={loading}
								className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-foreground text-[15px] font-medium text-background transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
							>
								{loading && (
									<CircleNotchIcon
										className="size-4 animate-spin"
										aria-hidden="true"
									/>
								)}
								{tab === "login"
									? m.auth_submit_login()
									: m.auth_submit_signup()}
							</button>
						</form>

						<TabsContent value="login" />
						<TabsContent value="signup" />
					</Tabs>
				</div>
			</main>
		</div>
	);
}
