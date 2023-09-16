import useGame from "@/components/game/hooks/use-game";
import useMakeMove from "@/components/game/hooks/use-make-move";
import useStartGame from "@/components/game/hooks/use-start-game";
import JoinGameDialog from "@/components/game/join-game-dialog";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/convex/types";
import Link from "next/link";

export default function GameActions() {
  const game = useGame();
  const startGame = useStartGame();
  const { forceValidateMove } = useMakeMove();

  if (!game) {
    return null;
  }

  const handleStartGame = async () => {
    await startGame({ gameId: game?._id });
  };

  const canStartGame = game.players.length >= 1;

  return (
    <div className="flex gap-4">
      {game.status === GameStatus.NotStarted && (
        <>
          <JoinGameDialog />
          <Button
            disabled={!canStartGame}
            onClick={handleStartGame}
            variant="destructive"
          >
            Start game
          </Button>
        </>
      )}

      {game.status === GameStatus.InProgress &&
        game.emojiList.filter((emoji) => emoji.status === "revealed").length >=
          2 && (
          <Button onClick={forceValidateMove} variant="secondary">
            Force validate move
          </Button>
        )}

      {game.status === GameStatus.Finished && (
        <>
          {/* <Button>Play again</Button> */}
          <Link href="/">
            <Button variant="secondary">Leave game</Button>
          </Link>
        </>
      )}
    </div>
  );
}
