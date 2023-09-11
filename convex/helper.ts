const emojis = {
  smiley: [
    "😀",
    "😁",
    "😂",
    "🤣",
    "😃",
    "😄",
    "😅",
    "😆",
    "😉",
    "😊",
    "😋",
    "😎",
    "😍",
    "😘",
    "😗",
    "😙",
    "😚",
    "🙂",
    "🤗",
    "🤔",
    "😐",
    "😑",
    "😶",
    "🙄",
    "😏",
    "😣",
    "😥",
    "😮",
    "🤐",
    "😯",
    "😪",
    "😫",
    "😴",
    "😌",
    "😛",
    "😜",
    "😝",
    "🤤",
    "😒",
    "😓",
    "😔",
    "😕",
    "🙃",
    "🤑",
    "😲",
    "🙁",
    "😖",
    "😞",
    "😟",
  ],
  animalAndNature: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰", // Domestic Animals
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯", // Wild Animals
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵", // More Animals
    "🐔",
    "🐧",
    "🦉",
    "🦆",
    "🦢", // Birds
    "🦚",
    "🦜",
    "🦩",
    "🦔",
    "🐢", // Exotic and Unique Animals
    "🐍",
    "🐊",
    "🐋",
    "🦈",
    "🐬", // Aquatic Animals
    "🐙",
    "🦑",
    "🦀",
    "🦐",
    "🐠", // Sea Creatures
    "🦞",
    "🐳",
    "🐄",
    "🐘",
    "🦏", // Large Land Animals
    "🦛",
    "🐪",
    "🐫",
    "🦙",
    "🐖", // More Mammals
  ],

  foods: [
    "🍎",
    "🍌",
    "🍇",
    "🍓",
    "🍒", // Fruits
    "🍍",
    "🥥",
    "🥭",
    "🍑",
    "🍈", // More Fruits
    "🍋",
    "🍊",
    "🍏",
    "🍉",
    "🥑", // Even More Fruits
    "🥦",
    "🥕",
    "🌽",
    "🥔",
    "🍠", // Vegetables
    "🍆",
    "🥒",
    "🥬",
    "🌶️",
    "🌰", // More Vegetables
    "🍄",
    "🥜",
    "🍞",
    "🥐",
    "🥖", // Bread and Pastry
    "🥨",
    "🥞",
    "🧇",
    "🧀",
    "🍖", // Breakfast and Meat
    "🍗",
    "🥩",
    "🥓",
    "🍔",
    "🍟", // Fast Food
    "🍕",
    "🌭",
    "🥪",
    "🍱",
    "🍲", // More Fast Food
    "🍛",
    "🍜",
    "🍝",
    "🍣", // Asian Food
    "🍤",
    "🍥",
    "🍡",
    "🥟", // More Asian Food
  ],
  drinksAndDesserts: [
    "🍻",
    "🥂",
    "🍷",
    "🥃", // Alcoholic Beverages
    "🍸",
    "🍹",
    "🍾",
    "🍶",
    "🍵", // Cocktails and Non-Alcoholic Drinks
    "☕",
    "🍼",
    "🥛",
    "🥤", // Coffee and Milkshakes
    "🧊",
    "🥄",
    "🍯",
    "🍮",
    "🍭", // Ice and Desserts
    "🍬",
    "🍫",
    "🍩",
    "🍪",
    "🥠", // Sweets and Treats
    "🥧",
    "🍰",
    "🎂",
    "🧁",
    "🍦", // Cakes and Ice Cream
    "🥮",
    "🍨",
    "🥯",
    "🍧",
  ],
  travelsAndPlaces: [
    "✈️",
    "🚁",
    "🛳️",
    "🚢",
    "🚆", // Modes of Transportation
    "🚗",
    "🚕",
    "🚲",
    "🛴",
    "🏍️", // Vehicles
    "🚀",
    "🛸",
    "🌍",
    "🌎",
    "🌏", // Space and Earth
    "🌋",
    "🏔️",
    "🏞️",
    "🏖️",
    "🏝️", // Landscapes and Natural Places
    "🏜️",
    "⛰️",
    "🌄",
    "🌅", // More Scenic Views
    "🏙️",
    "🌆",
    "🌃",
    "🏰",
    "🏯", // Urban and Historical Sites
    "🏟️",
    "🏛️",
    "🎡",
    "🎢",
    "🎠", // Attractions and Landmarks
    "🗽",
    "⛩️",
    "⛷️",
    "🏄‍♂️", // More Activities and Places
    "🏊‍♀️",
    "⛵",
    "🏕️",
    "⛺", // Outdoor Activities and Camping
    "🏚️",
    "🏠",
    "🏡",
    "🏢",
    "🏣", // Buildings
  ],
};

function getRandomEmojisFromAllCategories(size: number) {
  const emojisList = Object.values(emojis).flat();
  const emojisLength = emojisList.length;
  const emojisToReturn: string[] = [];

  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * emojisLength);
    const emoji = emojisList[randomIndex];
    emojisToReturn.push(emoji);
  }

  return emojisToReturn;
}

function getRandomUniqueEmojisFromAllCategories(amount: number) {
  const emojisList = Object.values(emojis).flat();
  const emojisLength = emojisList.length;
  const emojisSet = new Set<string>();

  while (emojisSet.size < amount) {
    const randomIndex = Math.floor(Math.random() * emojisLength);
    const emoji = emojisList[randomIndex];
    emojisSet.add(emoji);
  }

  return [...emojisSet];
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

type GridItem = {
  value: string;
  foundBy?: string;
  status: "hidden" | "revealed" | "matched";
  row: number;
  col: number;
};

export function generateEmojiArray(amount: number) {
  const emojis = getRandomUniqueEmojisFromAllCategories(amount);

  const duplicatedEmojis = shuffleArray([...emojis, ...emojis]);

  return duplicatedEmojis.map((emoji) => {
    return {
      value: emoji,
      status: "hidden" as const,
    };
  });
}
