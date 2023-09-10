import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrGetPlayer = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const existingPlayer = await ctx.db
      .query("players")
      .filter((player) => player.eq(player.field("username"), args.username))
      .first();
    if (existingPlayer) {
      return existingPlayer;
    }
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
      return "PLAYER_ID_NOT_FOUND" as const;
    }

    const player = ctx.db.get(playerId);

    if (!player) {
      return "PLAYER_NOT_FOUND" as const;
    }

    return ctx.db.get(playerId);
  },
});
