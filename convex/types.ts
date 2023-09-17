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
