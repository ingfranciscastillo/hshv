import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "#/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
	validateSearch: z.object({
		redirect: z.string().optional(),
	}),
	head: () => ({
		meta: [
			{ title: "Acceso — HTTP Security Headers Validator" },
			{
				name: "description",
				content:
					"Inicia sesión o crea una cuenta para acceder al historial de análisis.",
			},
		],
	}),
	component: AuthPage,
});

const credsSchema = z.object({
	email: z.email("Email inválido").trim().max(255),
	password: z.string().min(8, "Mínimo 8 caracteres").max(72),
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
		const parsed = credsSchema.safeParse({ email, password });
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
					toast.error(res.error.message || "Credenciales inválidas");
					return;
				}

				toast.success("Sesión iniciada");
				navigate({ to: redirect || "/history" });
			} else {
				const res = await authClient.signUp.email({
					email: parsed.data.email,
					password: parsed.data.password,
					name: parsed.data.email.split("@")[0],
				});

				if (res.error) {
					toast.error(res.error.message || "Error al crear cuenta");
					return;
				}

				toast.success("Cuenta creada. Revisa tu correo para confirmar.");
				setTab("login");
				setPassword("");
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Error";
			toast.error(
				msg.includes("Invalid login") ? "Credenciales inválidas" : msg,
			);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex flex-col">
			<Toaster theme="dark" position="top-right" richColors />
			<header className="bg-transparent">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center">
					<Link to="/" className="flex items-center gap-2 font-bold">
						<ShieldCheck className="size-5 text-primary" />
						<span style={{ fontFamily: "Space Grotesk, sans-serif" }}>
							HSHV
						</span>
					</Link>
				</div>
			</header>
			<main className="flex-1 grid place-items-center px-4 py-12">
				<div className="w-full max-w-md space-y-6">
					<div className="text-center space-y-2">
						<h1
							className="text-3xl font-bold"
							style={{ fontFamily: "Space Grotesk, sans-serif" }}
						>
							{tab === "login" ? "Inicia sesión" : "Crea tu cuenta"}
						</h1>
						<p className="text-sm text-muted-foreground">
							Guarda tu historial de análisis en la nube.
						</p>
					</div>

					<div className="rounded-xl border border-border p-6">
						<Tabs
							value={tab}
							onValueChange={(v) => setTab(v as "login" | "signup")}
						>
							<TabsList className="grid grid-cols-2 bg-transparent w-full mb-6">
								<TabsTrigger value="login">Iniciar sesión</TabsTrigger>
								<TabsTrigger value="signup">Crear cuenta</TabsTrigger>
							</TabsList>

							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										autoComplete="email"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="tu@dominio.com"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Contraseña</Label>
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
										placeholder="Mínimo 8 caracteres"
									/>
								</div>
								<Button type="submit" className="w-full" disabled={loading}>
									{loading && <Loader2 className="size-4 animate-spin" />}
									{tab === "login" ? "Entrar" : "Registrarme"}
								</Button>
							</form>

							<TabsContent value="login" />
							<TabsContent value="signup" />
						</Tabs>
					</div>

					<p className="text-center text-xs text-muted-foreground">
						<Link
							to="/"
							className="flex flex-row items-center space-x-2 justify-center hover:text-primary"
						>
							<ArrowLeft />
							<span>Volver</span>
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
