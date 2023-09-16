import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuLabel,
} from "@/components/ui/context-menu";
import { CopyIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import { useToast } from "../ui/use-toast";
import useMakeMove from "./hooks/use-make-move";

type GameContextMenuProps = {
  children: ReactNode;
};

export default function GameContextMenu({ children }: GameContextMenuProps) {
  const { toast } = useToast();
  const { forceValidateMove, tryRestoreGameState } = useMakeMove();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "📋 Copied link to clipboard.",
    });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex flex-1">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuGroup>
          <ContextMenuLabel>Troubleshooting</ContextMenuLabel>
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
