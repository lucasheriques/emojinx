import { useEffect } from "react";
import useGame from "./use-game";
import useMakeMove from "./use-make-move";
import { GameStatus } from "@/convex/types";
import usePlayerId from "./use-player-id";
import useOnlinePresence from "./use-online-presence";
import { isOnline } from "@/hooks/use-presence";

export default function useCountdownEffect() {
  const game = useGame();
  const playerId = usePlayerId();
  const { handleForceNextTurn, handleCountDown } = useMakeMove();
  const [_, presences] = useOnlinePresence();

  const onlinePlayers = presences?.filter(isOnline);

  useEffect(() => {
    const isCurrentPlayerOnline = !!onlinePlayers?.find(
      (player) => player.playerId === game?.currentPlayer.id
    );

    const forceNextTurn = async () => {
      await handleForceNextTurn();
    };

    if (!isCurrentPlayerOnline) {
      forceNextTurn();
      return;
    }

    if (
      !game ||
      game.currentPlayer?.id !== playerId ||
      game.status !== GameStatus.InProgress ||
      game.players.length <= 1
    ) {
      return;
    }

    let interval: NodeJS.Timeout;

    const startCountDown = () => {
      interval = setInterval(() => {
        handleCountDown();
      }, 1000);
    };

    startCountDown();

    if (game.currentMultiplayerTimer === 0) {
      forceNextTurn();
    }

    return () => clearInterval(interval);
  }, [
    game,
    game?.status,
    handleCountDown,
    handleForceNextTurn,
    onlinePlayers,
    playerId,
  ]);
}
