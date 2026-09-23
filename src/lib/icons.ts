import { icon, library } from "@fortawesome/fontawesome-svg-core"
import {} from "@fortawesome/free-brands-svg-icons"
import {
	faAlignLeft,
	faAlignRight,
	faHome,
	faPenToSquare,
	faPlus,
	faTrash,
	faMusic,
	faList,
	faCalendar,
	faUser,
} from "@fortawesome/free-solid-svg-icons"

// Add everything once
library.add()

// Build a lookup
export const iconMap: Record<string, any> = {
	edit: faPenToSquare,
	plus: faPlus,
	alignLeft: faAlignLeft,
	alignRight: faAlignRight,
	trash: faTrash,
	home: faHome,
	music: faMusic,
	list: faList,
	calendar: faCalendar,
	user: faUser,
}

// Helper to render directly
export function getIcon(name: string) {
	const def = iconMap[name]

	if (!def) return null

	// Custom SVG
	if (typeof def === "string") {
		return { html: [def] }
	}

	// Font Awesome icon
	return icon(def)
}
