import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    currentPlayerId: v.string(),
    grid: v.array(v.array(v.object({ status: v.string(), value: v.string() }))),
    moves: v.array(v.array(v.any())),
    players: v.array(
      v.object({
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
