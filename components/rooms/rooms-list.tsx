"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Game } from "@/types";
import CreateRoomDialog from "@/components/rooms/create-room-dialog";
import { GameStatus } from "@/convex/types";
import { useAtomValue } from "jotai";
import { playerNameAtom } from "@/atoms/player/playerName";

type RenderListProps = {
  title:
    | "Available game rooms"
    | "In progress game rooms"
    | "Finished game rooms";
  games: Game[];
};

const gameLength: {
  [key: number]: string;
} = {
  4: "Quickest",
  16: "Quick",
  36: "Standard",
  64: "Epic",
  100: "Marathon",
};

function RenderList({ title, games }: RenderListProps) {
  const [parent] = useAutoAnimate();

  const titleColor = {
    "Available game rooms": "text-emerald-500",
    "In progress game rooms": "text-amber-500",
    "Finished game rooms": "text-rose-500",
  };

  return (
    <div>
      <h2 className={`pb-4 text-xl font-semibold ${titleColor[title]}`}>
        {title}
      </h2>

      <ul
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
        ref={parent}
      >
        {games.map((game) => (
          <li key={game._id} className="">
            <Link
              href={`/games/${game._id}`}
              key={game._id}
              className="flex-1 min-h-[114px]"
            >
              <Card className="bg-primary-foreground">
                <CardHeader className="p-4">
                  <CardTitle className="font-mono tracking-wider text-lg text-indigo-500 truncate">
                    {game.roomName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col p-4 pt-0">
                  <span className="text-sm text-muted-foreground">
                    Players: {game.players.length}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Length: {gameLength[game.emojiList.length]}
                  </span>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
        {title === "Available game rooms" && (
          <li className="flex min-h-[118px]">
            <CreateRoomDialog />
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RoomsList() {
  const games = useQuery(api.games.getGames);
  const playerName = useAtomValue(playerNameAtom);

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
    <div className="flex flex-col gap-4 md:gap-8 flex-1">
      {playerName.length > 0 && (
        <span className="text-sm text-muted-foreground">
          Welcome back, {playerName}!
        </span>
      )}
      <RenderList games={availableRooms} title="Available game rooms" />
      {inProgressRooms.length > 0 && (
        <RenderList games={inProgressRooms} title="In progress game rooms" />
      )}
      {finishedRooms.length > 0 && (
        <RenderList games={finishedRooms} title="Finished game rooms" />
      )}
    </div>
  );
}
