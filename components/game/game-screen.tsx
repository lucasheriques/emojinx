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
          {row.map((cell, j) => {
            const disabled =
              game.status !== GameStatus.InProgress || cell.status !== "hidden";
            return (
              <Button
                variant="outline"
                key={j}
                size="lg"
                className="text-4xl"
                disabled={disabled}
                onClick={() => {
                  handleMove({ row: i, col: j });
                }}
              >
                {cell.status === "hidden" ? "❔" : cell.value}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
