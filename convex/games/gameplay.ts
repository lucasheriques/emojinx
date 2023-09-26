import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "../_generated/server";
import { v } from "convex/values";
import { GameStatus } from "../types";

import { generateEmojiArray, shuffleArray } from "../helpers/emojis";
import { getPlayersWithMostPoints } from "../helpers/players";
import { getGameById } from "./get";
import { validateGameId } from "./helpers";
import { internal } from "../_generated/api";
import { isPlayerOffline } from "../presence";

export let interval: NodeJS.Timeout;

// Create a new task with the given text
export const createGame = mutation({
  args: {
    roomName: v.string(),
    emojisAmount: v.number(),
    multiplayerTimer: v.number(),
    emojiCategories: v.array(
      v.union(
        v.literal("smiley"),
        v.literal("animalsAndNature"),
        v.literal("foodsAndDrinks"),
        v.literal("travelsAndPlaces"),
        v.literal("flags"),
        v.literal("objects")
      )
    ),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.insert("games", {
      roomName: args.roomName,
      emojiList: generateEmojiArray(args.emojisAmount, args.emojiCategories),
      status: GameStatus.NotStarted,
      players: [],
      currentPlayerIndex: 0,
      currentMultiplayerTimer: 0,
      multiplayerTimer: args.multiplayerTimer ?? 15,
      winnerIds: [],
      emojiCategories: args.emojiCategories,
      password: args.password,
      skipOfflinePlayers: true,
    });
    return game;
  },
});

export const getNextPlayerTurnInformation = (
  game: Awaited<ReturnType<typeof getGameById>>,
  isNextPlayerOffline: boolean
) => {
  const { multiplayerTimer, currentPlayerIndex, players, skipOfflinePlayers } =
    game;

  const nextPlayerIndex =
    currentPlayerIndex + 1 >= players.length ? 0 : currentPlayerIndex + 1;

  const shouldSkipNextPlayer = skipOfflinePlayers && isNextPlayerOffline;

  return {
    currentPlayerIndex: nextPlayerIndex,
    currentMultiplayerTimer: shouldSkipNextPlayer ? 3 : multiplayerTimer,
    skippedLastPlayer: shouldSkipNextPlayer,
  };
};

export const goToNextTurn = internalMutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const game = await getGameById(ctx, {
      gameId: args.gameId,
    });
    const { currentPlayerIndex, players, _id: gameId, emojiList } = game;

    const nextPlayerIndex =
      currentPlayerIndex + 1 >= players.length ? 0 : currentPlayerIndex + 1;

    const nextPlayer = players[nextPlayerIndex];

    const isNextPlayerOffline = await isPlayerOffline(ctx, {
      gameId,
      playerId: nextPlayer.id,
    });

    await ctx.db.patch(gameId, {
      ...getNextPlayerTurnInformation(game, isNextPlayerOffline),
      emojiList: emojiList.map((emoji) => {
        if (emoji.status === "revealed") {
          emoji.status = "hidden";
        }
        return emoji;
      }),
    });
  },
});

export const countDown = internalMutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const { _id, currentMultiplayerTimer, emojiList, status } =
      await getGameById(ctx, {
        gameId: args.gameId,
      });

    const nextTimer = currentMultiplayerTimer - 1;
    const isGameFinished =
      emojiList.every((emoji) => emoji.status === "matched") ||
      status === GameStatus.Finishing ||
      status === GameStatus.Finished;

    if (nextTimer === 0) {
      await goToNextTurn(ctx, args);
    } else {
      await ctx.db.patch(_id, { currentMultiplayerTimer: nextTimer });
    }

    if (!isGameFinished) {
      await ctx.scheduler.runAfter(
        1000,
        internal.games.gameplay.countDown,
        args
      );
    }
  },
});

export const startGame = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const { _id, multiplayerTimer, players } = await getGameById(ctx, {
      gameId: args.gameId,
    });

    if (players.length < 1) {
      throw new Error("Not enough players");
    }

    if (players.length === 1) {
      return await ctx.db.patch(_id, {
        status: GameStatus.InProgress,
      });
    }

    shuffleArray(players);

    await ctx.db.patch(_id, {
      status: GameStatus.InProgress,
      players,
      currentMultiplayerTimer: multiplayerTimer,
    });

    await ctx.scheduler.runAfter(1000, internal.games.gameplay.countDown, args);
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
    const emojiList = generateEmojiArray(
      game.emojiList.length / 2,
      game.emojiCategories
    );

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
    const game = await getGameById(ctx, { gameId: args.gameId });

    const { _id, emojiList, players, currentPlayerIndex } = game;

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
      nextPlayerIndex =
        currentPlayerIndex + 1 >= players.length ? 0 : currentPlayerIndex + 1;
    }

    emojiList[firstEmojiIndex] = firstEmoji;
    emojiList[secondEmojiIndex] = secondEmoji;

    const isGameFinished = emojiList.every(
      (emoji) => emoji.status === "matched"
    );

    const winnerIds = getPlayersWithMostPoints(players).map(
      (player) => player.id
    );

    const nextPlayer = players[nextPlayerIndex];

    const isNextPlayerOffline = await isPlayerOffline(ctx, {
      gameId: args.gameId,
      playerId: nextPlayer.id,
    });

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
        ...getNextPlayerTurnInformation(game, isNextPlayerOffline),
        currentPlayerIndex: nextPlayerIndex,
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
    const gameId = validateGameId(ctx, args);

    return await ctx.db.patch(gameId, {
      status: GameStatus.Finished,
    });
  },
});
