export default function Timer({ timer }: { timer: number }) {
  const formattedTimer = timer < 10 ? `0${timer}` : timer;
  return (
    <span
      className="animate-pulse-red text-3xl font-mono p-2 w-24"
      key={timer > 5 ? 15 : timer}
    >
      00:{formattedTimer}
    </span>
  );
}
