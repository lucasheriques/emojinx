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
    if (
      !game ||
      game.currentPlayer?.id !== playerId ||
      game.status !== GameStatus.InProgress ||
      game.players.length <= 1
    ) {
      return;
    }

    console.log("runnig eff");

    let interval: NodeJS.Timeout;

    const startCountDown = () => {
      interval = setInterval(() => {
        handleCountDown();
      }, 1000);
    };

    const forceNextTurn = async () => {
      await handleForceNextTurn();
    };

    startCountDown();

    if (game.currentMultiplayerTimer === 0) {
      forceNextTurn();
    }

    return () => clearInterval(interval);
  }, [game, game?.status, handleCountDown, handleForceNextTurn, playerId]);
}
