export type Language = "en" | "fr"

export type LocalizedText = Record<Language, string>

export type StreamingPlatform =
	| "youtube"
	| "bandcamp"
	| "subvert"
	| "spotify"
	| "apple"
	| "deezer"
	| "amazon"
	| "tidal"

export type StreamingLinks = Partial<Record<StreamingPlatform, string>>

export interface Release {
	slug: string
	title: string
	artist: "abide"
	date: string
	draft: boolean
	cover: string
	titleImage: string
	titleImageWidth: number
	color: `#${string}`
	bandcampTrackId: number
	excerpt: LocalizedText
	credits: LocalizedText
	links: StreamingLinks
}

export const releases = [
	{
		slug: "in-my-mind",
		title: "in my mind",
		artist: "abide",
		date: "2026-07-16",
		draft: true,
		cover: "/img/covers/in_my_mind.webp",
		titleImage: "/img/titles/in_my_mind-title.webp",
		titleImageWidth: 348,
		color: "#3ec0f0",
		bandcampTrackId: 1000000000,
		excerpt: {
			en: "Available on all major streaming platforms.",
			fr: "Disponible sur toutes les plateformes.",
		},
		credits: {
			en: "Mixed and mastered by ___",
			fr: "Mixé et masterisé par ___",
		},
		links: {
			youtube: "https://youtu.be/________",
			bandcamp: "https://abideband.bandcamp.com/track/click-boom",
			spotify: "https://open.spotify.com/track/__________",
			subvert: "https://www.subvert.fm/abide/tracks/clickboom",
			apple: "https://music.apple.com/song/click-boom/__________",
			deezer: "https://www.deezer.com/album/____________",
			amazon: "https://music.amazon.com/albums/____________",
			tidal: "https://tidal.com/album/__________/track/____________",
		},
	},
	{
		slug: "click-boom",
		title: "click boom",
		artist: "abide",
		date: "2026-07-15",
		draft: true,
		cover: "/img/covers/click_boom.webp",
		titleImage: "/img/titles/click_boom-title.webp",
		titleImageWidth: 1623,
		color: "#f9f004",
		bandcampTrackId: 1000000000,
		excerpt: {
			en: "Available on all major streaming platforms.",
			fr: "Disponible sur toutes les plateformes.",
		},
		credits: {
			en: "Mixed and mastered by ___",
			fr: "Mixé et masterisé par ___",
		},
		links: {
			youtube: "https://youtu.be/________",
			bandcamp: "https://abideband.bandcamp.com/track/click-boom",
			spotify: "https://open.spotify.com/track/__________",
			subvert: "https://www.subvert.fm/abide/tracks/clickboom",
			apple: "https://music.apple.com/song/click-boom/__________",
			deezer: "https://www.deezer.com/album/____________",
			amazon: "https://music.amazon.com/albums/____________",
			tidal: "https://tidal.com/album/__________/track/____________",
		},
	},
	{
		slug: "done",
		title: "done",
		artist: "abide",
		date: "2026-07-10",
		draft: false,
		cover: "/img/covers/done.webp",
		titleImage: "/img/titles/done-title.webp",
		titleImageWidth: 141,
		color: "#e1008c",
		bandcampTrackId: 46230078,
		excerpt: {
			en: "Available on all major streaming platforms.",
			fr: "Disponible sur toutes les plateformes.",
		},
		credits: {
			en: "Mixed and mastered by SIME",
			fr: "Mixé et masterisé par SIME",
		},
		links: {
			youtube: "https://youtu.be/sabgBr26K7s",
			bandcamp: "https://abideband.bandcamp.com/track/done",
			spotify: "https://open.spotify.com/track/3LeUxfw6uVIy3gtcZfCfL4",
			subvert: "https://www.subvert.fm/abide/tracks/done",
			apple: "https://music.apple.com/song/done/6788061475",
			deezer: "https://www.deezer.com/fr/track/4136292141",
			amazon: "https://music.amazon.com/albums/B0H7TBHJL5",
			tidal: "https://tidal.com/album/540689585/track/540689588",
		},
	},
	{
		slug: "forget-to-pretend",
		title: "forget to pretend",
		artist: "abide",
		date: "2026-01-16",
		draft: false,
		cover: "/img/covers/forget_to_pretend.webp",
		titleImage: "/img/titles/forget_to_pretend-title.webp",
		titleImageWidth: 700,
		color: "#69BB61",
		bandcampTrackId: 3492385155,
		excerpt: {
			en: "Available on all major streaming platforms.",
			fr: "Disponible sur toutes les plateformes.",
		},
		credits: {
			en: "Mixed and mastered by Romesh Dodangoda (Bring Me The Horizon, Motörhead, Nova Twins)",
			fr: "Mixé et masterisé par Romesh Dodangoda (Bring Me The Horizon, Motörhead, Nova Twins)",
		},
		links: {
			youtube: "https://youtu.be/Pv-C56ZRvFg",
			bandcamp: "https://abideband.bandcamp.com/track/forget-to-pretend",
			spotify: "https://open.spotify.com/track/1d5ZdUsPz0SDYLRbmCS6nQ",
			subvert: "https://www.subvert.fm/abide/tracks/forgettopretend",
			apple: "https://music.apple.com/song/forget-to-pretend/1868428006",
			deezer: "https://www.deezer.com/album/895934702",
			amazon: "https://music.amazon.com/albums/B0GGCV61PX",
			tidal: "https://tidal.com/album/489103424/track/489103433",
		},
	},
	{
		slug: "lullaby-lullaby",
		title: "lullaby lullaby",
		artist: "abide",
		date: "2025-10-31",
		draft: false,
		cover: "/img/covers/lullaby_lullaby.webp",
		titleImage: "/img/titles/lullaby_lullaby-title.webp",
		titleImageWidth: 700,
		color: "#e7660b",
		bandcampTrackId: 2111180256,
		excerpt: {
			en: "Available on all major streaming platforms.",
			fr: "Disponible sur toutes les plateformes.",
		},
		credits: {
			en: "Mixed and mastered by Martin Corkhill at West15 Recording",
			fr: "Mixé et masterisé par Martin Corkhill chez West15 Recording",
		},
		links: {
			youtube: "https://youtu.be/YtHeF5hvz4U",
			bandcamp: "https://abideband.bandcamp.com/track/lullaby-lullaby",
			spotify: "https://open.spotify.com/track/1VYwhaygn8wJ0G6rIcz0l4",
			subvert: "https://www.subvert.fm/abide/tracks/lullabylullaby",
			apple: "https://music.apple.com/song/lullaby-lullaby/1868707047",
			deezer: "https://www.deezer.com/album/845446922",
			amazon: "https://music.amazon.com/albums/B0FXYKNHY9",
			tidal: "https://tidal.com/album/489368293/track/489368294",
		},
	},
] satisfies Release[]

export function getPublishedReleases(now = new Date()): Release[] {
	return releases
		.filter(
			(release) =>
				!release.draft && new Date(release.date).valueOf() <= now.valueOf(),
		)
		.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
}

export function getVisibleReleases(): Release[] {
	return releases
		.filter((release) => !release.draft)
		.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
}
