import { m } from "@/paraglide/messages.js";
import { type MessageKey, msg, t } from "./i18n";

// Server errors carry a message key so the client can show them in its locale.
const PREFIX = "hshv:";

export type ErrorKey = Extract<MessageKey, `err_${string}`>;

export function appError(
	key: ErrorKey,
	params?: Record<string, string | number>,
) {
	return new Error(`${PREFIX}${JSON.stringify(msg(key, params))}`);
}

export function errorText(error: unknown): string {
	const message = error instanceof Error ? error.message : "";
	if (message.startsWith(PREFIX)) {
		try {
			const ref = JSON.parse(message.slice(PREFIX.length));
			if (typeof ref?.key === "string" && ref.key in m) return t(ref);
		} catch {
			// Fall through to the raw message.
		}
	}
	return message || m.unknown_error();
}
