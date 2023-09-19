import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu";
import { ReactNode } from "react";
import { useAtom } from "jotai";
import { skipOfflinePlayersAtom } from "@/atoms/skipOfflinePlayers";

type GameContextMenuProps = {
  children: ReactNode;
};

export default function ScoreboardContextMenu({
  children,
}: GameContextMenuProps) {
  const [skipOfflinePlayers, setSkipOfflinePlayers] = useAtom(
    skipOfflinePlayersAtom
  );

  const handleSkipOfflinePlayers = () => {
    setSkipOfflinePlayers(!skipOfflinePlayers);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex flex-col items-center justify-center gap-4 md:gap-8 w-full">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuGroup>
          <ContextMenuCheckboxItem
            checked={skipOfflinePlayers}
            onClick={handleSkipOfflinePlayers}
          >
            Skip offline players
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
