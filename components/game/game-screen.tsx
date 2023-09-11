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
import { useMutation } from "convex/react";
import useMakeMove from "./hooks/useMakeMove";

type MoveArgs = {
  row: number;
  col: number;
};

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

  const handleFirstMove = async ({
    row,
    col,
  }: {
    row: number;
    col: number;
  }) => {
    await makeFirstMove({ row, col });
  };

  const handleMove = async ({ row, col }: MoveArgs) => {
    if (game.moves.at(-1)?.length === 0) {
      return await handleFirstMove({ row, col });
    }

    return await makeSecondMove({ row, col });
  };

  const canStartGame =
    game.players.length >= 1 && game.status === GameStatus.NotStarted;

  return (
    <div className="flex flex-1 flex-col items-center gap-8">
      <Link href="/">
        <Button variant="link">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to main page
        </Button>
      </Link>
      {game.status !== GameStatus.InProgress && (
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
      {game?.grid.map((row, i) => (
        <div className="flex gap-8" key={i}>
          {row.map((cell, j) => (
            <Button
              variant="outline"
              key={j}
              size="lg"
              className="py-4 px-1 lg:py-8 lg:px-4 lg:text-xl"
              disabled={game.status !== GameStatus.InProgress}
              onClick={() => {}}
            >
              {cell.status === "hidden" ? "❔" : cell.value}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}
