"use client";
import { GameStatus } from "@/types";
import useGame from "./hooks/useGame";
import GameNotStarted from "@/components/game/game-not-started";
import GameBoard from "@/components/game/hooks/game-board";
import Scoreboard from "@/components/game/scoreboard";

export default function GameScreen() {
  const game = useGame();

  if (!game) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <Scoreboard
        players={[...game.players].sort((a, b) => b.points - a.points)}
      />
      {game.status === GameStatus.NotStarted && <GameNotStarted />}
      {game.status}
      <GameBoard />
    </div>
  );
}
