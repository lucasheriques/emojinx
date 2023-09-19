export enum GameStatus {
  NotStarted = "notStarted",
  InProgress = "inProgress",
  Finishing = "finishing",
  Finished = "finished",
}

export type Player = {
  id: string;
  name: string;
  points: number;
};

export type EmojiCategories =
  | "smiley"
  | "animalsAndNature"
  | "foodsAndDrinks"
  | "travelsAndPlaces"
  | "flags"
  | "objects";

export type EmojiListType = {
  [key in EmojiCategories]: string[];
};
