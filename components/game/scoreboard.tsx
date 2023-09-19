import useGame from "@/components/game/hooks/use-game";
import usePlayerId from "@/components/game/hooks/use-player-id";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ReactNode } from "react";

type ScoreboardItemProps = {
  playerName: ReactNode;
  score: ReactNode;
};

function ScoreboardItem({ playerName, score }: ScoreboardItemProps) {
  return (
    <li className="grid grid-cols-5 md:grid-cols-6 first:text-xs first:dark:text-slate-300 first:text-stone-700 p-2 sm:p-3 even:bg-emerald-300 first:rounded-t-lg last:rounded-b-lg bg-rose-300 dark:even:bg-emerald-600/20 dark:odd:bg-rose-600/20">
      <div className="md:col-span-5 col-span-4 flex gap-2">{playerName}</div>
      <div className="flex justify-end">{score}</div>
    </li>
  );
}

export default function Scoreboard() {
  const game = useGame();
  const [parent] = useAutoAnimate();
  const storagePlayerId = usePlayerId();

  if (!game) {
    return null;
  }

  const { players, winnerIds, roomName } = game;

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
  const isDraw = winnerIds.length > 1;

  return (
    <div className="w-full">
      <h2 className="font-mono text-2xl pb-4 text-center">
        {roomName} — Scoreboard
      </h2>
      <ul ref={parent} className="max-w-lg mx-auto">
        <ScoreboardItem playerName="player" score="score" />
        {sortedPlayers.map((player) => (
          <ScoreboardItem
            key={player.id}
            score={player.points}
            playerName={
              <>
                {player.name}
                {player.id === storagePlayerId && (
                  <Badge variant="secondary">you</Badge>
                )}
                {winnerIds.includes(player.id) &&
                  (isDraw ? (
                    <Badge variant="success">draw</Badge>
                  ) : (
                    <Badge variant="success">winner</Badge>
                  ))}
              </>
            }
          />
        ))}
      </ul>
    </div>
  );
}

export function ScoreboardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="w-64 h-8 mb-4 mx-auto" />
      <ul className="max-w-lg mx-auto">
        <ScoreboardItem playerName="player" score="score" />
        <ScoreboardItem
          playerName={<Skeleton className="w-44 h-6" />}
          score={<Skeleton className="w-4 h-6" />}
        />
        <ScoreboardItem
          playerName={<Skeleton className="w-44 h-6" />}
          score={<Skeleton className="w-4 h-6" />}
        />
      </ul>
    </div>
  );
}
