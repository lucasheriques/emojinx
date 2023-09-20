/**
 * Functions related to reading & writing presence data.
 *
 * Note: this file does not currently implement authorization.
 * That is left as an exercise to the reader. Some suggestions for a production
 * app:
 * - Use Convex `auth` to authenticate users rather than passing up a "user"
 * - Check that the user is allowed to be in a given room.
 */
import { v } from "convex/values";
import {
  query,
  mutation,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { GameStatus } from "./types";

const LIST_LIMIT = 20;

/**
 * Overwrites the presence data for a given user in a room.
 *
 * It will also set the "updated" timestamp to now, and create the presence
 * document if it doesn't exist yet.
 *
 * @param room - The location associated with the presence data. Examples:
 * page, chat channel, game instance.
 * @param user - The user associated with the presence data.
 */
export const update = mutation({
  args: {
    gameId: v.string(),
    playerId: v.string(),
    reactions: v.array(v.string()),
  },
  handler: async (ctx, { gameId, playerId, reactions }) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user_game", (q) =>
        q.eq("playerId", playerId).eq("gameId", gameId)
      )
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        reactions,
        updated: Date.now(),
      });
    } else {
      await ctx.db.insert("presence", {
        playerId,
        reactions,
        gameId,
        updated: Date.now(),
      });
    }
  },
});

/**
 * Updates the "updated" timestamp for a given user's presence in a room.
 *
 * @param room - The location associated with the presence data. Examples:
 * page, chat channel, game instance.
 * @param user - The user associated with the presence data.
 */
export const heartbeat = mutation({
  args: { gameId: v.string(), playerId: v.string() },
  handler: async (ctx, { gameId, playerId }) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user_game", (q) =>
        q.eq("playerId", playerId).eq("gameId", gameId)
      )
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { updated: Date.now() });
    }
  },
});

/**
 * Lists the presence data for N users in a room, ordered by recent update.
 *
 * @param room - The location associated with the presence data. Examples:
 * page, chat channel, game instance.
 * @returns A list of presence objects, ordered by recent update, limited to
 * the most recent N.
 */
export const list = query({
  args: { gameId: v.string() },
  handler: async (ctx, { gameId }) => {
    const presence = await ctx.db
      .query("presence")
      .withIndex("by_game_updated", (q) => q.eq("gameId", gameId))
      .order("desc")
      .take(LIST_LIMIT);
    return presence.map(({ _creationTime, updated, playerId, reactions }) => ({
      created: _creationTime,
      updated,
      playerId,
      reactions,
    }));
  },
});

export const destructOldestReacion = internalMutation({
  args: { gameId: v.string(), playerId: v.string() },
  handler: async (ctx, { gameId, playerId }) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user_game", (q) =>
        q.eq("playerId", playerId).eq("gameId", gameId)
      )
      .unique();
    if (existing) {
      const { reactions } = existing;
      reactions.shift();
      await ctx.db.patch(existing._id, { reactions, updated: Date.now() });
    }
  },
});

export const removeStaleGame = internalMutation({
  handler: async (ctx) => {
    const gamesInProgress = await ctx.db
      .query("games")
      .filter((q) => q.eq(q.field("status"), GameStatus.InProgress))
      .collect();

    const gamesWithOnlyOfflinePlayers = gamesInProgress.filter(async (game) => {
      const presences = await list(ctx, { gameId: game._id });

      return (
        presences.filter((presence) => Date.now() - presence.updated < 10000)
          .length === 0
      );
    });

    const moveGamesToFinished = gamesWithOnlyOfflinePlayers.map((game) => {
      return ctx.db.patch(game._id, { status: GameStatus.Finished });
    });

    await Promise.all(moveGamesToFinished);
  },
});

export const isPlayerOffline = internalQuery({
  args: { gameId: v.string(), playerId: v.string() },
  handler: async (ctx, { gameId, playerId }) => {
    const presences = await list(ctx, { gameId });
    const presence = presences.find((p) => p.playerId === playerId);

    return presence ? Date.now() - presence.updated > 10000 : true;
  },
});
