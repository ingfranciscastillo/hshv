import { createMiddleware } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

export const securityHeadersMiddleware = createMiddleware().server(
	async ({ next }) => {
		setResponseHeader("X-Content-Type-Options", "nosniff");
		setResponseHeader("X-Frame-Options", "DENY");
		setResponseHeader("X-XSS-Protection", "1; mode=block");
		setResponseHeader("Referrer-Policy", "strict-origin-when-cross-origin");
		setResponseHeader(
			"Strict-Transport-Security",
			"max-age=31536000; includeSubDomains; preload",
		);
		setResponseHeader(
			"Permissions-Policy",
			"accelerometer=(), camera=(), geolocation=(), microphone=()",
		);
		setResponseHeader(
			"Content-Security-Policy",
			[
				"default-src 'self'",
				"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
				"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
				"font-src 'self' https://fonts.gstatic.com",
				"img-src 'self' data: https:",
				"connect-src 'self' https://api.firecrawl.dev",
				"frame-ancestors 'none'",
				"base-uri 'self'",
				"form-action 'self'",
			].join("; "),
		);
		setResponseHeader("Cross-Origin-Opener-Policy", "same-origin");
		setResponseHeader("Cross-Origin-Embedder-Policy", "require-corp");
		setResponseHeader("Cross-Origin-Resource-Policy", "same-origin");
		return next();
	},
);
