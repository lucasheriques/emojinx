import { useTheme } from "next-themes";
import { MoveArgs } from "./hooks/use-make-move";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MoveResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { range } from "@/lib/utils";

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

  useEffect(() => {
    const revealedEmojisAndTheirIndexes = emojiList
      .map((emoji, index) => ({ ...emoji, index }))
      .filter((emoji) => emoji.status === "revealed");

    if (revealedEmojisAndTheirIndexes.length === 0) {
      return;
    }

    if (revealedEmojisAndTheirIndexes.length === 1) {
      setLastPairSelected(null);
      return;
    }

    const timeout = setTimeout(
      () =>
        setLastPairSelected({
          firstEmojiIndex: revealedEmojisAndTheirIndexes[0].index,
          secondEmojiIndex: revealedEmojisAndTheirIndexes[1].index,
          matched:
            revealedEmojisAndTheirIndexes[0].value ===
            revealedEmojisAndTheirIndexes[1].value,
        }),
      600
    );

    return () => clearTimeout(timeout);
  }, [emojiList]);

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
                await handleMove({ index });
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

export function GridSkeleton() {
  const skeletons = range(0, 16);
  return (
    <div className={`grid ${gridSizes[8]} gap-x-2 sm:gap-x-4 gap-y-4`}>
      {skeletons.map((i) => (
        <Skeleton key={i} className="w-[70px] h-[50px]" />
      ))}
    </div>
  );
}
