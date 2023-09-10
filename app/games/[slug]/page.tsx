"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { GameStatus } from "@/types";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";

export default function GamePage({ params }: { params: { slug: string } }) {
  const game = useQuery(api.games.getGame, { gameId: params.slug });
  const makeInitialPlay = useMutation(api.games.makeInitialPlay);

  const canStartGame =
    game?.players.length > 1 && game?.status === GameStatus.NotStarted;

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-8 p-24">
      <Link href="/">
        <Button variant="link">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to main page
        </Button>
      </Link>
      <div>
        Current players:{" "}
        {game?.players.length === 0 ? "none" : game?.players.join(", ")}
      </div>
      <Button disabled={!canStartGame}>Start Game</Button>
      {game?.grid.map((row, i) => (
        <div className="flex gap-8" key={i}>
          {row.map((cell, j) => (
            <Button
              variant="outline"
              key={j}
              size="lg"
              className="py-4 px-1 lg:py-8 lg:px-4 lg:text-xl"
              disabled={game.status !== "playing"}
              onClick={() => {
                makeInitialPlay({ gameId: params.slug, row: i, col: j });
              }}
            >
              {cell.status === "hidden" ? "❔" : cell.value}
            </Button>
          ))}
        </div>
      ))}
    </main>
  );
}
