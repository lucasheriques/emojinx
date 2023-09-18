import { useTheme } from "next-themes";
import { MoveArgs } from "./hooks/use-make-move";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MoveResponse } from "@/types";

const gridSizes: {
  [key: number]: string;
} = {
  8: "grid-cols-4",
  16: "grid-cols-4",
  36: "grid-cols-4 sm:grid-cols-6",
  64: "grid-cols-4 sm:grid-cols-8",
  100: "grid-cols-5 sm:grid-cols-10",
};

const flippedStatus = ["revealed", "matched"];

type GridProps = {
  emojiList: {
    status: string;
    value: string;
    disabled: boolean;
    handleMove: (args: MoveArgs) => Promise<MoveResponse>;
  }[];
};

export default function Grid({ emojiList }: GridProps) {
  const { resolvedTheme } = useTheme();
  const [lastPairSelected, setLastPairSelected] = useState<{
    firstEmojiIndex: number;
    secondEmojiIndex: number;
    matched: boolean;
  } | null>(null);
  const [currentStatus, setCurrentStatus] = useState<MoveResponse | null>(null);

  useEffect(() => {
    if (!currentStatus || currentStatus.move === "first") {
      setLastPairSelected(null);
      return;
    }

    setLastPairSelected({
      firstEmojiIndex: currentStatus.firstEmojiIndex,
      secondEmojiIndex: currentStatus.secondEmojiIndex,
      matched: currentStatus.matched,
    });
  }, [currentStatus]);

  return (
    <ul
      className={`grid ${
        gridSizes[emojiList.length]
      } gap-x-2 sm:gap-x-4 gap-y-4`}
    >
      {emojiList.map(({ status, disabled, handleMove, value }, index) => {
        const wasJustSelected =
          lastPairSelected?.firstEmojiIndex === index ||
          lastPairSelected?.secondEmojiIndex === index;

        let className = "";

        if (flippedStatus.includes(status)) {
          className += "is-flipped ";
        }

        if (wasJustSelected) {
          className += lastPairSelected.matched
            ? "animate-matched-outline"
            : "animate-failed-outline";
        }
        return (
          <li
            key={index}
            className={`flex justify-center card rounded ${className}`}
          >
            <Button
              variant="outline"
              className={`md:text-4xl text-red text-3xl py-6 px-3 md:px-4 disabled:opacity-100 
              disabled:cursor-not-allowed disabled:pointer-events-auto`}
              disabled={disabled}
              onClick={async () => {
                const newStatus = await handleMove({ index });

                setCurrentStatus(newStatus);
              }}
            >
              {status === "hidden" && (resolvedTheme === "dark" ? "❔" : "❓")}
              {status !== "hidden" && value}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
