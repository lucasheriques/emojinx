import usePlayerId from "@/components/game/hooks/use-player-id";
import { SmallBanner } from "@/components/ui/banner";

type MakeYourMoveBannerProps = {
  currentPlayer?: {
    id: string;
    name: string;
  };
  skippingPlayer?: boolean;
};

export default function MakeYourMoveBanner({
  currentPlayer,
  skippingPlayer,
}: MakeYourMoveBannerProps) {
  const playerId = usePlayerId();
  const isCurrentPlayer = currentPlayer?.id === playerId;

  return (
    <SmallBanner
      className={isCurrentPlayer ? "" : "repeat-0 bg-primary/50"}
      key={isCurrentPlayer ? 1 : 0}
    >
      {isCurrentPlayer
        ? `${currentPlayer.name}, it's your turn!`
        : `${skippingPlayer ? "Skipping" : "Waiting"} ${
            currentPlayer?.name
          }...`}
    </SmallBanner>
  );
}
