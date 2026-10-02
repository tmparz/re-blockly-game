import { countBlocks, parseProgram } from "../program.js";
import { bugHunt } from "./bug-hunt.js";
import { functionFactory } from "./functions.js";
import { counting } from "./counting.js";
import { functionBasics } from "./functions-basics.js";
import { functionAdvanced } from "./functions-advanced.js";
import { FUNCTION_PATH } from "./function-path.js";

const functionPool = new Map([...functionFactory, ...functionBasics, ...functionAdvanced].map((m) => [m.id, m]));
if (functionPool.size !== FUNCTION_PATH.length) throw new Error("Every function mission must appear in FUNCTION_PATH once.");
const functionMissions = FUNCTION_PATH.map(([id, tier, lesson]) => {
  const mission = functionPool.get(id);
  if (!mission) throw new Error(`FUNCTION_PATH lists unknown mission "${id}".`);
  return { ...mission, tier, lesson };
});

const decorate = (unitId) => (mission) => {
  const best = countBlocks(parseProgram(mission.solution));
  return { ...mission, unit: unitId, best, maxBlocks: mission.maxBlocks ?? best + 3 };
};

export const UNITS = [
  {
    id: "bugs",
    icon: "🐞",
    title: { en: "Bug Hunt", zh: "抓蟲大作戰" },
    short: { en: "Bugs", zh: "抓蟲" },
    concept: { en: "Debugging", zh: "除錯 Debugging" },
    missions: bugHunt.map(decorate("bugs")),
  },
  {
    id: "functions",
    icon: "🧩",
    title: { en: "Function Factory", zh: "函式工廠" },
    short: { en: "Functions", zh: "函式" },
    concept: { en: "Functions", zh: "函式 Functions" },
    missions: functionMissions.map(decorate("functions")),
  },
  {
    id: "counting",
    icon: "🔢",
    title: { en: "Counting Robots", zh: "會數數的機器人" },
    short: { en: "Counting", zh: "數數" },
    concept: { en: "Variables", zh: "變數 Variables" },
    missions: counting.map(decorate("counting")),
  },
];

export const ALL_MISSIONS = UNITS.flatMap((unit) => unit.missions);
