import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export function useMakeFirstMove() {
  return useMutation(api.games.makeFirstMove);
}

export function useMakeSecondMove() {
  return useMutation(api.games.makeFirstMove);
}
