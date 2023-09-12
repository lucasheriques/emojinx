import useGame from "@/components/game/hooks/useGame";
import useStartGame from "@/components/game/hooks/useStartGame";
import JoinGameDialog from "@/components/game/join-game-dialog";
import { Button } from "@/components/ui/button";

export default function GameNotStarted() {
  const game = useGame();
  const startGame = useStartGame();

  if (!game) {
    return null;
  }

  const handleStartGame = async () => {
    await startGame({ gameId: game?._id });
  };

  const canStartGame = game.players.length >= 1;

  return (
    <div className="flex gap-4">
      <JoinGameDialog />
      <Button
        disabled={!canStartGame}
        onClick={handleStartGame}
        variant="destructive"
      >
        Start Game
      </Button>
    </div>
  );
}
