"use client";
import useGame from "./hooks/use-game";
import GameActions from "@/components/game/game-actions";
import GameBoard from "@/components/game/game-board";
import Scoreboard from "@/components/game/scoreboard";

export default function GameScreen() {
  const game = useGame();

  if (!game) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <Scoreboard />
      <GameActions />
      <GameBoard />
    </div>
  );
}
