"use client";

import { playerIdAtom } from "@/atoms/playerId";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useAtom, useAtomValue } from "jotai";
import { ErrorBoundary } from "react-error-boundary";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

function HeaderContainer() {
  const [playerId, setPlayerId] = useAtom(playerIdAtom);
  const player = useQuery(api.players.getPlayer, { playerId: playerId ?? "" });

  console.log({ playerId });

  if (!player || !playerId) {
    return null;
  }

  const handleLogout = () => {
    setPlayerId("");
  };

  return (
    <header className="py-1 px-4 text-sm bg-slate-900 flex justify-between items-center">
      <span>Welcome back, {player?.username}!</span>
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={handleLogout}>
          Logout
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <ErrorBoundary fallback={<></>}>
      <HeaderContainer />
    </ErrorBoundary>
  );
}
