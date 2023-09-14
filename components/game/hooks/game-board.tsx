"use client";

import { playerIdAtom } from "@/atoms/player/playerId";
import useGame from "@/components/game/hooks/use-game";
import useMakeMove, { MoveArgs } from "@/components/game/hooks/use-make-move";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/types";
import { useConvex } from "convex/react";
import { useAtomValue } from "jotai";

const gridSizes: {
  [key: number]: string;
} = {
  16: "grid-cols-4",
  36: "grid-cols-4 sm:grid-cols-6",
  64: "grid-cols-4 sm:grid-cols-8",
  100: "grid-cols-5 sm:grid-cols-10",
};

export default function GameBoard() {
  const game = useGame();
  const convex = useConvex();

  const { makeFirstMove, makeSecondMove } = useMakeMove();
  const storagePlayerId = useAtomValue(playerIdAtom);

  if (!game) {
    return null;
  }

  const handleMove = async (args: MoveArgs) => {
    if (game.moves.at(-1)?.length === 0) {
      return await makeFirstMove(args);
    }

    const result = await makeSecondMove(args);

    console.log({ result });
  };

  const isCurrentPlayer =
    game.players?.[game.currentPlayerIndex]?.id === storagePlayerId;

  const flippedStatus = ["revealed", "matched"];

  const hasInternetConnection = convex.connectionState().isWebSocketConnected;

  const isBoardInteractive =
    game.emojiList.filter((emoji) => emoji.status === "revealed").length < 2 &&
    hasInternetConnection;

  return (
    <div>
      {!hasInternetConnection && (
        <div className="bg-pink-700 py-2 px-4 text-sm font-mono tracking-wider animate-pulse duration-1000 repeat-1 my-4">
          Please check your internet connection.
        </div>
      )}
      <ul
        className={`grid ${
          gridSizes[game.emojiList.length]
        } gap-x-2 sm:gap-x-4 gap-y-4 pb-8`}
      >
        {game?.emojiList?.map((emoji, index) => {
          const disabled =
            game.status !== GameStatus.InProgress ||
            emoji.status !== "hidden" ||
            !isBoardInteractive;
          return (
            <li
              key={index}
              className={`flex justify-center card ${
                flippedStatus.includes(emoji.status) ? "is-flipped" : "is-down"
              }`}
            >
              <Button
                variant="outline"
                className="md:text-4xl text-3xl py-6 px-3 md:px-4 disabled:opacity-100"
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
      {isCurrentPlayer &&
        game.status !== GameStatus.Finished &&
        hasInternetConnection &&
        game.players.length > 1 && (
          <div className="bg-pink-700 py-2 px-4 text-sm font-mono tracking-wider animate-pulse duration-1000 repeat-1">
            Make your move!
          </div>
        )}
    </div>
  );
}
