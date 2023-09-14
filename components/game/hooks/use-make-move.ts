import { gameIdAtom } from "@/atoms/gameId";
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

  const [playMatched] = useSound("/sounds/matched.wav", { volume: 0.25 });
  const [playFailed] = useSound("/sounds/failed.wav", { volume: 0.25 });
  const [playVictory] = useSound("/sounds/victory.wav", { volume: 0.25 });

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

    setTimeout(async () => {
      const success = await validateMove({ gameId });
      success ? playMatched() : playFailed();
    }, 1000);
  };

  return {
    makeFirstMove: handleFirstMove,
    makeSecondMove: handleSecondMove,
  };
}
