"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import SoundToggle from "@/components/sound-toggle";
import { useAtomValue } from "jotai";
import { playerNameAtom } from "@/atoms/player/playerName";

export default function Header() {
  const playerName = useAtomValue(playerNameAtom);
  return (
    <header className="py-2 px-4 text-sm dark:bg-slate-900 bg-purple-50 shadow">
      <div className="max-w-7xl m-auto w-full flex justify-between items-center">
        <h1 className="text-xl dark:text-purple-400 text-purple-700 font-mono">
          <Link href="/">👾 emojinx</Link>
        </h1>
        <div className="flex items-center gap-2">
          {playerName.length > 0 && (
            <span className="text-sm text-muted-foreground">
              Welcome back, {playerName}!
            </span>
          )}
          <SoundToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
