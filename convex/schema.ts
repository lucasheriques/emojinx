import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    grid: v.array(v.array(v.string())),
  }),
});
