import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
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

export default function CustomizeReactionsDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 justify-start"
        >
          Customize reactions
        </Button>
      </DialogTrigger>
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
