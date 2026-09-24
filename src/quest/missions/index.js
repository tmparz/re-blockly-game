import { countBlocks, parseProgram } from "../program.js";
import { bugHunt } from "./bug-hunt.js";
import { functionFactory } from "./functions.js";
import { counting } from "./counting.js";

const decorate = (unitId) => (mission) => {
  const best = countBlocks(parseProgram(mission.solution));
  return { ...mission, unit: unitId, best, maxBlocks: mission.maxBlocks ?? best + 3 };
};

export const UNITS = [
  {
    id: "bugs",
    icon: "🐞",
    title: { en: "Bug Hunt", zh: "抓蟲大作戰" },
    concept: { en: "Debugging", zh: "除錯 Debugging" },
    missions: bugHunt.map(decorate("bugs")),
  },
  {
    id: "functions",
    icon: "🧩",
    title: { en: "Function Factory", zh: "函式工廠" },
    concept: { en: "Functions", zh: "函式 Functions" },
    missions: functionFactory.map(decorate("functions")),
  },
  {
    id: "counting",
    icon: "🔢",
    title: { en: "Counting Robots", zh: "會數數的機器人" },
    concept: { en: "Variables", zh: "變數 Variables" },
    missions: counting.map(decorate("counting")),
  },
];

export const ALL_MISSIONS = UNITS.flatMap((unit) => unit.missions);
