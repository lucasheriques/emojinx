import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function useGames() {
  return useQuery(api.games.getGames);
}
