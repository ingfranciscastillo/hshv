import { m } from "@/paraglide/messages.js";

export type MessageKey = keyof typeof m;
type MessageParams = Record<string, string | number>;

/** A reference to a message, resolved in the viewer's locale at render time. */
export interface MessageRef {
	key: MessageKey;
	params?: MessageParams;
}

/**
 * Localizable text. Plain strings are shown as-is: language-neutral values
 * (header configurations) and reports saved before i18n existed.
 */
export type Text = string | MessageRef;

export const msg = (key: MessageKey, params?: MessageParams): MessageRef =>
	params ? { key, params } : { key };

type AnyMessage = (inputs?: MessageParams) => string;

export function t(text: Text): string {
	if (typeof text === "string") return text;
	const fn = m[text.key] as unknown as AnyMessage | undefined;
	return fn ? fn(text.params ?? {}) : text.key;
}
