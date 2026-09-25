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

export function practiceLine(
	text: string,
	mode: "start" | "end",
	wordCount: 2 | 3 | 4,
) {
	const words = text.trim().split(/\s+/)

	if (words.length <= wordCount) {
		return text
	}

	if (mode === "start") {
		return `${words.slice(0, wordCount).join(" ")}…`
	}

	return `…${words.slice(-wordCount).join(" ")}`
}
