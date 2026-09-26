// HSHV mark: a serif H whose crossbar is the accent "header" bar.
// Geometry mirrors public/favicon.svg (64-unit grid).
const STEMS = [18, 46];

export function LogoMark({ className }: { className?: string }) {
	return (
		<svg
			viewBox="8 10 48 44"
			className={className}
			aria-hidden="true"
			focusable="false"
		>
			<g fill="currentColor">
				{STEMS.map((c) => (
					<g key={c}>
						<rect x={c - 4} y={10} width={8} height={44} />
						<rect x={c - 10} y={10} width={20} height={3} />
						<rect x={c - 10} y={51} width={20} height={3} />
					</g>
				))}
			</g>
			<rect x={22} y={29} width={20} height={6} className="fill-primary" />
		</svg>
	);
}
