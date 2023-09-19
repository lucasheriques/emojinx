"use client";
import useGame from "./hooks/use-game";
import GameActions, {
  GameActionsSkeleton,
} from "@/components/game/game-actions";
import GameBoard, { GameBoardSkeleton } from "@/components/game/game-board";
import Scoreboard, { ScoreboardSkeleton } from "@/components/game/scoreboard";
import GameContextMenu from "./game-context-menu";
import ScoreboardContextMenu from "./scoreboard-context-menu";
import FloatingActionButton from "@/components/floating-action-button";

export default function GameScreen() {
  const game = useGame();

  if (!game) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 md:gap-8">
        <ScoreboardSkeleton />
        <GameActionsSkeleton />
        <GameBoardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 md:gap-8">
      <Scoreboard />
      <GameActions />
      <GameBoard />
      <FloatingActionButton />
    </div>
  );
}
