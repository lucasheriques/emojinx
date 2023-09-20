import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "clean-stale-games",
  { hours: 1 },
  internal.presence.removeStaleGame
);

export default crons;
