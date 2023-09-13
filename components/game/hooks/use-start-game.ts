import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export default function useStartGame() {
  return useMutation(api.games.startGame);
}
