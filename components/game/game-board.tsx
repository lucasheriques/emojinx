"use client";

import DeleteGameButton from "@/components/delete-game-button";
import useGame from "@/components/game/hooks/use-game";
import useMakeMove, { MoveArgs } from "@/components/game/hooks/use-make-move";
import usePlayerId from "@/components/game/hooks/use-player-id";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/types";
import { useConvex } from "convex/react";
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();

  const { makeFirstMove, makeSecondMove } = useMakeMove();
  const storagePlayerId = usePlayerId();

  if (!game) {
    return null;
  }

  const handleMove = async (args: MoveArgs) => {
    if (game.moves.at(-1)?.length === 0) {
      return await makeFirstMove(args);
    }

    await makeSecondMove(args);
  };

  const isCurrentPlayer =
    game.players?.[game.currentPlayerIndex]?.id === storagePlayerId;

  const flippedStatus = ["revealed", "matched"];

  const hasInternetConnection = convex.connectionState().isWebSocketConnected;

  const isBoardInteractive =
    game.emojiList.filter((emoji) => emoji.status === "revealed").length < 2 &&
    hasInternetConnection;

  return (
    <div className="flex flex-col items-center gap-8">
      {!hasInternetConnection && (
        <div className="bg-pink-700 text-white py-2 px-4 text-sm font-mono tracking-wider animate-pulse duration-1000 repeat-1 my-4">
          Please check your internet connection.
        </div>
      )}
      <ul
        className={`grid ${
          gridSizes[game.emojiList.length]
        } gap-x-2 sm:gap-x-4 gap-y-4`}
      >
        {game?.emojiList?.map((emoji, index) => {
          const disabled =
            game.status !== GameStatus.InProgress ||
            emoji.status !== "hidden" ||
            !isBoardInteractive ||
            !isCurrentPlayer;
          return (
            <li
              key={index}
              className={`flex justify-center card ${
                flippedStatus.includes(emoji.status) ? "is-flipped" : "is-down"
              }`}
            >
              <Button
                variant="outline"
                className="md:text-4xl text-red text-3xl py-6 px-3 md:px-4 disabled:opacity-100 disabled:cursor-not-allowed disabled:pointer-events-auto"
                disabled={disabled}
                onClick={() => {
                  handleMove({ index });
                }}
              >
                {emoji.status === "hidden" && (theme === "dark" ? "❔" : "❓")}
                {emoji.status !== "hidden" && emoji.value}
              </Button>
            </li>
          );
        })}
      </ul>
      {isCurrentPlayer &&
        game.status === GameStatus.InProgress &&
        hasInternetConnection &&
        game.players.length > 1 && (
          <div className="bg-pink-700 text-white py-2 px-4 text-sm font-mono tracking-wider animate-pulse duration-1000 repeat-1">
            Make your move!
          </div>
        )}

      <DeleteGameButton />
    </div>
  );
}
