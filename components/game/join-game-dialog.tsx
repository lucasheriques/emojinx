import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import JoinGameForm from "./join-game-form";

export default function JoinGameDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Join game</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join game</DialogTitle>
        </DialogHeader>
        <JoinGameForm onFinish={() => setOpen(false)} />
        <DialogFooter>
          <Button type="submit" form="joinGameForm">
            Join
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
