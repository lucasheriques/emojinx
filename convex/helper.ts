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

export function generateGrid(size: number) {
  const emojisList = Object.values(emojis).flat();
  const emojisLength = emojisList.length;
  const grid: string[] = [];

  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * emojisLength);
    const emoji = emojisList[randomIndex];
    grid.push(emoji);
  }

  return grid;
}
