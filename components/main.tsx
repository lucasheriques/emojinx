import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import CreateGameForm from "./game/create-game-form";
import GameRoomsList from "./game/game-rooms-list";

export default function Main() {
  return (
    <div className="flex items-center flex-col flex-1 gap-4 max-w-7xl mx-auto">
      <div>
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
      </div>
      <GameRoomsList />
    </div>
  );
}
