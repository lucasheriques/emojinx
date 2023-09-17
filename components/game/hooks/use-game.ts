import { gameIdAtom } from "@/atoms/gameId";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useAtomValue } from "jotai";

export default function useGame() {
  const gameId = useAtomValue(gameIdAtom);
  return useQuery(api.games.get.getGame, { gameId });
}
