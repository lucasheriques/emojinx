import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { generateGrid } from "./helper";
import { GameStatus } from "./types";
import { createId } from "@paralleldrive/cuid2";

const getGameById = internalQuery({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    const gameId = ctx.db.normalizeId("games", args.gameId);

    if (gameId === null) {
      throw new Error("Game not found");
    }

    const game = await ctx.db.get(gameId);

    if (game === null) {
      throw new Error("Game not found");
    }

    return game;
  },
});

// Create a new task with the given text
export const createGame = mutation({
  args: {
    roomName: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.insert("games", {
      roomName: args.roomName,
      grid: generateGrid(4),
      status: GameStatus.NotStarted,
      players: [],
      currentPlayerId: "",
      moves: [[]],
      winnerId: "",
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
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await getGameById(ctx, { gameId: args.gameId });

    const players = game.players;

    const newPlayer = {
      id: createId(),
      name: args.name,
      points: 0,
    };

    players.push(newPlayer);

    await ctx.db.patch(game._id, { players });

    return newPlayer;
  },
});

export const getGame = query({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    return await getGameById(ctx, { gameId: args.gameId });
  },
});

export const startGame = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await getGameById(ctx, { gameId: args.gameId });

    const players = game.players;

    if (players.length < 1) {
      throw new Error("Not enough players");
    }

    const currentPlayerId = players[0].id;

    await ctx.db.patch(game._id, {
      status: GameStatus.InProgress,
      currentPlayerId,
    });

    return game;
  },
});

export const makeFirstMove = mutation({
  args: {
    gameId: v.string(),
    row: v.number(),
    col: v.number(),
  },
  handler: async (ctx, args) => {
    const game = await getGameById(ctx, { gameId: args.gameId });

    const grid = game.grid;

    const position = grid[args.row][args.col];

    if (position.status !== "hidden") {
      throw new Error("Invalid play");
    }

    position.status = "revealed";

    grid[args.row][args.col] = position;

    await ctx.db.patch(game._id, { grid });

    return game;
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
