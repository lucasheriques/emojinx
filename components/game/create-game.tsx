"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";

export default function Game() {
  const createGame = useMutation(api.games.createGame);
  const games = useQuery(api.games.getGames);

  return (
    <>
      <ThemeToggle />
      <div className="flex gap-4">
        {games?.map((game) => (
          <Link href={`/games/${game._id}`} key={game._id}>
            <Card>
              <CardHeader>
                <CardTitle>{game._creationTime}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Button
        onClick={async () => {
          const game = await createGame();
        }}
      >
        Create game
      </Button>
    </>
  );
}
