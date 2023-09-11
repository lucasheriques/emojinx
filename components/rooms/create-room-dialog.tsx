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

export default function CreateRoomDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Create room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create game</DialogTitle>
        </DialogHeader>
        <CreateGameForm onFinish={() => setOpen(false)} />
        <DialogFooter>
          <Button type="submit" form="createGameForm">
            Create room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
