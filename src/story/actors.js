// The cast. Positions are % of stage width; the dragon waits off-stage until a story shows it.
export const ACTORS = {
  cat: { emoji: "🐱", name: { en: "Cat", zh: "小貓" }, x: 16, visible: true },
  dog: { emoji: "🐶", name: { en: "Dog", zh: "小狗" }, x: 38, visible: true },
  robot: { emoji: "🤖", name: { en: "Robot", zh: "機器人" }, x: 60, visible: true },
  dragon: { emoji: "🐲", name: { en: "Dragon", zh: "小龍" }, x: 82, visible: false },
};

export const ACTOR_IDS = Object.keys(ACTORS);

export const FEELINGS = {
  happy: "😊",
  sad: "😢",
  surprised: "😮",
  angry: "😠",
  sleepy: "😴",
  love: "😍",
  none: "",
};

export const MESSAGES = ["go", "party", "theEnd"];
