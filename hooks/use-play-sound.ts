import { enableSoundAtom } from "@/atoms/enableSound";
import { useAtomValue } from "jotai";
// @ts-ignore
import useSound from "use-sound";

export default function usePlaySound() {
  const enableSound = useAtomValue(enableSoundAtom);
  const [playMatched] = useSound("/sounds/matched.mp3", { volume: 0.3 });
  const [playFailed] = useSound("/sounds/failed.mp3", { volume: 0.3 });
  const [playVictory] = useSound("/sounds/victory.mp3", { volume: 0.3 });
  const [playLost] = useSound("/sounds/lost.mp3", { volume: 0.3 });

  function playSound(sound: "matched" | "failed" | "victory" | "lost") {
    if (!enableSound) {
      return;
    }

    if (sound === "matched") {
      return playMatched();
    }

    if (sound === "failed") {
      return playFailed();
    }

    if (sound === "lost") {
      return playLost();
    }

    return playVictory();
  }

  return playSound;
}
