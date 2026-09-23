import type { Singer } from "./types"

export function getVocalistClass(singers: Singer[]) {
	const sorted = [...singers].sort()
	const key = sorted.join("-")

	switch (key) {
		case "tom":
			return "tom"

		case "romain":
			return "romain"

		case "dylan":
			return "dylan"

		case "romain-tom":
			return "tom-romain"

		case "dylan-romain":
			return "romain-dylan"

		case "dylan-tom":
			return "tom-dylan"

		case "dylan-romain-tom":
			return "all"

		default:
			return "all"
	}
}

export function practiceLine(text: string, mode: "start" | "end") {
	const words = text.trim().split(/\s+/)

	if (words.length <= 2) {
		return text
	}

	if (mode === "start") {
		return `${words.slice(0, 2).join(" ")}…`
	}

	return `…${words.slice(-2).join(" ")}`
}
