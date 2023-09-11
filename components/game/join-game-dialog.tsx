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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join game</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join game</DialogTitle>
        </DialogHeader>
        <JoinGameForm />
        <DialogFooter>
          <Button type="submit" form="joinGameForm">
            Join
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
