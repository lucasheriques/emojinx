import { gamePlayerMapAtom } from "@/atoms/player/gamePlayerMap";
import useCurrentGameId from "@/components/game/hooks/use-current-game-id";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useAtom } from "jotai";

export default function useLeaveGame() {
  const gameId = useCurrentGameId();
  const leaveGame = useMutation(api.games.players.leaveGame);
  const [gamePlayerMap, setGamePlayerMap] = useAtom(gamePlayerMapAtom);

  return function () {
    leaveGame({ gameId, playerId: gamePlayerMap[gameId] });
    delete gamePlayerMap[gameId];
    setGamePlayerMap(gamePlayerMap);
  };
}
