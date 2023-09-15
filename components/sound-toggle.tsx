"use client";
import { enableSoundAtom } from "@/atoms/enableSound";
import { Button } from "@/components/ui/button";
import { SpeakerLoudIcon, SpeakerOffIcon } from "@radix-ui/react-icons";
import { useAtom } from "jotai";

export default function SoundToggle() {
  const [enableSound, setEnableSound] = useAtom(enableSoundAtom);

  const toggleSound = () => {
    setEnableSound(!enableSound);
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={toggleSound}
      className="transition-all"
    >
      {enableSound ? <SpeakerLoudIcon /> : <SpeakerOffIcon />}
    </Button>
  );
}
