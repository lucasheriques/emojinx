import useGame from "@/components/game/hooks/use-game";
import useStartGame from "@/components/game/hooks/use-start-game";
import JoinGameDialog from "@/components/game/join-game-dialog";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/convex/types";
import Link from "next/link";
import Timer from "./timer";
import MakeYourMoveBanner from "./make-your-move-banner";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { playedFinishingSoundAtom } from "@/atoms/playedFinishingSoundAtom";
import { Skeleton } from "@/components/ui/skeleton";
import EmojiReactions from "@/components/emoji-reactions/emoji-reactions";
import CreateRoomDialog from "@/components/rooms/create-room-dialog";
import useIsPlayerInTheGame from "@/components/game/hooks/use-is-player-in-the-game";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function GameActions() {
  const game = useGame();
  const { startGame, restartGame } = useStartGame();
  const [copied, setCopied] = useState(false);
  const [playedSound, setPlayedSound] = useAtom(playedFinishingSoundAtom);
  const isPlayerInTheGame = useIsPlayerInTheGame();

  useEffect(() => {
    if (game.loading) {
      return;
    }

    if (game?.status === GameStatus.NotStarted && playedSound) {
      setPlayedSound(false);
    }
  }, [game.loading, game, playedSound, setPlayedSound]);

  if (game.loading) {
    return null;
  }

  const handleStartGame = async () => {
    await startGame();
  };

  const handleRestartGame = async () => {
    await restartGame();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isMultiplayer = game.players?.length > 1;

  return (
    <div className="flex gap-4 w-full items-center justify-center">
      {game.status === GameStatus.NotStarted && (
        <>
          <JoinGameDialog />
          <Button variant="secondary" onClick={handleCopyLink}>
            {copied ? "Copied!" : "Copy link"}
          </Button>
          <TooltipProvider
            disableHoverableContent={!isPlayerInTheGame}
            delayDuration={300}
          >
            <Tooltip>
              <TooltipTrigger>
                <Button
                  disabled={!isPlayerInTheGame}
                  onClick={handleStartGame}
                  variant="destructive"
                >
                  Start
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  You can start the game after you join the room.
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}

      {game.status === GameStatus.InProgress && (
        <div className="flex flex-col flex-1 items-center justify-center">
          {!isPlayerInTheGame && (
            <CreateRoomDialog
              buttonText="Wanna play? Create your room!"
              redirectToRoom
            />
          )}
          {isMultiplayer && (
            <>
              <EmojiReactions />

              <div className="flex gap-2 items-center justify-center">
                <Timer timer={game.currentMultiplayerTimer ?? 1} />
                <MakeYourMoveBanner
                  currentPlayer={game.currentPlayer}
                  skippingPlayer={game.skippedLastPlayer}
                />
              </div>
            </>
          )}
        </div>
      )}

      {game.status === GameStatus.Finished && (
        <div className="flex flex-col flex-1 items-center justify-center gap-4">
          <EmojiReactions />
          <div className="flex gap-2 items-center justify-center">
            {isPlayerInTheGame && (
              <Button onClick={handleRestartGame}>Play again!</Button>
            )}
            <CreateRoomDialog buttonText="New room" redirectToRoom />
            <Link href="/">
              <Button variant="outline">Room list</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function GameActionsSkeleton() {
  return (
    <div className="flex gap-4">
      <Skeleton className="w-24 h-9" />
      <Skeleton className="w-24 h-9" />
    </div>
  );
}
