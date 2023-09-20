import { useEffect } from "react";
import useGame from "./use-game";
import { useToast } from "@/components/ui/use-toast";
import usePlayerId from "./use-player-id";
import usePlaySound from "@/hooks/use-play-sound";
import { GameStatus } from "@/convex/types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAtom } from "jotai";
import { playedFinishingSoundAtom } from "@/atoms/playedFinishingSoundAtom";
import { Game } from "@/types";
import useIsPlayerInTheGame from "@/components/game/hooks/use-is-player-in-the-game";

function getWinners(game: ReturnType<typeof useGame>) {
  if (game.loading) {
    return [];
  }
  const { players, winnerIds } = game;
  return players.filter((p) => winnerIds.includes(p.id));
}

export default function useGameCheckEffect() {
  const game = useGame();
  const playSound = usePlaySound();
  const { toast } = useToast();
  const playerId = usePlayerId();
  const finishGame = useMutation(api.games.gameplay.finishGame);
  const [playedSound, setPlayedSound] = useAtom(playedFinishingSoundAtom);
  const isPlayerInTheGame = useIsPlayerInTheGame();

  useEffect(() => {
    if (game.loading || game.status !== GameStatus.Finishing || playedSound) {
      return;
    }

    const winners = getWinners(game);

    const handleFinishGame = async () => {
      setPlayedSound(true);
      await finishGame({ gameId: game._id ?? "" });
    };

    if (isPlayerInTheGame) {
      const isWinner = winners.some((p) => p.id === playerId);

      if (isWinner) {
        if (game?.winnerIds.length > 1) {
          playSound("lost");
          toast({ title: "It's a draw! 🤝🤝🤝" });
        } else {
          playSound("victory");
          toast({ title: "You won! 🎉🎉🎉" });
        }
      } else {
        playSound("lost");
        toast({ title: "You lost! 🥺🥺🥺" });
      }
    } else {
      if (winners.length > 1) {
        playSound("lost");
        toast({ title: "It's a draw! 🤝🤝🤝" });
      }

      if (winners.length === 1) {
        playSound("lost");
        toast({ title: `${winners[0].name} won! 🎉🎉🎉` });
      }
    }

    handleFinishGame();
  }, [
    finishGame,
    game,
    isPlayerInTheGame,
    playSound,
    playedSound,
    playerId,
    setPlayedSound,
    toast,
  ]);
}
