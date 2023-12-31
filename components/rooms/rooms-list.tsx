"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Game } from "@/types";
import CreateRoomDialog from "@/components/rooms/create-room-dialog";
import { GameStatus } from "@/convex/types";
import { useAtomValue } from "jotai";
import { playerNameAtom } from "@/atoms/player/playerName";
import Loading from "../loading";
import useGames from "./hooks/use-games";
import { CATEGORY_TO_EMOJI } from "@/lib/constants";
import { LockClosedIcon } from "@radix-ui/react-icons";

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
  8: "Quickest",
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

  const listDescription = {
    "Available game rooms": "Create or join an existing room to play!",
    "In progress game rooms":
      "You can join one of these rooms to watch a game.",
    "Finished game rooms":
      "These rooms have finished, but you can join to check the final score.",
  };

  return (
    <div className="grid gap-4">
      <div>
        <h2 className={`text-xl font-semibold ${titleColor[title]}`}>
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {listDescription[title]}
        </p>
      </div>

      <ul
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
        ref={parent}
      >
        {games.map((game) => {
          const roomPassword = game.password ?? "";
          return (
            <li key={game._id} className="flex">
              <Link
                href={`/games/${game._id}`}
                key={game._id}
                className="flex flex-1 max-w-full"
              >
                <Card className="bg-primary-foreground w-full">
                  <CardHeader className="p-4">
                    <CardTitle className="font-mono tracking-wider text-lg text-indigo-500 flex items-center gap-2">
                      {roomPassword.length > 0 && (
                        <LockClosedIcon className="min-w-[16px] w-4" />
                      )}
                      <span className="truncate">{game.roomName}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col p-4 pt-0 text-sm text-muted-foreground font-medium">
                    <span>Players: {game.players.length}</span>
                    <span>Length: {gameLength[game.emojiList.length]}</span>
                    <span>Turn: {game.multiplayerTimer} seconds</span>
                    <span>
                      Categories:{" "}
                      {game.emojiCategories
                        .map((category) => CATEGORY_TO_EMOJI[category])
                        .join(" ")}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </li>
          );
        })}
        {title === "Available game rooms" && (
          <li className="flex min-h-[158px]">
            <CreateRoomDialog />
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RoomsList() {
  const games = useGames();
  const playerName = useAtomValue(playerNameAtom);

  if (!games) {
    return <Loading />;
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
        <p className="text-sm text-muted-foreground font-medium">
          Welcome back, {playerName}! 👋
        </p>
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
