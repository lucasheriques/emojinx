import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    currentPlayerIndex: v.float64(),
    emojiList: v.array(v.object({ status: v.string(), value: v.string() })),
    moves: v.array(v.array(v.object({ index: v.float64() }))),
    players: v.array(
      v.object({
        errors: v.float64(),
        id: v.string(),
        name: v.string(),
        points: v.float64(),
      })
    ),
    roomName: v.string(),
    status: v.string(),
    winnerId: v.string(),
  }),
});
