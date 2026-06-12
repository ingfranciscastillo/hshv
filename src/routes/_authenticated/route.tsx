import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async (ctx) => {
		const sessionData = await authClient.getSession();

		if (!sessionData || !("user" in sessionData)) {
			throw redirect({
				to: "/auth",
				search: {
					redirect: ctx.location.href,
				},
			});
		}

		return {
			user: sessionData.user,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_authenticated"!</div>;
}
