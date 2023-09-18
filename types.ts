export type Game = {
  _id: string;
  _creationTime: number;
  currentPlayerIndex: number;
  emojiList: {
    status: string;
    value: string;
  }[];
  status: string;
  players: {
    id: string;
    name: string;
    points: number;
  }[];
  roomName: string;
  winnerIds: string[];
};

export type MoveResponse =
  | {
      move: "first";
    }
  | {
      move: "second";
      isGameFinished: boolean;
      winnerIds: string[];
      matched: boolean;
      firstEmojiIndex: number;
      secondEmojiIndex: number;
    };
