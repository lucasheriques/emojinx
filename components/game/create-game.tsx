"use client";

import useLocalStorageState from "use-local-storage-state";
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
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import CreateGameForm from "./create-game-form";

export default function Game() {
  const games = useQuery(api.games.getGames);

  return (
    <>
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
    </>
  );
}
