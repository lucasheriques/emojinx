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
import { useAtomValue } from "jotai";
import useGame from "@/components/game/hooks/use-game";
import { gamePlayerMapAtom } from "@/atoms/player/gamePlayerMap";
import useLeaveGame from "@/components/game/hooks/use-leave-game";

export default function JoinGameDialog() {
  const game = useGame();
  const gamePlayerMap = useAtomValue(gamePlayerMapAtom);
  const [open, setOpen] = React.useState(false);
  const leaveGame = useLeaveGame();

  if (!game) {
    return null;
  }

  if (gamePlayerMap[game._id]) {
    return <Button onClick={leaveGame}>Leave</Button>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Join</Button>
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
