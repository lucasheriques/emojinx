"use client";

import useDeleteGame from "@/components/game/hooks/use-delete-game";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

export default function DeleteGameButton() {
  const deleteGame = useDeleteGame();

  return (
    <Button variant="destructive" size="icon" onClick={deleteGame}>
      <TrashIcon />
    </Button>
  );
}
