export type PressCategory = "article" | "interview" | "playlist" | "review"

export interface PressEntry {
	outlet: string
	url: string
	title: string
	category: PressCategory
}

export const pressEntries = [
	{
		outlet: "HEAVY",
		url: "https://heavymag.com.au/abide-share-new-track-done/",
		title: 'abide share new track "done" (🇦🇺)',
		category: "article",
	},
	{
		outlet: "GigRadar",
		url: "https://gigradar.uk/2026/01/26/newbandoftheweek-abide/",
		title: "New Band of the Week (🇬🇧)",
		category: "article",
	},
	{
		outlet: "Thoughts Words Action",
		url: "https://thoughtswordsaction.com/2026/01/26/abide-returns-with-new-single-forget-to-pretend/",
		title: 'abide Returns With New Single "forget to pretend" (🇭🇷)',
		category: "article",
	},
	{
		outlet: "Skylight Webzine",
		url: "https://skylight.gr/index.php/2026/07/12/abide-done/",
		title: 'Hard Music Reviews: abide – "done" (🇬🇷)',
		category: "review",
	},
	{
		outlet: "Disconecta",
		url: "https://disconecta.com.br/playlist-autoral-41-super-compilado/",
		title:
			"Playlist Autoral #41 – Super Compilado dos EUA e Brasil até Vietnã e Ucrânia (🇧🇷)",
		category: "playlist",
	},
	{
		outlet: "Vault Lab",
		url: "https://vaultlab.it/2026/07/14/nuove-scoperte-tra-metal-rock-elettronica-visioni-gotiche-e-canzone-dautore/",
		title:
			"Nuove scoperte tra metal, rock, elettronica, visioni gotiche e canzone d'autore (🇮🇹)",
		category: "article",
	},
	{
		outlet: "Metal Junkbox",
		url: "https://pt.metaljunkbox.com/lancamentos/abide-done/",
		title: "Lançamentos: abide – done (🇵🇹)",
		category: "review",
	},
] satisfies PressEntry[]
