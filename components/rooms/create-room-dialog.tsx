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

export default function CreateRoomDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">Create room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create game</DialogTitle>
        </DialogHeader>
        <CreateGameForm />
        <DialogFooter>
          <Button type="submit" form="createGameForm">
            Create room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
