import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { ReactNode, useState } from "react";
import { useAtom } from "jotai";
import { skipOfflinePlayersAtom } from "@/atoms/skipOfflinePlayers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomizeReactionsForm from "@/components/emoji-reactions/customize-reactions.form";

type GameContextMenuProps = {
  children: ReactNode;
};

export default function EmojiReactionsContextMenu({
  children,
}: GameContextMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ContextMenu>
        <ContextMenuTrigger className="flex flex-col items-center justify-center gap-4 md:gap-8 w-full">
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <DialogTrigger asChild>
            <ContextMenuItem>Customize reactions</ContextMenuItem>
          </DialogTrigger>
        </ContextMenuContent>
      </ContextMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Emojis</DialogTitle>
        </DialogHeader>
        <CustomizeReactionsForm onFinish={() => setOpen(false)} />
        <DialogFooter>
          <Button type="submit" form="emojiReactionsForm">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
