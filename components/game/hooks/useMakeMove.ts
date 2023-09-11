import { gameIdAtom } from "@/atoms/gameId";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useAtomValue } from "jotai";

export type MoveArgs = {
  row: number;
  col: number;
};

export default function useMakeMove() {
  const gameId = useAtomValue(gameIdAtom);
  const makeFirstMove = useMutation(api.games.makeFirstMove);
  const makeSecondMove = useMutation(api.games.makeSecondMove);
  const validateMove = useMutation(api.games.validateCurrentMove);

  const handleFirstMove = async (args: MoveArgs) => {
    await makeFirstMove({
      gameId,
      row: args.row,
      col: args.col,
    });
    ``;
  };

  const handleSecondMove = async (args: MoveArgs) => {
    await makeSecondMove({
      gameId,
      row: args.row,
      col: args.col,
    });

    await validateMove({ gameId });
  };

  return {
    makeFirstMove: handleFirstMove,
    makeSecondMove: handleSecondMove,
  };
}
