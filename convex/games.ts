import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { generateGrid } from "./helper";

// Create a new task with the given text
export const createGame = mutation({
  handler: async (ctx) => {
    const game = await ctx.db.insert("games", {
      grid: generateGrid(4),
    });
    return game;
  },
});

export const getGames = query({
  handler: async (ctx) => {
    return ctx.db.query("games").collect();
  },
});

export const getGame = query({
  args: { gameId: v.string() },
  handler(ctx, args) {
    const gameId = ctx.db.normalizeId("games", args.gameId);

    if (gameId === null) {
      throw new Error("Game not found");
    }

    return ctx.db.get(gameId);
  },
});
