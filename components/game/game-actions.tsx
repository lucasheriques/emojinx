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
import usePlayerId from "./hooks/use-player-id";
import { Skeleton } from "@/components/ui/skeleton";
import useOnlinePresence from "./hooks/use-online-presence";
import { TrashIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardTitle } from "../ui/card";

export default function GameActions() {
  const game = useGame();
  const { startGame, restartGame } = useStartGame();
  const [copied, setCopied] = useState(false);
  const playerId = usePlayerId();
  const [playedSound, setPlayedSound] = useAtom(playedFinishingSoundAtom);
  const [_, presences, updateMyPresence, clearReactions] = useOnlinePresence();

  useEffect(() => {
    if (game?.status === GameStatus.NotStarted && playedSound) {
      setPlayedSound(false);
    }
  }, [game?.status, playedSound, setPlayedSound]);

  if (!game) {
    return null;
  }

  const handleEmojiReaction = (emoji: string) => {
    updateMyPresence(emoji);
  };

  const handleStartGame = async () => {
    await startGame({ gameId: game?._id });
  };

  const handleRestartGame = async () => {
    await restartGame({ gameId: game?._id });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canStartGame =
    game.players.length >= 1 &&
    game.players.some((player) => player.id === playerId);

  const isMultiplayer = game.players.length > 1;

  const reactions =
    presences?.find((presence) => presence.playerId === playerId)?.reactions ??
    [];

  return (
    <div className="flex gap-4 w-full items-center justify-center">
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

      {game.status === GameStatus.InProgress && (
        <div className="flex flex-col flex-1 items-center justify-center">
          {isMultiplayer && (
            <>
              <Card className="flex items-center p-4">
                <span className="text-sm text-muted-foreground">Reactions</span>
                <div className="flex">
                  <Button
                    onClick={() => handleEmojiReaction("❤️")}
                    variant="ghost"
                    disabled={reactions.length >= 3}
                  >
                    ❤️
                  </Button>
                  <Button
                    onClick={() => handleEmojiReaction("🎉")}
                    variant="ghost"
                    disabled={reactions.length >= 3}
                  >
                    🎉
                  </Button>
                  <Button
                    onClick={() => handleEmojiReaction("😤")}
                    variant="ghost"
                    disabled={reactions.length >= 3}
                  >
                    😤
                  </Button>
                  <Button onClick={clearReactions} variant="ghost">
                    Clear
                  </Button>
                </div>
              </Card>

              <div className="flex gap-2 items-center justify-center">
                <Timer timer={game.currentMultiplayerTimer} />
                <MakeYourMoveBanner currentPlayer={game.currentPlayer} />
              </div>
            </>
          )}
        </div>
      )}

      {game.status === GameStatus.Finished && (
        <>
          {game.players.filter((player) => player.id === playerId).length >=
            1 && <Button onClick={handleRestartGame}>Play again!</Button>}
          <Link href="/">
            <Button variant="secondary">Leave game</Button>
          </Link>
        </>
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
