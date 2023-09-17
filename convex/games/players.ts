import { mutation } from "../_generated/server";
import { createId } from "@paralleldrive/cuid2";
import { getGameById } from "./get";
import { v } from "convex/values";

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
