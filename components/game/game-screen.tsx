"use client";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/types";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import JoinGameDialog from "./join-game-dialog";
import useGame from "./hooks/useGame";
import useStartGame from "./hooks/useStartGame";
import { useAtomValue } from "jotai";
import { gameIdAtom } from "@/atoms/gameId";
import useMakeMove, { MoveArgs } from "./hooks/useMakeMove";

export default function GameScreen() {
  const game = useGame();
  const startGame = useStartGame();
  const { makeFirstMove, makeSecondMove } = useMakeMove();
  const gameId = useAtomValue(gameIdAtom);

  if (!game) {
    return null;
  }

  const handleStartGame = async () => {
    await startGame({ gameId });
  };

  const handleMove = async (args: MoveArgs) => {
    if (game.moves.at(-1)?.length === 0) {
      return await makeFirstMove(args);
    }

    return await makeSecondMove(args);
  };

  const canStartGame =
    game.players.length >= 1 && game.status === GameStatus.NotStarted;

  const playerWithMostPoints = game.players.sort(
    (a, b) => b.points - a.points
  )[0];

  return (
    <div className="flex flex-1 flex-col items-center gap-8">
      <Link href="/">
        <Button variant="link">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to main page
        </Button>
      </Link>
      {game.status === GameStatus.NotStarted && (
        <>
          <JoinGameDialog />
          <div>
            Current players:{" "}
            {game.players.length === 0
              ? "none"
              : game?.players.map((player) => player.name).join(", ")}
          </div>

          <Button
            disabled={!canStartGame}
            onClick={handleStartGame}
            variant="destructive"
          >
            Start Game
          </Button>
        </>
      )}

      <div>
        Status: {game.status}{" "}
        {game.status === GameStatus.Finished &&
          `Winner: ${playerWithMostPoints.name}`}
      </div>

      <ul className="grid grid-cols-4 gap-8 flex-wrap items-center justify-center">
        {game?.emojiList?.map((emoji, index) => {
          const disabled =
            game.status !== GameStatus.InProgress || emoji.status !== "hidden";
          return (
            <li key={index}>
              <Button
                variant="outline"
                className="text-4xl py-12"
                disabled={disabled}
                onClick={() => {
                  handleMove({ index });
                }}
              >
                {emoji.status === "hidden" ? "❔" : emoji.value}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
