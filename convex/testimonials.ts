import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const sendTestimonial = mutation({
  args: {
    receiverId: v.string(), // This is the tokenIdentifier (Clerk ID) of the receiver
    content: v.string(),
    theme: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    if (identity.tokenIdentifier === args.receiverId) {
      throw new Error("You cannot give a testimonial to yourself!");
    }

    // Rate Limiting: Max 5 testimonials per minute
    const oneMinuteAgo = Date.now() - 60 * 1000;
    const recentTestimonials = await ctx.db
      .query("testimonials")
      .filter((q) => 
        q.and(
          q.eq(q.field("authorId"), identity.tokenIdentifier),
          q.gt(q.field("createdAt"), oneMinuteAgo)
        )
      )
      .collect();

    if (recentTestimonials.length >= 5) {
      throw new Error("You are sending testimonials too fast. Please wait a minute!");
    }

    const messageId = await ctx.db.insert("testimonials", {
      authorId: identity.tokenIdentifier,
      receiverId: args.receiverId,
      content: args.content,
      theme: args.theme,
      createdAt: Date.now(),
      status: "pending",
    });

    await ctx.scheduler.runAfter(0, internal.moderation.checkMessage, {
      messageId,
      content: args.content,
    });
  },
});

export const getMyTestimonials = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const testimonials = await ctx.db
      .query("testimonials")
      .withIndex("by_receiver", (q) => q.eq("receiverId", identity.tokenIdentifier))
      .collect();

    // Filter out flagged testimonials
    const safeTestimonials = testimonials.filter(t => t.status !== "flagged");

    // Enrich with author information
    const enriched = await Promise.all(
      safeTestimonials.map(async (t) => {
        const author = await ctx.db
          .query("users")
          .withIndex("by_token", (q) => q.eq("tokenIdentifier", t.authorId))
          .unique();
        return {
          ...t,
          authorName: author?.name ?? "Anonymous",
          authorImage: author?.imageUrl,
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const toggleReaction = mutation({
  args: {
    id: v.id("testimonials"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const testimonial = await ctx.db.get(args.id);
    if (!testimonial) {
      throw new Error("Testimonial not found");
    }

    if (testimonial.receiverId !== identity.tokenIdentifier) {
      throw new Error("Only the receiver can react to a testimonial");
    }

    await ctx.db.patch(args.id, {
      isLiked: !testimonial.isLiked,
    });
  },
});
