import { gameIdAtom } from "@/atoms/gameId";
import { useAtomValue } from "jotai";
import usePlayerId from "./use-player-id";
import usePresence from "@/hooks/use-presence";

export default function useOnlinePresence() {
  const gameId = useAtomValue(gameIdAtom);
  const playerId = usePlayerId();

  return usePresence(gameId, playerId, []);
}
