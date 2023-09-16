import { Player } from "../types";

export function getPlayersWithMostPoints(players: Player[]) {
  const maxPoints = Math.max(...players.map((player) => player.points));

  return players.filter((player) => player.points === maxPoints);
}
