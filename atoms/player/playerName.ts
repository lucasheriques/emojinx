import { atomWithStorage } from "jotai/utils";

// Set the string key and the initial value
export const playerNameAtom = atomWithStorage("playerName", "");
