import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { GameStatus } from "./types";

export default defineSchema({
  games: defineTable({
    currentPlayerIndex: v.number(),
    emojiList: v.array(v.object({ status: v.string(), value: v.string() })),
    currentMultiplayerTimer: v.number(),
    multiplayerTimer: v.number(),
    players: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        points: v.number(),
      })
    ),
    roomName: v.string(),
    status: v.union(
      v.literal(GameStatus.NotStarted),
      v.literal(GameStatus.InProgress),
      v.literal(GameStatus.Finishing),
      v.literal(GameStatus.Finished)
    ),
    winnerIds: v.array(v.string()),
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
  }),
});
