import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    currentPlayerIndex: v.float64(),
    grid: v.array(
      v.array(
        v.object({
          col: v.float64(),
          row: v.float64(),
          status: v.string(),
          value: v.string(),
        })
      )
    ),
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
