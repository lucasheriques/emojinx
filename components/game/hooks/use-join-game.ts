import { gamePlayerMapAtom } from "@/atoms/player/gamePlayerMap";
import { playerNameAtom } from "@/atoms/player/playerName";
import useCurrentGameId from "@/components/game/hooks/use-current-game-id";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useAtom, useSetAtom } from "jotai";

type UseJoinGameArgs = {
  onFinish?: () => void;
};

export default function useJoinGame({ onFinish }: UseJoinGameArgs) {
  const joinGame = useMutation(api.games.players.joinGame);
  const gameId = useCurrentGameId();
  const [gamePlayerMap, setGamePlayerMap] = useAtom(gamePlayerMapAtom);
  const setPlayerName = useSetAtom(playerNameAtom);

  return async function ({ name }: { name: string }) {
    const player = await joinGame({ gameId, name });
    setPlayerName(player.name);
    gamePlayerMap[gameId] = player.id;
    setGamePlayerMap(gamePlayerMap);
    onFinish?.();
  };
}
