import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { GameStatus } from "./types";
import { createId } from "@paralleldrive/cuid2";
import { generateEmojiArray, shuffleArray } from "./helper";

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
      emojiList: generateEmojiArray(8),
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
      errors: 0,
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

    const players = shuffleArray(game.players);

    if (players.length < 1) {
      throw new Error("Not enough players");
    }

    await ctx.db.patch(game._id, {
      status: GameStatus.InProgress,
      players,
    });

    return game;
  },
});

export const makeFirstMove = mutation({
  args: {
    gameId: v.string(),
    index: v.number(),
  },
  handler: async (ctx, args) => {
    const { _id, moves, emojiList } = await getGameById(ctx, {
      gameId: args.gameId,
    });

    const position = emojiList[args.index];

    if (position.status !== "hidden") {
      throw new Error("Invalid play");
    }

    position.status = "revealed";

    emojiList[args.index] = position;
    moves.at(-1)?.push({ index: args.index });

    return await ctx.db.patch(_id, { emojiList, moves });
  },
});

export const makeSecondMove = mutation({
  args: {
    gameId: v.string(),
    index: v.number(),
  },
  handler: async (ctx, args) => {
    const { _id, emojiList, moves } = await getGameById(ctx, {
      gameId: args.gameId,
    });

    const position = emojiList[args.index];

    if (position.status !== "hidden") {
      throw new Error("Invalid play");
    }

    position.status = "revealed";

    emojiList[args.index] = position;
    moves.at(-1)?.push({ index: args.index });
    moves.push([]);

    return await ctx.db.patch(_id, { emojiList, moves });
  },
});

export const validateCurrentMove = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const { _id, emojiList, players, currentPlayerIndex } = await getGameById(
      ctx,
      { gameId: args.gameId }
    );

    const revealedEmojis = emojiList.filter(
      (emoji: any) => emoji.status === "revealed"
    );

    if (revealedEmojis.length !== 2) {
      throw new Error("Invalid play");
    }

    const firstEmoji = revealedEmojis[0];
    const firstEmojiIndex = emojiList.indexOf(firstEmoji);
    const secondEmoji = revealedEmojis[1];
    const secondEmojiIndex = emojiList.indexOf(secondEmoji);

    let nextPlayerIndex = currentPlayerIndex + 1;

    if (firstEmoji.value === secondEmoji.value) {
      firstEmoji.status = "matched";
      secondEmoji.status = "matched";
      players[currentPlayerIndex].points += 1;
    } else {
      firstEmoji.status = "hidden";
      secondEmoji.status = "hidden";
      players[currentPlayerIndex].errors += 1;
    }

    emojiList[firstEmojiIndex] = firstEmoji;
    emojiList[secondEmojiIndex] = secondEmoji;

    const isGameFinished = emojiList.every(
      (emoji: any) => emoji.status === "matched"
    );

    return await ctx.db.patch(_id, {
      emojiList,
      players,
      currentPlayerIndex:
        nextPlayerIndex >= players.length ? 0 : nextPlayerIndex,
      status: isGameFinished ? GameStatus.Finished : GameStatus.InProgress,
    });
  },
});
