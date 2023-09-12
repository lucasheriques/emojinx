"use client";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/types";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import useGame from "./hooks/useGame";
import useMakeMove, { MoveArgs } from "./hooks/useMakeMove";
import GameNotStarted from "@/components/game/game-not-started";

export default function GameScreen() {
  const game = useGame();
  const { makeFirstMove, makeSecondMove } = useMakeMove();

  if (!game) {
    return null;
  }

  const handleMove = async (args: MoveArgs) => {
    if (game.moves.at(-1)?.length === 0) {
      return await makeFirstMove(args);
    }

    return await makeSecondMove(args);
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-8">
      <Link href="/">
        <Button variant="link">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to main page
        </Button>
      </Link>
      {game.status === GameStatus.NotStarted && <GameNotStarted />}

      <div>
        Status: {game.status}{" "}
        {game.status === GameStatus.Finished &&
          `Winner: ${game.players?.[0].name}`}
      </div>

      <div>Current player: {game.players[game.currentPlayerIndex]?.name}</div>

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
