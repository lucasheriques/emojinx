import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { GameStatus } from "../types";

import { generateEmojiArray, shuffleArray } from "../helpers/emojis";
import { getPlayersWithMostPoints } from "../helpers/players";
import { getGameById } from "./get";
import { validateGameId } from "./helpers";

// Create a new task with the given text
export const createGame = mutation({
  args: {
    roomName: v.string(),
    emojisAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.insert("games", {
      roomName: args.roomName,
      emojiList: generateEmojiArray(args.emojisAmount ?? 8),
      status: GameStatus.NotStarted,
      players: [],
      currentPlayerIndex: 0,
      currentMultiplayerTimer: 15,
      multiplayerTimer: 15,
      winnerIds: [],
    });
    return game;
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

export const restartGame = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await getGameById(ctx, { gameId: args.gameId });

    const players = shuffleArray(game.players).map((player) => ({
      ...player,
      points: 0,
    }));
    const emojiList = generateEmojiArray(game.emojiList.length / 2);

    await ctx.db.patch(game._id, {
      status: GameStatus.NotStarted,
      players,
      emojiList,
      currentPlayerIndex: 0,
      currentMultiplayerTimer: game.multiplayerTimer,
      winnerIds: [],
    });
  },
});

export const makeFirstMove = mutation({
  args: {
    gameId: v.string(),
    index: v.number(),
  },
  handler: async (ctx, args) => {
    const { _id, emojiList } = await getGameById(ctx, {
      gameId: args.gameId,
    });

    const position = emojiList[args.index];

    if (position.status !== "hidden") {
      throw new Error("Invalid play");
    }

    position.status = "revealed";

    emojiList[args.index] = position;

    return await ctx.db.patch(_id, { emojiList });
  },
});

export const makeSecondMove = mutation({
  args: {
    gameId: v.string(),
    index: v.number(),
  },
  handler: async (ctx, args) => {
    const { _id, emojiList } = await getGameById(ctx, {
      gameId: args.gameId,
    });

    const position = emojiList[args.index];

    if (position.status !== "hidden") {
      throw new Error("Invalid play");
    }

    position.status = "revealed";

    emojiList[args.index] = position;

    return await ctx.db.patch(_id, { emojiList });
  },
});

export const validateCurrentMove = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const { _id, emojiList, players, currentPlayerIndex, multiplayerTimer } =
      await getGameById(ctx, { gameId: args.gameId });

    const revealedEmojis = emojiList.filter(
      (emoji) => emoji.status === "revealed"
    );

    if (revealedEmojis.length !== 2) {
      throw new Error("Invalid play");
    }

    const firstEmoji = revealedEmojis[0];
    const firstEmojiIndex = emojiList.indexOf(firstEmoji);
    const secondEmoji = revealedEmojis[1];
    const secondEmojiIndex = emojiList.indexOf(secondEmoji);

    let nextPlayerIndex = currentPlayerIndex;

    if (firstEmoji.value === secondEmoji.value) {
      firstEmoji.status = "matched";
      secondEmoji.status = "matched";
      players[currentPlayerIndex].points += 1;
    } else {
      firstEmoji.status = "hidden";
      secondEmoji.status = "hidden";
      nextPlayerIndex = currentPlayerIndex + 1;
    }

    emojiList[firstEmojiIndex] = firstEmoji;
    emojiList[secondEmojiIndex] = secondEmoji;

    const isGameFinished = emojiList.every(
      (emoji) => emoji.status === "matched"
    );

    const winnerIds = getPlayersWithMostPoints(players).map(
      (player) => player.id
    );

    if (isGameFinished) {
      await ctx.db.patch(_id, {
        emojiList,
        players,
        status: GameStatus.Finishing,
        winnerIds,
        currentMultiplayerTimer: 0,
      });
    } else {
      await ctx.db.patch(_id, {
        emojiList,
        players,
        currentPlayerIndex:
          nextPlayerIndex >= players.length ? 0 : nextPlayerIndex,
        currentMultiplayerTimer: multiplayerTimer + 1,
      });
    }

    return {
      isGameFinished,
      winnerIds,
      matched: firstEmoji.status === "matched",
      firstEmojiIndex,
      secondEmojiIndex,
    };
  },
});

export const finishGame = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const gameId = ctx.db.normalizeId("games", args.gameId);

    if (gameId === null) {
      throw new Error("Game not found");
    }

    return await ctx.db.patch(gameId, {
      status: GameStatus.Finished,
    });
  },
});
