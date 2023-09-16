import usePlayerId from "@/components/game/hooks/use-player-id";
import { SmallBanner } from "@/components/ui/banner";

type MakeYourMoveBannerProps = {
  currentPlayer: {
    id: string;
    name: string;
  };
};

export default function MakeYourMoveBanner({
  currentPlayer,
}: MakeYourMoveBannerProps) {
  const playerId = usePlayerId();
  const isCurrentPlayer = currentPlayer.id === playerId;

  return (
    <SmallBanner
      className={isCurrentPlayer ? "" : "repeat-0 bg-primary/50"}
      key={isCurrentPlayer ? 1 : 0}
    >
      {isCurrentPlayer
        ? `It's your turn, ${currentPlayer.name}!`
        : `Waiting ${currentPlayer.name} to make a move...`}
    </SmallBanner>
  );
}
