import { gameIdAtom } from "@/atoms/gameId";
import { api } from "@/convex/_generated/api";
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

  const handleFirstMove = async ({ index }: MoveArgs) => {
    await makeFirstMove({
      gameId,
      index,
    });
    ``;
  };

  const handleSecondMove = async ({ index }: MoveArgs) => {
    await makeSecondMove({
      gameId,
      index,
    });

    await validateMove({ gameId });
  };

  return {
    makeFirstMove: handleFirstMove,
    makeSecondMove: handleSecondMove,
  };
}
