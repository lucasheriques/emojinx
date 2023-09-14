import { gameIdAtom } from "@/atoms/gameId";
import usePlayerId from "@/components/game/hooks/use-player-id";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useAtomValue } from "jotai";
// @ts-ignore
import useSound from "use-sound";

export type MoveArgs = {
  index: number;
};

export default function useMakeMove() {
  const gameId = useAtomValue(gameIdAtom);
  const makeFirstMove = useMutation(api.games.makeFirstMove);
  const makeSecondMove = useMutation(api.games.makeSecondMove);
  const validateMove = useMutation(api.games.validateCurrentMove);
  const playerId = usePlayerId();
  const { toast } = useToast();

  const [playMatched] = useSound("/sounds/matched.mp3", { volume: 0.5 });
  const [playFailed] = useSound("/sounds/failed.mp3", { volume: 0.5 });
  const [playVictory] = useSound("/sounds/victory.mp3", { volume: 0.5 });

  const handleFirstMove = async ({ index }: MoveArgs) => {
    await makeFirstMove({
      gameId,
      index,
    });
  };

  const handleSecondMove = async ({ index }: MoveArgs) => {
    await makeSecondMove({
      gameId,
      index,
    });

    const status = await new Promise<{
      isGameFinished: boolean;
      matched: boolean;
      winnerId: string;
    }>((resolve) =>
      setTimeout(async () => {
        const status = await validateMove({ gameId });
        if (status.matched) {
          playMatched();
        } else {
          playFailed();
        }

        resolve(status);
      }, 1000)
    );

    if (status.isGameFinished) {
      if (status.winnerId === playerId) {
        playVictory();
        toast({ title: "You won! 🎉🎉🎉" });
      } else {
        toast({ title: "You lost! 🥺🥺🥺" });
      }
    }

    return status;
  };

  return {
    makeFirstMove: handleFirstMove,
    makeSecondMove: handleSecondMove,
  };
}
