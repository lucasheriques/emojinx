import { playerIdAtom } from "@/atoms/player/playerId";
import useGame from "@/components/game/hooks/useGame";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useAtomValue } from "jotai";

type ScoreboardProps = {
  players: {
    id: string;
    name: string;
    points: number;
    errors: number;
  }[];
};

export default function Scoreboard() {
  const game = useGame();
  const [parent] = useAutoAnimate();
  const playerId = useAtomValue(playerIdAtom);

  if (!game) {
    return null;
  }

  const sortedPlayers = [...game.players].sort((a, b) => b.points - a.points);
  const currentPlayer = game.players[game.currentPlayerIndex];

  return (
    <div className="w-full">
      <h2 className="font-mono text-4xl pb-4 text-center">Scoreboard</h2>
      <ul
        ref={parent}
        className="divide-y divide-dashed divide-gray-200 max-w-lg mx-auto"
      >
        <li className="grid grid-cols-5 md:grid-cols-6 p-2 md:p-4">
          <div className="md:col-span-4 col-span-3">player</div>
          <div>errors</div>
          <div>points</div>
        </li>
        {sortedPlayers.map((player) => (
          <li
            key={player.id}
            className="grid md:grid-cols-6 grid-cols-5 p-2 md:p-4"
          >
            <div className="col-span-3 md:col-span-4">
              {player.name} {player.id === currentPlayer.id && "current turn"}
            </div>
            <div>{player.errors}</div>
            <div>{player.points}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
