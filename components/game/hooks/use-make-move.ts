import { gameIdAtom } from "@/atoms/gameId";
import { api } from "@/convex/_generated/api";
import usePlaySound from "@/hooks/use-play-sound";
import { useMutation } from "convex/react";
import { useAtomValue } from "jotai";

export type MakeMoveReturn = {
  move: "first" | "second";
  isGameFinished: boolean;
  winnerIds: string[];
  matched: boolean;
  firstEmojiIndex: number;
  secondEmojiIndex: number;
};

export type MoveArgs = {
  index: number;
};

export default function useMakeMove() {
  const gameId = useAtomValue(gameIdAtom);
  const makeFirstMove = useMutation(api.games.gameplay.makeFirstMove);
  const makeSecondMove = useMutation(api.games.gameplay.makeSecondMove);
  const validateMove = useMutation(api.games.gameplay.validateCurrentMove);
  const forceNextTurn = useMutation(api.games.helpers.forceNextTurn);
  const countDown = useMutation(api.games.helpers.countDown);
  const tryRestoreGameState = useMutation(
    api.games.helpers.tryRestoreGameState
  );
  const playSound = usePlaySound();

  const handleValidateMove = async () => {
    const status = await validateMove({ gameId });
    if (status.matched) {
      playSound("matched");
    } else {
      playSound("failed");
    }

    return status;
  };

  const handleFirstMove = async ({ index }: MoveArgs) => {
    await makeFirstMove({
      gameId,
      index,
    });

    return {
      move: "first" as const,
    };
  };

  const handleSecondMove = async ({ index }: MoveArgs) => {
    await makeSecondMove({
      gameId,
      index,
    });

    const status = await new Promise<Omit<MakeMoveReturn, "move">>(
      (resolve) => {
        setTimeout(async () => {
          const status = await handleValidateMove();

          resolve(status);
        }, 1000);
      }
    );

    return {
      ...status,
      move: "second" as const,
    };
  };

  const handleTryRestoreGameState = async () => {
    await tryRestoreGameState({ gameId });
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
    tryRestoreGameState: handleTryRestoreGameState,
  };
}
