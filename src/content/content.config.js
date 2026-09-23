import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { defineCollection } from "astro:content"

// const shows = defineCollection({
// 	type: "content",
// 	schema: z.object({
// 		date: z.date(),
// 		city: z.string(),
// 		venue: z.string(),
// 		country: z.string().optional(),
// 		ticketUrl: z.string().url().optional(),
// 		soldOut: z.boolean().default(false),
// 	}),
// })

export const collections = {}
