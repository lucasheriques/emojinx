"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function GamePage({ params }: { params: { slug: string } }) {
  const game = useQuery(api.games.getGame, { gameId: params.slug });

  console.log(game);

  return (
    <main className="flex min-h-full flex-col items-center  justify-center gap-8 p-24">
      {game?.grid.map((row, i) => (
        <div className="flex gap-32 text-6xl" key={i}>
          {row.map((cell, j) => (
            <div
              className="flex items-center justify-center border-2 border-white p-8"
              key={j}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
