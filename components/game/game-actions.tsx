import useGame from "@/components/game/hooks/use-game";
import useStartGame from "@/components/game/hooks/use-start-game";
import JoinGameDialog from "@/components/game/join-game-dialog";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/convex/types";
import Link from "next/link";
import Timer from "./timer";
import MakeYourMoveBanner from "./make-your-move-banner";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { playedFinishingSoundAtom } from "@/atoms/playedFinishingSoundAtom";

export default function GameActions() {
  const game = useGame();
  const { startGame, restartGame } = useStartGame();
  const [copied, setCopied] = useState(false);
  const setPlayedSound = useSetAtom(playedFinishingSoundAtom);

  if (!game) {
    return null;
  }

  const handleStartGame = async () => {
    await startGame({ gameId: game?._id });
  };

  const handleRestartGame = async () => {
    setPlayedSound(false);
    await restartGame({ gameId: game?._id });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canStartGame = game.players.length >= 1;

  const isMultiplayer = game.players.length > 1;

  return (
    <div className="flex gap-4">
      {game.status === GameStatus.NotStarted && (
        <>
          <JoinGameDialog />
          <Button variant="secondary" onClick={handleCopyLink}>
            {copied ? "Copied!" : "Copy link"}
          </Button>
          <Button
            disabled={!canStartGame}
            onClick={handleStartGame}
            variant="destructive"
          >
            Start
          </Button>
        </>
      )}

      {game.status === GameStatus.InProgress && isMultiplayer && (
        <div className="flex items-center">
          <Timer timer={game.currentMultiplayerTimer} />
          <MakeYourMoveBanner currentPlayer={game.currentPlayer} />
        </div>
      )}

      {game.status === GameStatus.Finished && (
        <>
          <Button onClick={handleRestartGame}>Play again!</Button>
          <Link href="/">
            <Button variant="secondary">Leave game</Button>
          </Link>
        </>
      )}
    </div>
  );
}
