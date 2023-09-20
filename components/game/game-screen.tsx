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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export default function GameScreen() {
  const game = useGame();
  const [passwordInput, setPasswordInput] = useState("");
  const [roomPasswordAtom, setRoomPasswordAtom] = useAtom(
    roomPasswordInputAtom
  );
  const [submittedOnce, setSubmittedOnce] = useState(false);

  if (game.loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 md:gap-8">
        <ScoreboardSkeleton />
        <GameActionsSkeleton />
        <GameBoardSkeleton />
      </div>
    );
  }

  const isPasswordCorrect =
    !game.password || game.password === roomPasswordAtom;

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleSubmit = () => {
    setSubmittedOnce(true);
    if (isPasswordCorrect) {
      return;
    }
    setRoomPasswordAtom(passwordInput);
  };

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
                <form onSubmit={handleSubmitForm}>
                  <Label htmlFor="password" className="font-normal">
                    Please enter the password to continue.
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoFocus
                  />
                  <span className="text-[0.8rem] font-medium text-pink-500">
                    {submittedOnce &&
                      !isPasswordCorrect &&
                      "Incorrect password."}
                  </span>
                </form>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Link href="/">Cancel</Link>
              </AlertDialogCancel>

              <AlertDialogAction onClick={handleSubmit}>
                Continue
              </AlertDialogAction>
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
