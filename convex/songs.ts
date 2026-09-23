import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
	args: {},
	handler: async (ctx) => {
		const songs = await ctx.db.query("songs").collect()
		return songs.sort(
			(a, b) =>
				(a.position ?? Number.MAX_SAFE_INTEGER) -
				(b.position ?? Number.MAX_SAFE_INTEGER),
		)
	},
})

export const getBySlug = query({
	args: {
		slug: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("songs")
			.withIndex("by_slug", (q) => q.eq("slug", args.slug))
			.unique()
	},
})

export const create = mutation({
	args: {
		title: v.string(),
	},
	handler: async (ctx, args) => {
		const title = args.title.trim()
		const slug =
			title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "") || "untitled"

		const existing = await ctx.db
			.query("songs")
			.withIndex("by_slug", (q) => q.eq("slug", slug))
			.unique()

		if (existing) {
			throw new Error("A song with this title already exists.")
		}

		const songId = await ctx.db.insert("songs", {
			title: title || "Untitled",
			slug,
			position: Date.now(),
			status: "unknown",
		})

		return { songId, slug }
	},
})

export const updateOrder = mutation({
	args: {
		orderedSongIds: v.array(v.id("songs")),
	},
	handler: async (ctx, args) => {
		for (const [index, songId] of args.orderedSongIds.entries()) {
			await ctx.db.patch(songId, { position: index + 1 })
		}

		return args.orderedSongIds
	},
})

export const update = mutation({
	args: {
		songId: v.id("songs"),
		title: v.optional(v.string()),
		status: v.optional(
			v.union(
				v.literal("unknown"),
				v.literal("writing"),
				v.literal("recording"),
				v.literal("mixing"),
				v.literal("mastered"),
				v.literal("released"),
				v.literal("cover"),
			),
		),
		releaseDate: v.optional(v.string()),
		bpm: v.optional(v.number()),
		key: v.optional(
			v.union(
				v.literal("C"),
				v.literal("G"),
				v.literal("D"),
				v.literal("A"),
				v.literal("E"),
				v.literal("F"),
				v.literal("Bb"),
				v.literal("Eb"),
				v.literal("Ab"),
				v.literal("C#"),
				v.literal("F#"),
				v.literal("B"),
				v.literal("A minor"),
				v.literal("E minor"),
				v.literal("D minor"),
				v.literal("B minor"),
				v.literal("G minor"),
				v.literal("C minor"),
			),
		),
		tuning: v.optional(
			v.union(
				v.literal("E Standard"),
				v.literal("Drop D"),
				v.literal("C# Standard"),
				v.literal("Drop C#"),
				v.literal("C Standard"),
				v.literal("Drop C"),
			),
		),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const updates: Record<string, unknown> = {}

		if (args.title !== undefined)
			updates.title = args.title.trim() || "Untitled"
		if (args.status !== undefined) updates.status = args.status
		if (args.releaseDate !== undefined)
			updates.releaseDate = args.releaseDate.trim() || undefined
		if (args.bpm !== undefined) updates.bpm = args.bpm
		if (args.key !== undefined) updates.key = args.key.trim() || undefined
		if (args.tuning !== undefined)
			updates.tuning = args.tuning.trim() || undefined
		if (args.notes !== undefined) updates.notes = args.notes.trim() || undefined

		await ctx.db.patch(args.songId, updates)
		return args.songId
	},
})
