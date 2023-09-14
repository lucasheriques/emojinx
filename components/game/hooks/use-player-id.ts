import { gamePlayerMapAtom } from "@/atoms/player/gamePlayerMap";
import useCurrentGameId from "@/components/game/hooks/use-current-game-id";
import { useAtomValue } from "jotai";

export default function usePlayerId() {
  const gameId = useCurrentGameId();
  const gamePlayerMap = useAtomValue(gamePlayerMapAtom);

  return gamePlayerMap[gameId];
}
