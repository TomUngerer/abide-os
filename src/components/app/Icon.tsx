import type { CSSProperties } from "react"
import { getIcon } from "../../lib/icons"

type IconProps = {
	name: string
	className?: string
	style?: CSSProperties
}

export default function Icon({ name, className = "", style }: IconProps) {
	const icon = getIcon(name)

	if (!icon || !icon.html?.[0]) {
		return null
	}

	return (
		<span
			className={`icon ${className}`.trim()}
			style={style}
			dangerouslySetInnerHTML={{ __html: icon.html[0] }}
		/>
	)
}
