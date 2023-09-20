import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
} from "../_generated/server";
import { getGameById } from "./get";

export const validateGameId = internalQuery({
  args: { gameId: v.string() },
  handler: (ctx, args) => {
    const gameId = ctx.db.normalizeId("games", args.gameId);

    if (gameId === null) {
      throw new Error("Game not found");
    }

    return gameId;
  },
});

export const forceNextTurn = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const { _id, players, currentPlayerIndex, multiplayerTimer } =
      await getGameById(ctx, {
        gameId: args.gameId,
      });

    const nextPlayerIndex = currentPlayerIndex + 1;

    await ctx.db.patch(_id, {
      currentPlayerIndex:
        nextPlayerIndex >= players.length ? 0 : nextPlayerIndex,
      currentMultiplayerTimer: multiplayerTimer,
    });
  },
});

export const tryRestoreGameState = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const { _id, emojiList, multiplayerTimer } = await getGameById(ctx, {
      gameId: args.gameId,
    });

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

export const toggleSkipOfflinePlayers = mutation({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const { _id, skipOfflinePlayers } = await getGameById(ctx, {
      gameId: args.gameId,
    });

    return await ctx.db.patch(_id, {
      skipOfflinePlayers: !skipOfflinePlayers,
    });
  },
});
