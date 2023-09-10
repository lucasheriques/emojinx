"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import CreateGameForm from "./create-game-form";

export default function Game() {
  const games = useQuery(api.games.getGames);

  return (
    <div className="flex items-center flex-col flex-1 gap-4 py-8 justify-center">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {games?.map((game) => (
          <Link href={`/games/${game._id}`} key={game._id}>
            <Card>
              <CardHeader>
                <CardTitle>{game.roomName}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
        {games?.map((game) => (
          <Link href={`/games/${game._id}`} key={game._id}>
            <Card>
              <CardHeader>
                <CardTitle>{game.roomName}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Create Game</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create game</DialogTitle>
          </DialogHeader>
          <CreateGameForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
