import { atomWithStorage } from "jotai/utils";

// Set the string key and the initial value
export const gamePlayerMapAtom = atomWithStorage<{
  [gameId: string]: string;
}>("gamePlayerMap", {});
