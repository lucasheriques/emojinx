"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import CreateGameForm from "./create-room-form";
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { useAtomValue } from "jotai";
import { defaultEmojiCategoriesAtom } from "@/atoms/defaultEmojiCategories";

export default function CreateRoomDialog() {
  const [open, setOpen] = useState(false);
  const defaultEmojiCategories = useAtomValue(defaultEmojiCategoriesAtom);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="flex-1 border-dashed flex items-center justify-center cursor-pointer bg-lime-50 dark:bg-card">
          <CardTitle className="font-mono tracking-wider text-lg text-emerald-500">
            Create Room
          </CardTitle>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create game</DialogTitle>
        </DialogHeader>
        <CreateGameForm
          onFinish={() => setOpen(false)}
          defaultEmojiCategories={defaultEmojiCategories}
        />
        <DialogFooter>
          <Button type="submit" form="createGameForm">
            Create room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
