import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { generateGrid } from "./helper";
import { GameStatus } from "./types";

// Create a new task with the given text
export const createGame = mutation({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.insert("games", {
      roomName: args.roomName,
      grid: generateGrid(4),
      gameStatus: GameStatus.NotStarted,
      players: [],
      currentPlayerId: null,
      currentAction: null,
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

export const joinGame = mutation({
  args: {
    gameId: v.string(),
    playerId: v.string(),
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

    const players = game.players;

    if (players.includes(args.playerId)) {
      throw new Error("Player already joined");
    }

    players.push(args.playerId);

    await ctx.db.patch(gameId, { players });

    return game;
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
