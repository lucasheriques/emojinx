import { ReactNode } from "react";

export default function DevOnly({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") return null;

  return children;
}
