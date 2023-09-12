"use client";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/types";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import useGame from "./hooks/useGame";
import useMakeMove, { MoveArgs } from "./hooks/useMakeMove";
import GameNotStarted from "@/components/game/game-not-started";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import GameBoard from "@/components/game/hooks/game-board";

type ScoreboardProps = {
  players: {
    id: string;
    name: string;
    points: number;
  }[];
};

function Scoreboard({ players }: ScoreboardProps) {
  const [parent] = useAutoAnimate();
  return (
    <div>
      <h2>Scoreboard</h2>
      <ul ref={parent}>
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - {player.points}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function GameScreen() {
  const game = useGame();

  if (!game) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col md:flex-row md:justify-around items-center gap-8">
      <div>
        {game.status === GameStatus.Finished && (
          <div>Winner: {game.players?.[0].name}</div>
        )}

        <Scoreboard players={game.players} />
        {game.status === GameStatus.NotStarted && <GameNotStarted />}

        <div>
          Current players:{" "}
          {game.players.length === 0
            ? "none"
            : game?.players.map((player) => player.name).join(", ")}
        </div>
      </div>
      <GameBoard />
    </div>
  );
}
