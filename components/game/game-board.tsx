"use client";

import DeleteGameButton from "@/components/delete-game-button";
import useGame from "@/components/game/hooks/use-game";
import useMakeMove, { MoveArgs } from "@/components/game/hooks/use-make-move";
import usePlayerId from "@/components/game/hooks/use-player-id";
import NoInternetBanner from "@/components/game/no-internet-banner";
import { GameStatus } from "@/convex/types";
import { useConvex } from "convex/react";
import useCountdownEffect from "./hooks/use-countdown-effect";
import useGameCheckEffect from "./hooks/use-game-check-effect";
import Grid, { GridSkeleton } from "./grid";
import { useState } from "react";
import { MoveResponse } from "@/types";
import DevOnly from "../dev-only";

export default function GameBoard() {
  const game = useGame();
  const convex = useConvex();
  const [loadingMove, setLoadingMove] = useState(false);

  // useCountdownEffect();
  useGameCheckEffect();

  const { makeFirstMove, makeSecondMove } = useMakeMove();
  const playerId = usePlayerId();

  if (game.loading) {
    return null;
  }

  const handleMove = async (args: MoveArgs) => {
    setLoadingMove(true);
    let response: MoveResponse;

    const numberOfRevealedEmojis = game.emojiList.filter(
      (emoji) => emoji.status === "revealed"
    ).length;
    if (numberOfRevealedEmojis === 0) {
      response = await makeFirstMove(args);
    } else {
      response = await makeSecondMove(args);
    }

    setLoadingMove(false);
    return response;
  };

  const isCurrentPlayer = game.currentPlayer?.id === playerId;

  const hasInternetConnection = convex.connectionState().isWebSocketConnected;

  const isBoardInteractive =
    game.emojiList.filter((emoji) => emoji.status === "revealed").length < 2 &&
    hasInternetConnection &&
    !loadingMove;

  const emojiListWithDisabledStatus = game.emojiList.map((emoji) => ({
    ...emoji,
    disabled:
      game.status !== GameStatus.InProgress ||
      emoji.status !== "hidden" ||
      !isBoardInteractive ||
      !isCurrentPlayer,
    handleMove,
  }));

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <NoInternetBanner hasInternetConnection={hasInternetConnection} />
      <Grid emojiList={emojiListWithDisabledStatus} />
      <DevOnly>
        <DeleteGameButton />
      </DevOnly>
    </div>
  );
}

export function GameBoardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-8">
      <GridSkeleton />
    </div>
  );
}
