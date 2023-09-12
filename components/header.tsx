import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header className="py-2 px-4 text-sm dark:bg-slate-900 bg-emerald-400 shadow">
      <div className="max-w-7xl flex justify-between mx-auto">
        <h1 className="text-xl dark:text-emerald-400 font-mono">
          <Link href="/">emojinx</Link>
        </h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
