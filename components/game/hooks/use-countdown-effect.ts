import { useEffect } from "react";
import useGame from "./use-game";
import useMakeMove from "./use-make-move";
import { GameStatus } from "@/convex/types";
import usePlayerId from "./use-player-id";

export default function useCountdownEffect() {
  const game = useGame();
  const playerId = usePlayerId();
  const { handleForceNextTurn, handleCountDown } = useMakeMove();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!game) {
      return;
    }

    const startCountDown = () => {
      interval = setInterval(() => {
        handleCountDown();
      }, 1000);
    };

    const forceNextTurn = async () => {
      await handleForceNextTurn();
    };

    if (
      game.status === GameStatus.InProgress &&
      game.currentPlayer?.id === playerId &&
      game.players.length > 1
    ) {
      startCountDown();
    }

    if (game.currentMultiplayerTimer === 0) {
      forceNextTurn();
    }

    return () => clearInterval(interval);
  }, [game, game?.status, handleCountDown, handleForceNextTurn, playerId]);
}
