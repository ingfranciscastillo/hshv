import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "#/db";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5,
			strategy: "compact",
		},
	},
	advanced: {
		useSecureCookies: process.env.NODE_ENV === "production",
		cookiePrefix: "hshv",
	},
	trustedOrigins: ["http://localhost:3000", "https://hshv.dev"],
	rateLimit: {
		enabled: true,
		window: 10,
		max: 100,
		customRules: {
			"/api/auth/sign-in/email": {
				window: 60,
				max: 5,
			},
			"/api/auth/sign-up/email": {
				window: 60,
				max: 3,
			},
		},
	},
	plugins: [tanstackStartCookies()],
});
