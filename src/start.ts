// src/start.ts
import { createCsrfMiddleware, createStart } from "@tanstack/react-start";
import { securityHeadersMiddleware } from "@/middleware/security-headers";

const csrfMiddleware = createCsrfMiddleware({
	filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
	requestMiddleware: [csrfMiddleware, securityHeadersMiddleware],
}));
