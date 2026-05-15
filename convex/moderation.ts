import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const checkMessage = internalAction({
  args: { messageId: v.id("testimonials"), content: v.string() },
  handler: async (ctx, args) => {
    // If OPENAI_API_KEY is not set, just approve it automatically to avoid breaking the app locally
    if (!process.env.OPENAI_API_KEY) {
      console.warn("No OPENAI_API_KEY found, skipping moderation and approving.");
      await ctx.runMutation(internal.moderation.updateStatus, {
        messageId: args.messageId,
        status: "approved",
      });
      return;
    }

    try {
      const response = await fetch("https://api.openai.com/v1/moderations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ input: args.content }),
      });

      if (!response.ok) {
        throw new Error("OpenAI API error");
      }

      const data = await response.json();
      const flagged = data.results[0]?.flagged ?? false;

      await ctx.runMutation(internal.moderation.updateStatus, {
        messageId: args.messageId,
        status: flagged ? "flagged" : "approved",
      });
    } catch (error) {
      console.error("Moderation failed:", error);
      // Fallback to approved
      await ctx.runMutation(internal.moderation.updateStatus, {
        messageId: args.messageId,
        status: "approved",
      });
    }
  },
});

export const updateStatus = internalMutation({
  args: { messageId: v.id("testimonials"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, { status: args.status });
  },
});
