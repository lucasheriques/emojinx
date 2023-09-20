"use client";

import { skipOfflinePlayersAtom } from "@/atoms/skipOfflinePlayers";
import CustomizeReactionsDialog from "@/components/emoji-reactions/customize-reactions-dialog";
import useGame from "@/components/game/hooks/use-game";
import useMakeMove from "@/components/game/hooks/use-make-move";
import useToggleSkipOfflinePlayers from "@/components/game/hooks/use-toggle-skip-offline-players";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { useMutation } from "convex/react";
import { useAtom } from "jotai";

export default function FloatingActionButton() {
  const { forceValidateMove, tryRestoreGameState } = useMakeMove();
  const [skip, toggleSkip] = useToggleSkipOfflinePlayers();
  const game = useGame();

  if (game.loading) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-4 right-4"
        >
          <MagicWandIcon className="h-4 w4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <div className="items-center flex space-x-2">
            <Checkbox
              id="skip-offline-players"
              checked={skip}
              onClick={toggleSkip}
            />
            <Label htmlFor="skip-offline-players">Skip offline players</Label>
          </div>
          <CustomizeReactionsDialog />
          <Separator />
          <div className="flex gap-2 flex-col">
            <h4 className="text-sm font-medium leading-none">Troubleshoot</h4>
            <Button
              onClick={forceValidateMove}
              variant="ghost"
              className="select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 justify-start"
            >
              Force move validation
            </Button>
            <Button
              onClick={tryRestoreGameState}
              variant="ghost"
              className="select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 justify-start"
            >
              Restore game state
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
