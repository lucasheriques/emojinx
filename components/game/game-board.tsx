"use client";

import DeleteGameButton from "@/components/delete-game-button";
import useGame from "@/components/game/hooks/use-game";
import useMakeMove, { MoveArgs } from "@/components/game/hooks/use-make-move";
import usePlayerId from "@/components/game/hooks/use-player-id";
import MakeYourMoveBanner from "@/components/game/make-your-move-banner";
import NoInternetBanner from "@/components/game/no-internet-banner";
import Timer from "@/components/game/timer";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/types";
import { useConvex } from "convex/react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

const gridSizes: {
  [key: number]: string;
} = {
  16: "grid-cols-4",
  36: "grid-cols-4 sm:grid-cols-6",
  64: "grid-cols-4 sm:grid-cols-8",
  100: "grid-cols-5 sm:grid-cols-10",
};

const flippedStatus = ["revealed", "matched"];

export default function GameBoard() {
  const game = useGame();
  const playerId = usePlayerId();
  const convex = useConvex();

  const {
    makeFirstMove,
    makeSecondMove,
    handleForceNextTurn,
    handleCountDown,
  } = useMakeMove();
  const storagePlayerId = usePlayerId();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!game) {
      return;
    }

    const startCountDown = () => {
      interval = setInterval(() => {
        handleCountDown();
      }, 1000);
    };

    const forceNextTurn = async () => {
      await handleForceNextTurn();
    };

    if (
      game.status === GameStatus.InProgress &&
      game.currentPlayer?.id === playerId &&
      game.players.length > 1
    ) {
      startCountDown();
    }

    if (game.currentMultiplayerTimer === 0) {
      forceNextTurn();
    }

    return () => clearInterval(interval);
  }, [game, game?.status, handleCountDown, handleForceNextTurn, playerId]);

  if (!game) {
    return null;
  }

  const handleMove = async (args: MoveArgs) => {
    if (game.moves.at(-1)?.length === 0) {
      return await makeFirstMove(args);
    }

    await makeSecondMove(args);
  };

  const isCurrentPlayer = game.currentPlayer?.id === storagePlayerId;

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
        {showMultiplayerTimer && <Timer timer={game.currentMultiplayerTimer} />}
        {showMakeYourMoveBanner && (
          <MakeYourMoveBanner currentPlayerId={game.currentPlayer?.id ?? ""} />
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
    handleMove: (args: MoveArgs) => Promise<void>;
  }[];
}) {
  const { resolvedTheme } = useTheme();

  return (
    <ul
      className={`grid ${
        gridSizes[emojiList.length]
      } gap-x-2 sm:gap-x-4 gap-y-4`}
    >
      {emojiList.map(({ status, disabled, handleMove, value }, index) => {
        return (
          <li
            key={index}
            className={`flex justify-center card ${
              flippedStatus.includes(status) ? "is-flipped" : "is-down"
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
              {status === "hidden" && (resolvedTheme === "dark" ? "❔" : "❓")}
              {status !== "hidden" && value}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
