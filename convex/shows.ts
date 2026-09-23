import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
	args: {},
	handler: async (ctx) => {
		const shows = await ctx.db.query("shows").collect()

		return await Promise.all(
			shows.map(async (show) => ({
				...show,
				setlist: show.setlistId ? await ctx.db.get(show.setlistId) : null,
			})),
		)
	},
})

export const create = mutation({
	args: {
		title: v.string(),
		date: v.string(),
		venue: v.optional(v.string()),
		setlistId: v.optional(v.id("setlists")),
	},
	handler: async (ctx, args) => {
		const slug =
			args.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-+|-+$/g, "") || "show"

		const existing = await ctx.db
			.query("shows")
			.withIndex("by_slug", (q) => q.eq("slug", slug))
			.unique()

		if (existing) {
			throw new Error("A show with this title already exists.")
		}

		return await ctx.db.insert("shows", {
			title: args.title.trim() || "Untitled show",
			slug,
			date: args.date,
			venue: args.venue,
			setlistId: args.setlistId,
		})
	},
})

export const remove = mutation({
	args: {
		showId: v.id("shows"),
	},
	handler: async (ctx, args) => {
		const show = await ctx.db.get(args.showId)
		if (!show) {
			throw new Error("Show not found.")
		}

		await ctx.db.delete(args.showId)
		return args.showId
	},
})
