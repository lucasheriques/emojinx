import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export default function useStartGame() {
  const startGame = useMutation(api.games.startGame);
  const restartGame = useMutation(api.games.restartGame);

  return {
    startGame,
    restartGame,
  };
}
