import { v } from "convex/values";
import { internalQuery, query } from "../_generated/server";
import { validateGameId } from "./helpers";

export const getGameById = internalQuery({
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

export const getGames = query({
  handler: async (ctx) => {
    return ctx.db.query("games").collect();
  },
});

export const getGame = query({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    return await getGameById(ctx, { gameId: args.gameId });
  },
});
