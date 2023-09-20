"use client";

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
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { useAtomValue } from "jotai";
import { defaultEmojiCategoriesAtom } from "@/atoms/defaultEmojiCategories";
import { useRouter } from "next/navigation";
import { PlusCircledIcon } from "@radix-ui/react-icons";

type CreateRoomDialogProps = {
  buttonText?: string;
  redirectToRoom?: boolean;
  onFinish?: () => void;
};

export default function CreateRoomDialog({
  buttonText,
  redirectToRoom = false,
  onFinish,
}: CreateRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const defaultEmojiCategories = useAtomValue(defaultEmojiCategoriesAtom);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonText ? (
          <Button variant="secondary">{buttonText}</Button>
        ) : (
          <Card className="flex-1 border-dashed flex items-center justify-center cursor-pointer bg-lime-50 dark:bg-card">
            <CardTitle className="font-mono tracking-wider text-lg text-emerald-500 flex items-center gap-2">
              <PlusCircledIcon className="h-5 w-5" /> Create room
            </CardTitle>
          </Card>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm md:max-w-xl">
        <DialogHeader className="px-1">
          <DialogTitle>Create game</DialogTitle>
        </DialogHeader>
        <CreateGameForm
          onFinish={() => {
            setOpen(false);
            onFinish?.();
          }}
          redirectToRoom={redirectToRoom}
          defaultEmojiCategories={defaultEmojiCategories}
        />
        <DialogFooter>
          <Button type="submit" form="createGameForm">
            Create room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
