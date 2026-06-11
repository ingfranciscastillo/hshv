const BLOCKED_HOSTS = new Set([
	"localhost",
	"ip6-localhost",
	"ip6-loopback",
	"broadcasthost",
]);

function isPrivateIPv4(ip: string): boolean {
	const parts = ip.split(".").map(Number);
	if (
		parts.length !== 4 ||
		parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)
	)
		return false;
	const [a, b] = parts;
	if (a === 10) return true;
	if (a === 127) return true;
	if (a === 0) return true;
	if (a === 169 && b === 254) return true; // link-local + cloud metadata
	if (a === 172 && b >= 16 && b <= 31) return true;
	if (a === 192 && b === 168) return true;
	if (a >= 224) return true; // multicast / reserved
	return false;
}

function isPrivateIPv6(ip: string): boolean {
	const v = ip.toLowerCase().replace(/^\[|\]$/g, "");
	if (v === "::1" || v === "::") return true;
	if (v.startsWith("fc") || v.startsWith("fd")) return true; // ULA
	if (v.startsWith("fe80")) return true; // link-local
	if (v.startsWith("::ffff:")) {
		const v4 = v.slice(7);
		return isPrivateIPv4(v4);
	}
	return false;
}

export function validateTargetUrl(
	input: string,
): { ok: true; url: URL } | { ok: false; error: string } {
	let url: URL;
	try {
		url = new URL(input);
	} catch {
		return { ok: false, error: "URL inválida." };
	}
	if (!/^https?:$/.test(url.protocol))
		return { ok: false, error: "Solo se permiten URLs http(s)." };
	if (url.username || url.password)
		return {
			ok: false,
			error: "Las credenciales en la URL no están permitidas.",
		};
	const host = url.hostname.toLowerCase();
	if (!host) return { ok: false, error: "Hostname vacío." };
	if (BLOCKED_HOSTS.has(host))
		return { ok: false, error: "Host bloqueado por política SSRF." };
	if (
		host.endsWith(".localhost") ||
		host.endsWith(".internal") ||
		host.endsWith(".local")
	)
		return { ok: false, error: "Dominio interno bloqueado." };
	// IPv4 literal
	if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
		if (isPrivateIPv4(host))
			return { ok: false, error: "Rango IPv4 privado bloqueado." };
	}
	// IPv6 literal
	if (host.includes(":")) {
		if (isPrivateIPv6(host))
			return { ok: false, error: "Rango IPv6 privado bloqueado." };
	}
	return { ok: true, url };
}
