import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
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
  const { forceValidateMove } = useMakeMove();

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
        <ContextMenuItem onClick={handleCopyLink}>
          <CopyIcon className="h-4 w-4 mr-2" />
          Copy room link
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>Game stuck?</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={forceValidateMove}>
              Recover game state
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
