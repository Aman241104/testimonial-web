import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(), // This will be the Clerk user ID
    college: v.optional(v.string()),
    batchYear: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]),

  testimonials: defineTable({
    authorId: v.string(), // Clerk ID of sender
    receiverId: v.string(), // Clerk ID of receiver
    content: v.string(),
    createdAt: v.number(),
    isLiked: v.optional(v.boolean()),
    theme: v.optional(v.string()), // e.g., "blue", "purple", "rose", "amber", "emerald"
    status: v.optional(v.string()), // "pending", "approved", "flagged"
  }).index("by_receiver", ["receiverId"]),
});
