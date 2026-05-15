import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const colleges = [
      "Stanford University",
      "UC Berkeley",
      "MIT",
      "Harvard University",
      "Georgia Tech",
    ];
    const years = ["2022", "2023", "2024", "2025"];
    const themes = ["blue", "purple", "rose", "amber", "emerald"];
    const firstNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    
    const messages = [
      "You're an absolute legend! Thanks for all the help in CS101.",
      "I'll miss our late night pizza runs more than anything else.",
      "Good luck with whatever comes next, I know you'll crush it!",
      "To the person who always kept me sane during finals week—thank you.",
      "We've come a long way since freshman orientation. So proud of us!",
      "Don't forget us when you're famous!",
      "The best lab partner and an even better friend.",
      "May your code always compile and your coffee always be hot.",
      "You made this place feel like home.",
      "Keep shining! The world isn't ready for what you're about to do.",
    ];

    const userIds: string[] = [];

    // Create 20 Randomized Users
    for (let i = 0; i < 20; i++) {
      const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
      const tokenIdentifier = `user_seed_${i}`;
      const college = colleges[Math.floor(Math.random() * colleges.length)];
      const batchYear = years[Math.floor(Math.random() * years.length)];
      
      await ctx.db.insert("users", {
        name,
        tokenIdentifier,
        college,
        batchYear,
        bio: `A ${college} student from the class of ${batchYear}.`,
        imageUrl: `https://i.pravatar.cc/150?u=${tokenIdentifier}`,
      });
      userIds.push(tokenIdentifier);
    }

    // Get current user to send them testimonials
    const identity = await ctx.auth.getUserIdentity();
    if (identity) {
      const me = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();

      if (me) {
        // Send 50 Randomized Testimonials to ME
        for (let i = 0; i < 50; i++) {
          const authorId = userIds[Math.floor(Math.random() * userIds.length)];
          const content = messages[Math.floor(Math.random() * messages.length)];
          const theme = themes[Math.floor(Math.random() * themes.length)];
          
          await ctx.db.insert("testimonials", {
            authorId,
            receiverId: me.tokenIdentifier,
            content,
            theme,
            createdAt: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30), // Random time in last 30 days
            isLiked: Math.random() > 0.7,
          });
        }
      }
    }

    return "Database seeded with 20 users and 50 testimonials!";
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      if (user.tokenIdentifier.startsWith("user_seed_")) {
        await ctx.db.delete(user._id);
      }
    }
    
    // We can't easily clear testimonials without more logic but this is fine for seed data
    const testimonials = await ctx.db.query("testimonials").collect();
    for (const t of testimonials) {
      if (t.authorId.startsWith("user_seed_")) {
        await ctx.db.delete(t._id);
      }
    }
    
    return "Test data cleared!";
  },
});
