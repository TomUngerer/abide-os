import { mutation } from "./_generated/server"

export const seed = mutation({
	args: {},
	handler: async (ctx) => {
		const song = await ctx.db
			.query("songs")
			.withIndex("by_slug", (q) => q.eq("slug", "click-boom"))
			.unique()

		if (!song) {
			throw new Error("CLICK BOOM song not found.")
		}

		const existingSections = await ctx.db
			.query("lyricSections")
			.withIndex("by_song", (q) => q.eq("songId", song._id))
			.collect()

		for (const section of existingSections) {
			await ctx.db.delete(section._id)
		}

		const existingLines = await ctx.db
			.query("lyrics")
			.withIndex("by_song", (q) => q.eq("songId", song._id))
			.collect()

		for (const line of existingLines) {
			await ctx.db.delete(line._id)
		}

		const sections = [
			{
				title: "Verse 1",
				lines: [
					["The cycle starts again", ["tom"]],
					["A trend of starting wars", ["tom"]],
					["Protesters gather", ["tom"]],
					["Raising moral cries for justice", ["tom"]],
					["But we’ve seen this all before", ["tom"]],
				],
			},
			{
				title: "Chorus",
				lines: [
					["Where do you go", ["romain"]],
					["When you sleep at night", ["romain"]],
					["Is there a gun under your pillow", ["romain"]],
					["(CLICK BOOM)", ["tom", "romain", "dylan"]],
					["Do you place it by your head", ["romain"]],
					["Finger trembling on the trigger", ["romain"]],
					["How far will you go", ["romain"]],
					["(CLICK BOOM)", ["tom", "romain", "dylan"]],
				],
			},
			{
				title: "Verse 2",
				lines: [
					["From Houston to LA", ["tom"]],
					["Madrid to Tokyo", ["tom"]],
					["Your policies and fallacies", ["tom"]],
					["No apologies at all", ["tom"]],
					["We stand together defying your control", ["tom"]],
				],
			},
			{
				title: "Chorus",
				repeatOf: 1,
				lines: [],
			},
			{
				title: "Bridge",
				lines: [
					["You lie awake", ["tom"]],
					["Afraid to dream", ["tom"]],
					["Surrounded by the things you’ve done", ["tom"]],
					["Shadows crawling", ["tom"]],
					["Beneath your door", ["tom"]],
					["No escape when the night comes", ["tom"]],
				],
			},
			{
				title: "Chorus",
				repeatOf: 1,
				lines: [],
			},
		]

		const sectionIds = []

		for (let position = 0; position < sections.length; position++) {
			const section = sections[position]

			const sectionId = await ctx.db.insert("lyricSections", {
				songId: song._id,
				title: section.title,
				position,
			})

			sectionIds.push(sectionId)

			for (
				let linePosition = 0;
				linePosition < section.lines.length;
				linePosition++
			) {
				const [text, singers] = section.lines[linePosition]

				await ctx.db.insert("lyrics", {
					songId: song._id,
					sectionId,
					text: text as string,
					position: linePosition,
					singers: singers as ("tom" | "romain" | "dylan")[],
				})
			}
		}

		await ctx.db.patch(sectionIds[3], {
			repeatOf: sectionIds[1],
		})

		await ctx.db.patch(sectionIds[5], {
			repeatOf: sectionIds[1],
		})

		return {
			song: song.title,
			sections: sectionIds.length,
		}
	},
})
