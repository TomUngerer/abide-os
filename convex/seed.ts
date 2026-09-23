import { mutation } from "./_generated/server"

const songs = [
	{
		title: "lullaby lullaby",
		slug: "lullaby-lullaby",
		status: "released" as const,
	},
	{
		title: "forget to pretend",
		slug: "forget-to-pretend",
		status: "released" as const,
	},
	{
		title: "done",
		slug: "done",
		status: "released" as const,
	},
	{
		title: "in my mind",
		slug: "in-my-mind",
		status: "unknown" as const,
	},
	{
		title: "click boom",
		slug: "click-boom",
		status: "unknown" as const,
	},
	{
		title: "burn",
		slug: "burn",
		status: "unknown" as const,
	},
	{
		title: "metal goat",
		slug: "metal-goat",
		status: "unknown" as const,
	},
	{
		title: "question",
		slug: "question",
		status: "unknown" as const,
	},
	{
		title: "what’s me",
		slug: "whats-me",
		status: "unknown" as const,
	},
	{
		title: "bloom",
		slug: "bloom",
		status: "unknown" as const,
	},
]

const releases = [
	{
		title: "lullaby lullaby",
		slug: "lullaby-lullaby",
		releaseDate: "2025-10-31",
		status: "released" as const,
		draft: false,
		cover: "/img/covers/lullaby_lullaby.webp",
		excerpt: "Available on all major streaming platforms.",
		credits: "Mixed and mastered by Martin Corkhill at West15 Recording",
	},
	{
		title: "forget to pretend",
		slug: "forget-to-pretend",
		releaseDate: "2026-01-16",
		status: "released" as const,
		draft: false,
		cover: "/img/covers/forget_to_pretend.webp",
		excerpt: "Available on all major streaming platforms.",
		credits:
			"Mixed and mastered by Romesh Dodangoda (Bring Me The Horizon, Motörhead, Nova Twins)",
	},
	{
		title: "done",
		slug: "done",
		releaseDate: "2026-07-10",
		status: "released" as const,
		draft: false,
		cover: "/img/covers/done.webp",
		excerpt: "Available on all major streaming platforms.",
		credits: "Mixed and mastered by SIME",
	},
	{
		title: "click boom",
		slug: "click-boom",
		releaseDate: "2026-07-15",
		status: "planning" as const,
		draft: true,
		cover: "/img/covers/click_boom.webp",
		excerpt: "Available on all major streaming platforms.",
		credits: "Mixed and mastered by ___",
	},
	{
		title: "in my mind",
		slug: "in-my-mind",
		releaseDate: "2026-07-16",
		status: "planning" as const,
		draft: true,
		cover: "/img/covers/in_my_mind.webp",
		excerpt: "Available on all major streaming platforms.",
		credits: "Mixed and mastered by ___",
	},
]

export const seed = mutation({
	args: {},
	handler: async (ctx) => {
		const existingSongs = await ctx.db.query("songs").collect()
		const existingReleases = await ctx.db.query("releases").collect()

		if (existingSongs.length > 0 || existingReleases.length > 0) {
			return {
				seeded: false,
				reason: "Database already contains songs or releases.",
			}
		}

		const songIds = new Map<string, any>()

		for (const song of songs) {
			const id = await ctx.db.insert("songs", song)
			songIds.set(song.slug, id)
		}

		const releaseIds = new Map<string, any>()

		for (const release of releases) {
			const id = await ctx.db.insert("releases", release)
			releaseIds.set(release.slug, id)
		}

		const relationships = [
			["lullaby-lullaby", "lullaby-lullaby"],
			["forget-to-pretend", "forget-to-pretend"],
			["done", "done"],
			["click-boom", "click-boom"],
			["in-my-mind", "in-my-mind"],
		]

		for (const [songSlug, releaseSlug] of relationships) {
			await ctx.db.insert("releaseSongs", {
				songId: songIds.get(songSlug),
				releaseId: releaseIds.get(releaseSlug),
			})
		}

		return {
			seeded: true,
			songs: songs.length,
			releases: releases.length,
		}
	},
})
