import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("tasks").collect()
	},
})

export const create = mutation({
	args: {
		title: v.string(),
		priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
		dueDate: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const title = args.title.trim()
		if (!title) throw new Error("Task title is required.")

		return await ctx.db.insert("tasks", {
			title,
			status: "todo",
			priority: args.priority,
			dueDate: args.dueDate,
		})
	},
})

export const updateStatus = mutation({
	args: {
		taskId: v.id("tasks"),
		status: v.union(
			v.literal("todo"),
			v.literal("in_progress"),
			v.literal("done"),
		),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.taskId, { status: args.status })
		return args.taskId
	},
})

export const remove = mutation({
	args: { taskId: v.id("tasks") },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.taskId)
		return args.taskId
	},
})
