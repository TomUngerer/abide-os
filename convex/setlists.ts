import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
	args: {},
	handler: async (ctx) => {
		const setlists = await ctx.db.query("setlists").collect()
		return await Promise.all(
			setlists.map(async (setlist) => {
				const songs = await ctx.db
					.query("setlistSongs")
					.withIndex("by_setlist", (q) => q.eq("setlistId", setlist._id))
					.collect()

				const songRows = await Promise.all(
					songs
						.sort((a, b) => a.position - b.position)
						.map(async (row) => {
							const song = await ctx.db.get(row.songId)
							return { ...row, song }
						}),
				)

				return { ...setlist, songs: songRows }
			}),
		)
	},
})

export const getBySlug = query({
	args: {
		slug: v.string(),
	},
	handler: async (ctx, args) => {
		const setlist = await ctx.db
			.query("setlists")
			.withIndex("by_slug", (q) => q.eq("slug", args.slug))
			.unique()

		if (!setlist) return null

		const rows = await ctx.db
			.query("setlistSongs")
			.withIndex("by_setlist", (q) => q.eq("setlistId", setlist._id))
			.collect()

		const songs = await Promise.all(
			rows
				.sort((a, b) => a.position - b.position)
				.map(async (row) => {
					const song = await ctx.db.get(row.songId)
					return { ...row, song }
				}),
		)

		return { ...setlist, songs }
	},
})

export const create = mutation({
	args: {
		title: v.string(),
		notes: v.optional(v.string()),
		songIds: v.array(v.id("songs")),
	},
	handler: async (ctx, args) => {
		const slug =
			args.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "") || "setlist"

		const existing = await ctx.db
			.query("setlists")
			.withIndex("by_slug", (q) => q.eq("slug", slug))
			.unique()

		if (existing) {
			throw new Error("A setlist with this title already exists.")
		}

		const setlistId = await ctx.db.insert("setlists", {
			title: args.title,
			slug,
			notes: args.notes,
		})

		for (const [index, songId] of args.songIds.entries()) {
			await ctx.db.insert("setlistSongs", {
				setlistId,
				songId,
				position: index + 1,
			})
		}

		return setlistId
	},
})

export const update = mutation({
	args: {
		setlistId: v.id("setlists"),
		title: v.string(),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const setlist = await ctx.db.get(args.setlistId)
		if (!setlist) {
			throw new Error("Setlist not found.")
		}

		const slug =
			args.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "") || "setlist"

		const existing = await ctx.db
			.query("setlists")
			.withIndex("by_slug", (q) => q.eq("slug", slug))
			.unique()

		if (existing && existing._id !== args.setlistId) {
			throw new Error("A setlist with this title already exists.")
		}

		await ctx.db.patch(args.setlistId, {
			title: args.title,
			slug,
			notes: args.notes,
		})

		return { setlistId: args.setlistId, slug }
	},
})

export const remove = mutation({
	args: {
		setlistId: v.id("setlists"),
	},
	handler: async (ctx, args) => {
		const setlist = await ctx.db.get(args.setlistId)
		if (!setlist) {
			throw new Error("Setlist not found.")
		}

		const songs = await ctx.db
			.query("setlistSongs")
			.withIndex("by_setlist", (q) => q.eq("setlistId", args.setlistId))
			.collect()

		for (const song of songs) {
			await ctx.db.delete(song._id)
		}

		await ctx.db.delete(args.setlistId)
		return args.setlistId
	},
})

export const updateSongOrder = mutation({
	args: {
		setlistId: v.id("setlists"),
		orderedSongIds: v.array(v.id("songs")),
	},
	handler: async (ctx, args) => {
		const rows = await ctx.db
			.query("setlistSongs")
			.withIndex("by_setlist", (q) => q.eq("setlistId", args.setlistId))
			.collect()

		const rowMap = new Map(rows.map((row) => [row.songId.toString(), row]))

		for (const [index, songId] of args.orderedSongIds.entries()) {
			const row = rowMap.get(songId.toString())
			if (row) {
				await ctx.db.patch(row._id, {
					position: index + 1,
				})
			}
		}

		return args.setlistId
	},
})
