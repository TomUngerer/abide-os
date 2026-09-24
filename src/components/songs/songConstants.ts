export const statusLabels = {
	unknown: "Inconnu",
	writing: "Écriture",
	recording: "Enregistrement",
	mixing: "Mixage",
	mastered: "Masterisé",
	released: "Sorti",
	cover: "Reprise",
} as const

export type SongStatus = keyof typeof statusLabels

export const keyOptions = [
	"C",
	"G",
	"D",
	"A",
	"E",
	"F",
	"Bb",
	"Eb",
	"Ab",
	"C#",
	"F#",
	"B",
	"A minor",
	"E minor",
	"D minor",
	"B minor",
	"G minor",
	"C minor",
] as const

export type SongKey = (typeof keyOptions)[number]

export const tuningOptions = [
	"E Standard",
	"Drop D",
	"C# Standard",
	"Drop C#",
	"C Standard",
	"Drop C",
] as const

export type SongTuning = (typeof tuningOptions)[number]
