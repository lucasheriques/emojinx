export enum GameStatus {
  NotStarted = "notStarted",
  InProgress = "inProgress",
  Finished = "finished",
}

export type Player = {
  id: string;
  name: string;
  points: number;
  errors: number;
};
