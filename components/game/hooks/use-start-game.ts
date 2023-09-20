import useCurrentGameId from "@/components/game/hooks/use-current-game-id";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export default function useStartGame() {
  const startGame = useMutation(api.games.gameplay.startGame);
  const restartGame = useMutation(api.games.gameplay.restartGame);
  const gameId = useCurrentGameId();

  const handleStartGame = async () => {
    await startGame({ gameId });
  };

  const handleRestartGame = async () => {
    await restartGame({ gameId });
  };

  return {
    startGame: handleStartGame,
    restartGame: handleRestartGame,
  };
}
