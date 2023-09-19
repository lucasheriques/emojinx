import { EmojiCategories } from "@/convex/types";
import { atomWithStorage } from "jotai/utils";

export const defaultEmojiCategoriesAtom = atomWithStorage<EmojiCategories[]>(
  "defaultEmojiCategories",
  [
    "smiley",
    "animalsAndNature",
    "foodsAndDrinks",
    "travelsAndPlaces",
    "flags",
    "objects",
  ]
);
