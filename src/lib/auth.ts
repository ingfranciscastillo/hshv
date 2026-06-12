import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "#/db";

if (!process.env.APP_URL) {
	throw new Error("APP_URL is not defined");
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		maxPasswordLength: 78,
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
	trustedOrigins: [process.env.APP_URL],
	rateLimit: {
		enabled: true,
		window: 10,
		max: 30,
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
