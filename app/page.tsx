import Game from "@/domains/game/game";

export default function Home() {
  return (
    <main className="flex min-h-full flex-col items-center justify-between p-24">
      <Game />
    </main>
  );
}
