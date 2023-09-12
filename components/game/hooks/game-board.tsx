"use client";

import useGame from "@/components/game/hooks/useGame";
import useMakeMove, { MoveArgs } from "@/components/game/hooks/useMakeMove";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/types";

export default function GameBoard() {
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
    <ul className="grid grid-cols-4 gap-8 flex-wrap items-center justify-center">
      {game?.emojiList?.map((emoji, index) => {
        const disabled =
          game.status !== GameStatus.InProgress || emoji.status !== "hidden";
        return (
          <li key={index}>
            <Button
              variant="outline"
              className="md:text-4xl text-3xl py-12 px-3 md:px-4 disabled:opacity-100"
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
  );
}
