import { gameIdAtom } from "@/atoms/gameId";
import usePlayerId from "@/components/game/hooks/use-player-id";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import usePlaySound from "@/hooks/use-play-sound";
import { useMutation } from "convex/react";
import { useAtomValue } from "jotai";

export type MoveArgs = {
  index: number;
};

export default function useMakeMove() {
  const gameId = useAtomValue(gameIdAtom);
  const makeFirstMove = useMutation(api.games.makeFirstMove);
  const makeSecondMove = useMutation(api.games.makeSecondMove);
  const validateMove = useMutation(api.games.validateCurrentMove);
  const forceNextTurn = useMutation(api.games.forceNextTurn);
  const countDown = useMutation(api.games.countDown);
  const playSound = usePlaySound();
  const playerId = usePlayerId();
  const { toast } = useToast();

  const handleValidateMove = async () => {
    const status = await validateMove({ gameId });
    if (status.matched) {
      playSound("matched");
    } else {
      playSound("failed");
    }

    if (status.isGameFinished) {
      if (status.winnerId === playerId) {
        playSound("victory");
        toast({ title: "You won! 🎉🎉🎉" });
      } else {
        toast({ title: "You lost! 🥺🥺🥺" });
      }
    }

    return status;
  };

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
        const status = await handleValidateMove();

        resolve(status);
      }, 1000)
    );

    return status;
  };

  const handleForceNextTurn = async () => {
    await forceNextTurn({ gameId });
  };

  const handleCountDown = async () => {
    await countDown({ gameId });
  };

  return {
    makeFirstMove: handleFirstMove,
    makeSecondMove: handleSecondMove,
    handleForceNextTurn,
    handleCountDown,
    forceValidateMove: handleValidateMove,
  };
}
