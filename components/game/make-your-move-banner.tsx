import usePlayerId from "@/components/game/hooks/use-player-id";
import { SmallBanner } from "@/components/ui/banner";
import { useState } from "react";

export default function MakeYourMoveBanner({
  currentPlayerId,
}: {
  currentPlayerId: string;
}) {
  const playerId = usePlayerId();
  const isCurrentPlayer = currentPlayerId === playerId;

  return (
    <SmallBanner
      className={isCurrentPlayer ? "" : "repeat-0 bg-primary/50"}
      key={isCurrentPlayer ? 1 : 0}
    >
      {isCurrentPlayer ? "Make your move!" : "Wait your turn"}
    </SmallBanner>
  );
}
