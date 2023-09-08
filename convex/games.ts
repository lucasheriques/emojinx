import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { generateGrid } from "./helper";

// Create a new task with the given text
export const createGame = mutation({
  handler: async (ctx) => {
    const game = await ctx.db.insert("games", {
      grid: generateGrid(5),
    });
    return game;
  },
});

export const getGames = query({
  handler: async (ctx) => {
    return ctx.db.query("games").collect();
  },
});
