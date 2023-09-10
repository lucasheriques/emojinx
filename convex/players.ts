import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPlayer = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const player = await ctx.db.insert("players", {
      username: args.username,
    });
    return player;
  },
});

export const getPlayer = query({
  args: { playerId: v.string() },
  handler: (ctx, args) => {
    const playerId = ctx.db.normalizeId("players", args.playerId);

    if (!playerId) {
      throw new Error("Player ID invalid or not found");
    }

    const player = ctx.db.get(playerId);

    if (!player) {
      throw new Error("Player invalid or not found");
    }

    return ctx.db.get(playerId);
  },
});