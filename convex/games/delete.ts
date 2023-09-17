import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { validateGameId } from "./helpers";

export const deleteGame = mutation({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    const gameId = validateGameId(ctx, args);

    return await ctx.db.delete(gameId);
  },
});
