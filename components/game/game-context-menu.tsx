import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuLabel,
} from "@/components/ui/context-menu";
import { ReactNode } from "react";
import useMakeMove from "./hooks/use-make-move";

type GameContextMenuProps = {
  children: ReactNode;
};

export default function GameContextMenu({ children }: GameContextMenuProps) {
  const { forceValidateMove, tryRestoreGameState } = useMakeMove();

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex flex-1">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuGroup>
          <ContextMenuLabel>Troubleshoot</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={forceValidateMove}>
            Force move validation
          </ContextMenuItem>
          <ContextMenuItem onClick={tryRestoreGameState}>
            Restore game state
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
