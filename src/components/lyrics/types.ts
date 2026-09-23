export type Singer = "tom" | "romain" | "dylan"

export type SingerFilter = Singer | "all"

export type Line = {
	text: string
	position: number
	singers: Singer[]
}

export type Section = {
	title: string
	position: number
	repeatOfIndex?: number
	lines: Line[]
}

export type ViewMode = "full" | "no-repeats" | "practice"

export const singerLabels: Record<Singer, string> = {
	tom: "Tom",
	romain: "Romain",
	dylan: "Dylan",
}
