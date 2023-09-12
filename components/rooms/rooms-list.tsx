"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GameStatus } from "@/types";

type RenderListProps = {
  title: string;
  games: {
    _id: string;
    roomName: string;
  }[];
};

function RenderList({ title, games }: RenderListProps) {
  const [parent, enableAnimations] = useAutoAnimate();

  return (
    <div>
      <h2 className="pb-4">{title}</h2>

      {games.length === 0 && "None"}
      <ul
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
        ref={parent}
      >
        {games.map((game) => (
          <li key={game._id} className="">
            <Link href={`/games/${game._id}`} key={game._id}>
              <Card>
                <CardHeader>
                  <CardTitle>{game.roomName}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RoomsList() {
  const games = useQuery(api.games.getGames);

  if (!games) {
    return null;
  }

  const availableRooms = games?.filter(
    (game) => game.status === GameStatus.NotStarted
  );
  const inProgressRooms = games?.filter(
    (game) => game.status === GameStatus.InProgress
  );
  const finishedRooms = games?.filter(
    (game) => game.status === GameStatus.Finished
  );

  return (
    <div className="flex flex-col gap-8">
      <RenderList games={availableRooms} title="Available game rooms" />
      <RenderList games={inProgressRooms} title="In progress game rooms" />
      <RenderList games={finishedRooms} title="Finished game rooms" />
    </div>
  );
}
