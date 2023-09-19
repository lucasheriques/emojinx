"use client";
import useGame from "./hooks/use-game";
import GameActions, {
  GameActionsSkeleton,
} from "@/components/game/game-actions";
import GameBoard, { GameBoardSkeleton } from "@/components/game/game-board";
import Scoreboard, { ScoreboardSkeleton } from "@/components/game/scoreboard";
import FloatingActionButton from "@/components/floating-action-button";
import { useAtom } from "jotai";
import { roomPasswordInputAtom } from "@/atoms/roomPasswordInput";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function GameScreen() {
  const game = useGame();
  const [roomPasswordInput, setRoomPasswordInput] = useAtom(
    roomPasswordInputAtom
  );

  if (!game) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 md:gap-8">
        <ScoreboardSkeleton />
        <GameActionsSkeleton />
        <GameBoardSkeleton />
      </div>
    );
  }

  const isPasswordCorrect =
    !game.password || game.password === roomPasswordInput;

  if (!isPasswordCorrect) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 md:gap-8">
        <ScoreboardSkeleton />
        <GameActionsSkeleton />
        <GameBoardSkeleton />
        <AlertDialog open={!isPasswordCorrect}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                This room is password protected.
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <Label htmlFor="password" className="font-normal">
                  Please enter the password to continue.
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={roomPasswordInput}
                  onChange={(e) => setRoomPasswordInput(e.target.value)}
                  autoFocus
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Link href="/">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </Link>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 md:gap-8">
      <Scoreboard />
      <GameActions />
      <GameBoard />
      <FloatingActionButton />
    </div>
  );
}
