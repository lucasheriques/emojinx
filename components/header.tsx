import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header className="py-2 px-4 text-sm bg-slate-900">
      <div className="max-w-7xl flex justify-between mx-auto">
        <h1 className="text-xl text-emerald-400 font-mono">emojinx</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
