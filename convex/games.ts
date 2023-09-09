import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { generateGrid } from "./helper";

// Create a new task with the given text
export const createGame = mutation({
  handler: async (ctx) => {
    const game = await ctx.db.insert("games", {
      grid: generateGrid(4),
      gameStatus: "not-started",
      players: [],
      currentPlayerId: null,
      winnerId: null,
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

export const makeInitialPlay = mutation({
  args: {
    gameId: v.string(),
    row: v.number(),
    col: v.number(),
  },
  handler: async (ctx, args) => {
    const gameId = ctx.db.normalizeId("games", args.gameId);

    if (gameId === null) {
      throw new Error("Game not found");
    }

    const game = await ctx.db.get(gameId);

    if (game === null) {
      throw new Error("Game not found");
    }

    const grid = game.grid;

    const position = grid[args.row][args.col];

    if (position.status !== "hidden") {
      throw new Error("Invalid play");
    }

    position.status = "revealed";

    grid[args.row][args.col] = position;

    await ctx.db.patch(gameId, { grid });

    return game;
  },
});
