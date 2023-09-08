"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function Game() {
  const createGame = useMutation(api.games.createGame);
  const games = useQuery(api.games.getGames);

  return (
    <>
      <ThemeToggle />
      {games?.map((game) => (
        <Card key={game._id}>
          <CardHeader>
            <CardTitle>{game._creationTime}</CardTitle>
          </CardHeader>
        </Card>
      ))}

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
