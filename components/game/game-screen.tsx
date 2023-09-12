"use client";
import { Button } from "@/components/ui/button";
import { GameStatus } from "@/types";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import useGame from "./hooks/useGame";
import useMakeMove, { MoveArgs } from "./hooks/useMakeMove";
import GameNotStarted from "@/components/game/game-not-started";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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
  const { makeFirstMove, makeSecondMove } = useMakeMove();

  if (!game) {
    return null;
  }

  const handleMove = async (args: MoveArgs) => {
    if (game.moves.at(-1)?.length === 0) {
      return await makeFirstMove(args);
    }

    return await makeSecondMove(args);
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-8">
      <Link href="/">
        <Button variant="link">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to main page
        </Button>
      </Link>
      {game.status === GameStatus.NotStarted && <GameNotStarted />}

      {game.status === GameStatus.Finished && (
        <div>Winner: {game.players?.[0].name}</div>
      )}

      <Scoreboard players={game.players} />

      <div>
        Current players:{" "}
        {game.players.length === 0
          ? "none"
          : game?.players.map((player) => player.name).join(", ")}
      </div>

      <ul className="grid grid-cols-4 gap-8 flex-wrap items-center justify-center">
        {game?.emojiList?.map((emoji, index) => {
          const disabled =
            game.status !== GameStatus.InProgress || emoji.status !== "hidden";
          return (
            <li key={index}>
              <Button
                variant="outline"
                className="text-4xl py-12 disabled:opacity-100"
                disabled={disabled}
                onClick={() => {
                  handleMove({ index });
                }}
              >
                {emoji.status === "hidden" ? "❔" : emoji.value}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
