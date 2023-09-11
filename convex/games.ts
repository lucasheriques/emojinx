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
      currentPlayerIndex: 0,
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

    await ctx.db.patch(game._id, {
      status: GameStatus.InProgress,
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

    const moves = game.moves;

    const position = grid[args.row][args.col];

    if (position.status !== "hidden") {
      throw new Error("Invalid play");
    }

    position.status = "revealed";

    grid[args.row][args.col] = position;
    moves.at(-1)?.push({ row: args.row, col: args.col });

    await ctx.db.patch(game._id, { grid, moves });

    return game;
  },
});

export const makeSecondMove = mutation({
  args: {
    gameId: v.string(),
    row: v.number(),
    col: v.number(),
  },
  handler: async (ctx, args) => {
    const { _id, grid, moves } = await getGameById(ctx, {
      gameId: args.gameId,
    });

    const position = grid[args.row][args.col];

    if (position.status !== "hidden") {
      throw new Error("Invalid play");
    }

    position.status = "revealed";

    grid[args.row][args.col] = position;
    moves.at(-1)?.push({ row: args.row, col: args.col });
    moves.push([]);

    return await ctx.db.patch(_id, { grid, moves });
  },
});

export const validateCurrentMove = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await getGameById(ctx, { gameId: args.gameId });
    const grid = game.grid;

    const positions = grid.flat();

    const revealedPositions = positions.filter(
      (position: any) => position.status === "revealed"
    );

    if (revealedPositions.length !== 2) {
      throw new Error("Invalid play");
    }

    const firstPosition = revealedPositions[0];
    const secondPosition = revealedPositions[1];

    let newPlayers = game.players;

    let nextPlayerIndex = game.currentPlayerIndex + 1;

    if (firstPosition.value === secondPosition.value) {
      firstPosition.status = "matched";
      secondPosition.status = "matched";

      newPlayers[game.currentPlayerIndex].points += 1;
    } else {
      firstPosition.status = "hidden";
      secondPosition.status = "hidden";
    }

    grid[firstPosition.row][firstPosition.col] = firstPosition;
    grid[secondPosition.row][secondPosition.col] = secondPosition;

    await ctx.db.patch(game._id, {
      grid,
      players: newPlayers,
      currentPlayerIndex:
        nextPlayerIndex >= newPlayers.length ? 0 : nextPlayerIndex,
    });

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
