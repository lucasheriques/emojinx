"use client";
import useGame from "./hooks/use-game";
import GameActions from "@/components/game/game-actions";
import GameBoard from "@/components/game/game-board";
import Scoreboard from "@/components/game/scoreboard";
import GameContextMenu from "./game-context-menu";

export default function GameScreen() {
  const game = useGame();

  if (!game) {
    return null;
  }

  return (
    <GameContextMenu>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 md:gap-8">
        <Scoreboard />
        <GameActions />
        <GameBoard />
      </div>
    </GameContextMenu>
  );
}
