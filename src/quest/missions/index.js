import { countBlocks, parseProgram } from "../program.js";
import { bugHunt } from "./bug-hunt.js";
import { functionFactory } from "./functions.js";
import { counting } from "./counting.js";
import { functionBasics } from "./functions-basics.js";
import { functionAdvanced } from "./functions-advanced.js";
import { FUNCTION_PATH } from "./function-path.js";
import { countingExtra } from "./counting-extra.js";
import { COUNTING_PATH } from "./counting-path.js";

// Orders a pool of missions by a learning path, adding each mission's tier and lesson.
function followPath(name, missions, path) {
  const pool = new Map(missions.map((m) => [m.id, m]));
  if (pool.size !== path.length) throw new Error(`Every ${name} mission must appear in its path once.`);
  return path.map(([id, tier, lesson]) => {
    const mission = pool.get(id);
    if (!mission) throw new Error(`The ${name} path lists unknown mission "${id}".`);
    return { ...mission, tier, lesson };
  });
}

const functionMissions = followPath("function", [...functionFactory, ...functionBasics, ...functionAdvanced], FUNCTION_PATH);
const countingMissions = followPath("counting", [...counting, ...countingExtra], COUNTING_PATH);

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
    missions: countingMissions.map(decorate("counting")),
  },
];

export const ALL_MISSIONS = UNITS.flatMap((unit) => unit.missions);
