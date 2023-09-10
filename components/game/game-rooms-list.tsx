"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function GameRoomsList() {
  const games = useQuery(api.games.getGames);
  const [parent, enableAnimations] = useAutoAnimate();

  return (
    <>
      <h2>Available Game Rooms</h2>
      {games?.length === 0 && "None"}
      <ul
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
        ref={parent}
      >
        {games?.map((game) => (
          <ul key={game._id} className="">
            <Link href={`/games/${game._id}`} key={game._id}>
              <Card>
                <CardHeader>
                  <CardTitle>{game.roomName}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          </ul>
        ))}
      </ul>
    </>
  );
}
