"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Game, GameStatus } from "@/types";
import CreateRoomDialog from "@/components/rooms/create-room-dialog";

type RenderListProps = {
  title:
    | "Available game rooms"
    | "In progress game rooms"
    | "Finished game rooms";
  games: Game[];
};

function RenderList({ title, games }: RenderListProps) {
  const [parent] = useAutoAnimate();

  const titleColor = {
    "Available game rooms": "dark:text-emerald-500",
    "In progress game rooms": "text-amber-500",
    "Finished game rooms": "text-rose-500",
  };

  return (
    <div>
      <h2 className={`pb-4 text-xl font-semibold ${titleColor[title]} text-`}>
        {title}
      </h2>

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
                  <CardTitle className="font-mono tracking-wider text-lg text-indigo-500">
                    {game.roomName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>Players: {game.players?.length}</div>
                </CardContent>
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
      <div>
        <CreateRoomDialog />
      </div>
      <RenderList games={inProgressRooms} title="In progress game rooms" />
      <RenderList games={finishedRooms} title="Finished game rooms" />
    </div>
  );
}
