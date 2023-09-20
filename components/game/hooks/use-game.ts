import { gameIdAtom } from "@/atoms/gameId";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useAtomValue } from "jotai";

export default function useGame() {
  const gameId = useAtomValue(gameIdAtom);

  const game = useQuery(api.games.get.getGame, { gameId });

  if (!game) {
    return {
      loading: true,
    } as const;
  }

  return {
    ...game,
    players: game?.players ?? [],
    emojiList: game?.emojiList ?? [],
    winnerIds: game?.winnerIds ?? [],
    currentPlayer: game?.players.at(game?.currentPlayerIndex) ?? undefined,
  };
}
