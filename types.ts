export type Game = {
  _id: string;
  _creationTime: number;
  currentPlayerIndex: number;
  emojiList: {
    status: string;
    value: string;
  }[];
  status: string;
  moves: {
    index: number;
  }[][];
  players: {
    id: string;
    name: string;
    points: number;
  }[];
  roomName: string;
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
