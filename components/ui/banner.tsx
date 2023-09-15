export function SmallBanner({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-pink-700 text-center text-white py-2 px-4 text-sm font-mono tracking-wider animate-pulse duration-1000 repeat-[2] my-4 ${className}`}
    >
      {children}
    </div>
  );
}
