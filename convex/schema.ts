import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	songs: defineTable({
		title: v.string(),
		slug: v.string(),
		position: v.optional(v.number()),
		status: v.union(
			v.literal("unknown"),
			v.literal("writing"),
			v.literal("recording"),
			v.literal("mixing"),
			v.literal("mastered"),
			v.literal("released"),
			v.literal("cover"),
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
	}).index("by_slug", ["slug"]),

	lyricSections: defineTable({
		songId: v.id("songs"),
		title: v.string(),
		position: v.number(),
		repeatOf: v.optional(v.id("lyricSections")),
	}).index("by_song", ["songId"]),

	lyrics: defineTable({
		songId: v.id("songs"),
		sectionId: v.optional(v.id("lyricSections")),
		text: v.string(),
		position: v.number(),
		singers: v.array(
			v.union(v.literal("tom"), v.literal("romain"), v.literal("dylan")),
		),
	}).index("by_song", ["songId"]),

	setlists: defineTable({
		title: v.string(),
		slug: v.string(),
		notes: v.optional(v.string()),
	}).index("by_slug", ["slug"]),

	shows: defineTable({
		title: v.string(),
		slug: v.string(),
		date: v.string(),
		venue: v.optional(v.string()),
		setlistId: v.optional(v.id("setlists")),
	}).index("by_slug", ["slug"]),

	setlistSongs: defineTable({
		setlistId: v.id("setlists"),
		songId: v.id("songs"),
		position: v.number(),
	})
		.index("by_setlist", ["setlistId"])
		.index("by_song", ["songId"]),

	releases: defineTable({
		title: v.string(),
		slug: v.string(),
		releaseDate: v.optional(v.string()),
		status: v.union(
			v.literal("planning"),
			v.literal("scheduled"),
			v.literal("released"),
		),
		draft: v.boolean(),
		excerpt: v.optional(v.string()),
		credits: v.optional(v.string()),
		cover: v.optional(v.string()),
	}).index("by_slug", ["slug"]),

	releaseSongs: defineTable({
		releaseId: v.id("releases"),
		songId: v.id("songs"),
	})
		.index("by_release", ["releaseId"])
		.index("by_song", ["songId"]),

	tasks: defineTable({
		title: v.string(),
		status: v.union(
			v.literal("todo"),
			v.literal("in_progress"),
			v.literal("done"),
		),
		priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
		dueDate: v.optional(v.string()),
		songId: v.optional(v.id("songs")),
		releaseId: v.optional(v.id("releases")),
	}),
})
