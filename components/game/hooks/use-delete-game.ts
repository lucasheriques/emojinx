import useCurrentGameId from "@/components/game/hooks/use-current-game-id";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

export default function useDeleteGame() {
  const gameId = useCurrentGameId();
  const router = useRouter();
  const { toast } = useToast();

  const deleteMutation = useMutation(api.games.delete.deleteGame);

  return async function deleteGame() {
    router.replace("/");
    await deleteMutation({ gameId });
    toast({
      title: "Game deleted",
      variant: "destructive",
    });
  };
}
