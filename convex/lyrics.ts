import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

const singer = v.union(
	v.literal("tom"),
	v.literal("romain"),
	v.literal("dylan"),
)

export const getForSong = query({
	args: {
		songId: v.id("songs"),
	},
	handler: async (ctx, args) => {
		const sections = await ctx.db
			.query("lyricSections")
			.withIndex("by_song", (q) => q.eq("songId", args.songId))
			.collect()

		const lines = await ctx.db
			.query("lyrics")
			.withIndex("by_song", (q) => q.eq("songId", args.songId))
			.collect()

		return {
			sections: sections.sort((a, b) => a.position - b.position),
			lines: lines.sort((a, b) => a.position - b.position),
		}
	},
})

export const replace = mutation({
	args: {
		songId: v.id("songs"),
		sections: v.array(
			v.object({
				title: v.string(),
				position: v.number(),
				repeatOfIndex: v.optional(v.number()),
				lines: v.array(
					v.object({
						text: v.string(),
						position: v.number(),
						singers: v.array(singer),
					}),
				),
			}),
		),
	},
	handler: async (ctx, args) => {
		const oldLines = await ctx.db
			.query("lyrics")
			.withIndex("by_song", (q) => q.eq("songId", args.songId))
			.collect()

		for (const line of oldLines) {
			await ctx.db.delete(line._id)
		}

		const oldSections = await ctx.db
			.query("lyricSections")
			.withIndex("by_song", (q) => q.eq("songId", args.songId))
			.collect()

		for (const section of oldSections) {
			await ctx.db.delete(section._id)
		}

		const sectionIds = []

		for (const section of args.sections) {
			const sectionId = await ctx.db.insert("lyricSections", {
				songId: args.songId,
				title: section.title,
				position: section.position,
			})

			sectionIds.push(sectionId)
		}

		for (let i = 0; i < args.sections.length; i++) {
			const section = args.sections[i]

			if (section.repeatOfIndex !== undefined) {
				const repeatOf = sectionIds[section.repeatOfIndex]

				if (repeatOf) {
					await ctx.db.patch(sectionIds[i], {
						repeatOf,
					})
				}
			}

			for (const line of section.lines) {
				await ctx.db.insert("lyrics", {
					songId: args.songId,
					sectionId: sectionIds[i],
					text: line.text,
					position: line.position,
					singers: line.singers,
				})
			}
		}
	},
})
