import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export type MoveArgs = {
  row: number;
  col: number;
};

export default function useMakeMove() {
  const makeFirstMove = useMutation(api.games.makeFirstMove);
  const makeSecondMove = useMutation(api.games.makeFirstMove);

  const handleFirstMove = async (args: MoveArgs) => {
    await makeFirstMove({
      gameId: "1",
      row: args.row,
      col: args.col,
    });
  };

  const handleSecondMove = async (args: MoveArgs) => {
    await makeFirstMove({
      gameId: "1",
      row: args.row,
      col: args.col,
    });
  };

  return {
    makeFirstMove: handleFirstMove,
    makeSecondMove: handleSecondMove,
  };
}
