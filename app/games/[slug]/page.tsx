"use client";

import { gameIdAtom } from "@/atoms/gameId";
import GameScreen from "@/components/game/game-screen";
import { useSetAtom } from "jotai";

export default function GamePage({ params }: { params: { slug: string } }) {
  const gameId = params.slug;
  const setGameId = useSetAtom(gameIdAtom);

  if (!gameId) {
    return null;
  }

  setGameId(gameId);

  return <GameScreen />;
}
