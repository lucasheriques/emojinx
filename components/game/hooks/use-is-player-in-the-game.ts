import useGame from "@/components/game/hooks/use-game";
import usePlayerId from "@/components/game/hooks/use-player-id";
import { useMemo } from "react";

export default function useIsPlayerInTheGame() {
  const game = useGame();
  const playerId = usePlayerId();

  return useMemo(() => {
    if (game.loading) {
      return false;
    }
    return game?.players.some((p) => p.id === playerId);
  }, [game, playerId]);
}
