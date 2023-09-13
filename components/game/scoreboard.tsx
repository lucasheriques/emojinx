import { playerIdAtom } from "@/atoms/player/playerId";
import useGame from "@/components/game/hooks/use-game";
import { Badge } from "@/components/ui/badge";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useAtomValue } from "jotai";
import { ReactNode } from "react";

type ScoreboardProps = {
  players: {
    id: string;
    name: string;
    points: number;
    errors: number;
  }[];
};

type ScoreboardItemProps = {
  playerName: ReactNode;
  score: ReactNode;
};

function ScoreboardItem({ playerName, score }: ScoreboardItemProps) {
  return (
    <li className="grid grid-cols-5 md:grid-cols-6 p-2 md:p-3 even:bg-emerald-200 first:rounded-t-lg last:rounded-b-lg bg-rose-200 dark:even:bg-emerald-600/20 dark:odd:bg-rose-600/20">
      <div className="md:col-span-5 col-span-4 flex gap-2">{playerName}</div>
      <div className="text-right">{score}</div>
    </li>
  );
}

export default function Scoreboard() {
  const game = useGame();
  const [parent] = useAutoAnimate();
  const storagePlayerId = useAtomValue(playerIdAtom);

  if (!game) {
    return null;
  }

  const sortedPlayers = [...game.players].sort((a, b) => b.points - a.points);
  const currentPlayer = game.players[game.currentPlayerIndex];

  return (
    <div className="w-full">
      <h2 className="font-mono text-4xl pb-4 text-center">Scoreboard</h2>
      <ul ref={parent} className="max-w-lg mx-auto">
        <ScoreboardItem playerName="player" score="score" />
        {sortedPlayers.map((player) => (
          <ScoreboardItem
            key={player.id}
            score={player.points}
            playerName={
              <>
                {player.name}{" "}
                {player.id === storagePlayerId && <Badge>you</Badge>}
              </>
            }
          />
        ))}
      </ul>
    </div>
  );
}
