import { useEffect } from "react";
import useGame from "./use-game";
import { GameStatus } from "@/convex/types";
import usePlayerId from "./use-player-id";
import useOnlinePresence from "./use-online-presence";
import { isOnline } from "@/hooks/use-presence";
import { useAtomValue } from "jotai";
import { skipOfflinePlayersAtom } from "@/atoms/skipOfflinePlayers";
import useIsPlayerInTheGame from "@/components/game/hooks/use-is-player-in-the-game";

export default function useCountdownEffect() {
  const game = useGame();
  const playerId = usePlayerId();
  const [_, presences] = useOnlinePresence();
  const skipOffinePlayers = useAtomValue(skipOfflinePlayersAtom);
  const isPlayerInTheGame = useIsPlayerInTheGame();

  const onlinePlayers = presences?.filter(isOnline);

  useEffect(() => {
    if (
      game.loading ||
      game.status !== GameStatus.InProgress ||
      !isPlayerInTheGame ||
      game.currentPlayer?.id !== playerId ||
      game.players.length <= 1
    ) {
      return;
    }

    let interval: NodeJS.Timeout;

    const startCountDown = () => {
      interval = setInterval(() => {}, 1000);
    };

    startCountDown();

    return () => clearInterval(interval);
  }, [game, isPlayerInTheGame, onlinePlayers, playerId, skipOffinePlayers]);
}
