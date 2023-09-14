import { gameIdAtom } from "@/atoms/gameId";
import { useAtomValue } from "jotai";

export default function useCurrentGameId() {
  return useAtomValue(gameIdAtom);
}
