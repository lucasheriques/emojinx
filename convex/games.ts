import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { GameStatus } from "./types";
import { createId } from "@paralleldrive/cuid2";
import { generateEmojiArray, shuffleArray } from "./helpers/emojis";
import { getPlayersWithMostPoints } from "./helpers/players";

const validateGameId = internalQuery({
  args: { gameId: v.string() },
  handler: (ctx, args) => {
    const gameId = ctx.db.normalizeId("games", args.gameId);

    if (gameId === null) {
      throw new Error("Game not found");
    }

    return gameId;
  },
});

const getGameById = internalQuery({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    const gameId = validateGameId(ctx, args);

    const game = await ctx.db.get(gameId);

    if (game === null) {
      throw new Error("Game not found");
    }

    const currentPlayer =
      game.players.length > 1
        ? game.players[game.currentPlayerIndex]
        : game.players[0];

    return {
      ...game,
      currentPlayer,
    };
  },
});

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

export const leaveGame = mutation({
  args: {
    gameId: v.string(),
    playerId: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await getGameById(ctx, { gameId: args.gameId });

    const players = game.players.filter(
      (player) => player.id !== args.playerId
    );

    await ctx.db.patch(game._id, { players });

    return players;
  },
});

export const getGame = query({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    return await getGameById(ctx, { gameId: args.gameId });
  },
});

export const deleteGame = mutation({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    const gameId = validateGameId(ctx, args);

    return await ctx.db.delete(gameId);
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
      errors: 0,
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

export const countDown = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const {
      _id,
      multiplayerTimer,
      currentMultiplayerTimer,
      currentPlayerIndex,
      players,
    } = await getGameById(ctx, {
      gameId: args.gameId,
    });

    if (!multiplayerTimer) {
      return;
    }

    const nextTimer = currentMultiplayerTimer - 1;

    if (nextTimer === 0) {
      const nextPlayerIndex = currentPlayerIndex + 1;
      return await ctx.db.patch(_id, {
        currentPlayerIndex:
          nextPlayerIndex >= players.length ? 0 : nextPlayerIndex,
        currentMultiplayerTimer: multiplayerTimer,
      });
    }

    await ctx.db.patch(_id, { currentMultiplayerTimer: nextTimer });
  },
});

export const forceNextTurn = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const { _id, players, currentPlayerIndex } = await getGameById(ctx, {
      gameId: args.gameId,
    });

    const nextPlayerIndex = currentPlayerIndex + 1;

    await ctx.db.patch(_id, {
      currentPlayerIndex:
        nextPlayerIndex >= players.length ? 0 : nextPlayerIndex,
    });
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

export const tryRestoreGameState = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const { _id, emojiList, currentMultiplayerTimer, multiplayerTimer } =
      await getGameById(ctx, { gameId: args.gameId });

    const fixedEmojiList = emojiList.map((emoji) => {
      if (emoji.status === "revealed") {
        emoji.status = "hidden";
      }
      return emoji;
    });

    return await ctx.db.patch(_id, {
      emojiList: fixedEmojiList,
      currentMultiplayerTimer: multiplayerTimer,
    });
  },
});
