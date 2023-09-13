"use client";

import { playerIdAtom } from "@/atoms/player/playerId";
import useGame from "@/components/game/hooks/use-game";
import useMakeMove, { MoveArgs } from "@/components/game/hooks/use-make-move";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/types";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function GameBoard() {
  const game = useGame();
  const { toast } = useToast();
  const [sentToast, setSentToast] = useState(false);

  const { makeFirstMove, makeSecondMove } = useMakeMove();
  const storagePlayerId = useAtomValue(playerIdAtom);

  if (!game) {
    return null;
  }

  const handleMove = async (args: MoveArgs) => {
    if (game.moves.at(-1)?.length === 0) {
      return await makeFirstMove(args);
    }

    setSentToast(false);
    return await makeSecondMove(args);
  };

  const isCurrentPlayer =
    game.players?.[game.currentPlayerIndex]?.id === storagePlayerId;

  const flippedStatus = ["revealed", "matched"];

  const isBoardInteractive =
    game.emojiList.filter((emoji) => emoji.status === "revealed").length < 2;

  return (
    <div>
      <ul className="grid grid-cols-4 gap-8 pb-8">
        {game?.emojiList?.map((emoji, index) => {
          const disabled =
            game.status !== GameStatus.InProgress ||
            emoji.status !== "hidden" ||
            !isBoardInteractive;
          return (
            <li
              key={index}
              className={`card ${
                flippedStatus.includes(emoji.status) ? "is-flipped" : "is-down"
              }`}
            >
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
      {isCurrentPlayer && game.status !== GameStatus.Finished && (
        <div className="bg-pink-700 py-2 px-4 text-sm font-mono tracking-wider animate-pulse duration-1000 repeat-1">
          Make your move!
        </div>
      )}
    </div>
  );
}
