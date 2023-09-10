import GameScreen from "@/components/game/game-screen";

export default function GamePage({ params }: { params: { slug: string } }) {
  const gameId = params.slug;

  if (!gameId) {
    return null;
  }

  return <GameScreen gameId={gameId} />;
}
