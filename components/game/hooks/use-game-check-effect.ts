import { useEffect, useState } from "react";
import useGame from "./use-game";
import { useToast } from "@/components/ui/use-toast";
import usePlayerId from "./use-player-id";
import usePlaySound from "@/hooks/use-play-sound";
import { GameStatus } from "@/convex/types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAtom } from "jotai";
import { playedFinishingSoundAtom } from "@/atoms/playedFinishingSoundAtom";
import useMakeMove from "./use-make-move";

export default function useGameCheckEffect() {
  const game = useGame();
  const playSound = usePlaySound();
  const playerId = usePlayerId();
  const { toast } = useToast();
  const { forceValidateMove } = useMakeMove();
  const finishGame = useMutation(api.games.finishGame);
  const [playedSound, setPlayedSound] = useAtom(playedFinishingSoundAtom);

  useEffect(() => {
    if (game?.status !== GameStatus.Finishing || playedSound) {
      return;
    }

    const handleFinishGame = async () => {
      setPlayedSound(true);
      await finishGame({ gameId: game._id });
    };

    if (game?.winnerIds.includes(playerId)) {
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

    handleFinishGame();
  }, [
    finishGame,
    game?._id,
    game?.status,
    game?.winnerIds,
    playSound,
    playedSound,
    playerId,
    setPlayedSound,
    toast,
  ]);

  useEffect(() => {
    const revealedEmojis = game?.emojiList.filter(
      (emoji) => emoji.status === "revealed"
    );

    const interval = setInterval(() => {
      if (revealedEmojis?.length === 2) {
        const [first, second] = revealedEmojis;

        if (first.value === second.value) {
          playSound("matched");
        } else {
          playSound("failed");
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [game?.emojiList, playSound]);
}
