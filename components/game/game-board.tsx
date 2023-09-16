"use client";

import DeleteGameButton from "@/components/delete-game-button";
import useGame from "@/components/game/hooks/use-game";
import useMakeMove, { MoveArgs } from "@/components/game/hooks/use-make-move";
import usePlayerId from "@/components/game/hooks/use-player-id";
import MakeYourMoveBanner from "@/components/game/make-your-move-banner";
import NoInternetBanner from "@/components/game/no-internet-banner";
import Timer from "@/components/game/timer";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/convex/types";
import { useConvex } from "convex/react";
import { useTheme } from "next-themes";
import useCountdownEffect from "./hooks/use-countdown-effect";
import useGameCheckEffect from "./hooks/use-game-check-effect";
import { useState } from "react";
import GameContextMenu from "./game-context-menu";

const gridSizes: {
  [key: number]: string;
} = {
  8: "grid-cols-4",
  16: "grid-cols-4",
  36: "grid-cols-4 sm:grid-cols-6",
  64: "grid-cols-4 sm:grid-cols-8",
  100: "grid-cols-5 sm:grid-cols-10",
};

const flippedStatus = ["revealed", "matched"];

export default function GameBoard() {
  const game = useGame();
  const convex = useConvex();
  useCountdownEffect();
  useGameCheckEffect();

  const { makeFirstMove, makeSecondMove } = useMakeMove();
  const playerId = usePlayerId();

  if (!game) {
    return null;
  }

  const handleMove = async (args: MoveArgs) => {
    if (game.moves.at(-1)?.length === 0) {
      return await makeFirstMove(args);
    }

    return await makeSecondMove(args);
  };

  const isCurrentPlayer = game.currentPlayer?.id === playerId;

  const hasInternetConnection = convex.connectionState().isWebSocketConnected;

  const isBoardInteractive =
    game.emojiList.filter((emoji) => emoji.status === "revealed").length < 2 &&
    hasInternetConnection;

  const emojiListWithDisabledStatus = game.emojiList.map((emoji) => ({
    ...emoji,
    disabled:
      game.status !== GameStatus.InProgress ||
      emoji.status !== "hidden" ||
      !isBoardInteractive ||
      !isCurrentPlayer,
    handleMove,
  }));

  const showMultiplayerTimer = game.players.length > 1;

  const showMakeYourMoveBanner =
    game.status === GameStatus.InProgress &&
    hasInternetConnection &&
    game.players.length > 1;

  return (
    <div className="flex flex-col items-center gap-8">
      <NoInternetBanner hasInternetConnection={hasInternetConnection} />
      <div className="flex gap-8 items-center">
        {showMultiplayerTimer && game.status === GameStatus.InProgress && (
          <Timer timer={game.currentMultiplayerTimer} />
        )}
        {showMakeYourMoveBanner && (
          <MakeYourMoveBanner currentPlayer={game.currentPlayer} />
        )}
      </div>
      <Grid emojiList={emojiListWithDisabledStatus} />
      <DeleteGameButton />
    </div>
  );
}

function Grid({
  emojiList,
}: {
  emojiList: {
    status: string;
    value: string;
    disabled: boolean;
    handleMove: (args: MoveArgs) => Promise<
      | {
          move: "first";
        }
      | {
          move: "second";
          isGameFinished: boolean;
          winnerIds: string[];
          matched: boolean;
          firstEmojiIndex: number;
          secondEmojiIndex: number;
        }
    >;
  }[];
}) {
  const { resolvedTheme } = useTheme();
  const [lastPairSelected, setLastPairSelected] = useState<{
    firstEmojiIndex: number;
    secondEmojiIndex: number;
    matched: boolean;
  } | null>(null);

  return (
    <ul
      className={`grid ${
        gridSizes[emojiList.length]
      } gap-x-2 sm:gap-x-4 gap-y-4`}
    >
      {emojiList.map(({ status, disabled, handleMove, value }, index) => {
        const wasSelected =
          lastPairSelected?.firstEmojiIndex === index ||
          lastPairSelected?.secondEmojiIndex === index;

        const wasMatched = wasSelected && lastPairSelected?.matched;
        return (
          <li
            key={index}
            className={`flex justify-center card rounded ${
              flippedStatus.includes(status) ? "is-flipped" : "is-down"
            }
            ${
              wasSelected
                ? wasMatched
                  ? "animate-matched-outline"
                  : "animate-failed-outline"
                : ""
            }
            `}
          >
            <Button
              variant="outline"
              className={`md:text-4xl text-red text-3xl py-6 px-3 md:px-4 disabled:opacity-100 
              disabled:cursor-not-allowed disabled:pointer-events-auto`}
              disabled={disabled}
              onClick={async () => {
                const newStatus = await handleMove({ index });

                if (newStatus.move === "first") {
                  setLastPairSelected(null);
                  return;
                }

                setLastPairSelected({
                  firstEmojiIndex: newStatus.firstEmojiIndex,
                  secondEmojiIndex: newStatus.secondEmojiIndex,
                  matched: newStatus.matched,
                });
              }}
            >
              {status === "hidden" && (resolvedTheme === "dark" ? "❔" : "❓")}
              {status !== "hidden" && value}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
