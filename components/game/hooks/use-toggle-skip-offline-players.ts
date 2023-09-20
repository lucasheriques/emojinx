import useCurrentGameId from "@/components/game/hooks/use-current-game-id";
import useGame from "@/components/game/hooks/use-game";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export default function useToggleSkipOfflinePlayers() {
  const gameId = useCurrentGameId();
  const toggle = useMutation(api.games.helpers.toggleSkipOfflinePlayers);
  const game = useGame();

  if (game.loading) {
    return [false, () => {}] as const;
  }

  function handleToggle() {
    toggle({ gameId });
  }

  return [game.skipOfflinePlayers, handleToggle] as const;
}
