import { lazy, Suspense } from "react";
import type { FaultyTerminalProps } from "./FaultyTerminal";

const FaultyTerminal = lazy(() => import("./FaultyTerminal"));

export default function FaultyTerminalClient(props: FaultyTerminalProps) {
	return (
		<Suspense fallback={null}>
			<FaultyTerminal {...props} />
		</Suspense>
	);
}
