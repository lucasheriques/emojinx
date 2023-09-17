"use client";
import Image from "next/image";

export default function Loading() {
  const loadingArray = "Loading...".split("");

  return (
    <div className="max-w-2xl relative flex-1 flex flex-col items-center mx-auto justify-center gap-8">
      <div className="flex">
        {loadingArray.map((char, i) => (
          <span
            key={i}
            className="animate-jumping-text tracking-widest font-mono text-violet-900 text-3xl dark:text-violet-300"
            style={{ "--i": (i + 1).toString() } as React.CSSProperties}
          >
            {char}
          </span>
        ))}
      </div>
      <Image
        src="/loading-illustration.svg"
        alt="Loading"
        width={512}
        height={512}
      />
    </div>
  );
}
