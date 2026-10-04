import { countBlocks, parseProgram } from "../program.js";
import { bugHunt } from "./bug-hunt.js";
import { functionFactory } from "./functions.js";
import { counting } from "./counting.js";
import { functionBasics } from "./functions-basics.js";
import { functionAdvanced } from "./functions-advanced.js";
import { FUNCTION_PATH } from "./function-path.js";
import { countingExtra } from "./counting-extra.js";
import { COUNTING_PATH } from "./counting-path.js";
import { inputs } from "./inputs.js";
import { INPUTS_PATH } from "./inputs-path.js";
import { LOGIC_PATH, logic } from "./logic.js";
import { VARIABLES_PATH, variables } from "./variables.js";
import { LISTS_PATH, lists } from "./lists.js";
import { ALGORITHMS_PATH, algorithms } from "./algorithms.js";
import { MASTERS_PATH, masters } from "./masters.js";
import { PREDICT } from "./predict.js";

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
const inputMissions = followPath("inputs", inputs, INPUTS_PATH);
const logicMissions = followPath("logic", logic, LOGIC_PATH);
const variableMissions = followPath("variables", variables, VARIABLES_PATH);
const listMissions = followPath("lists", lists, LISTS_PATH);
const algorithmMissions = followPath("algorithms", algorithms, ALGORITHMS_PATH);
const masterMissions = followPath("masters", masters, MASTERS_PATH);

// Part 3 units open and close with a 🔮 predict mission.
const withPredict = (unitId, missions) => {
  const [first, last] = PREDICT[unitId] ?? [];
  return [first, ...missions, last].filter(Boolean);
};

const decorate = (unitId) => (mission) => {
  const best = countBlocks(parseProgram(mission.solution));
  return { ...mission, unit: unitId, best, maxBlocks: mission.maxBlocks ?? best + 3 };
};

export const UNITS = [
  {
    id: "bugs",
    part: 2,
    icon: "🐞",
    title: { en: "Bug Hunt", zh: "抓蟲大作戰" },
    short: { en: "Bugs", zh: "抓蟲" },
    concept: { en: "Debugging", zh: "除錯 Debugging" },
    missions: bugHunt.map(decorate("bugs")),
  },
  {
    id: "functions",
    part: 2,
    icon: "🧩",
    title: { en: "Function Factory", zh: "函式工廠" },
    short: { en: "Functions", zh: "函式" },
    concept: { en: "Functions", zh: "函式 Functions" },
    missions: functionMissions.map(decorate("functions")),
  },
  {
    id: "counting",
    part: 2,
    icon: "🔢",
    title: { en: "Counting Robots", zh: "會數數的機器人" },
    short: { en: "Counting", zh: "數數" },
    concept: { en: "Variables", zh: "變數 Variables" },
    missions: countingMissions.map(decorate("counting")),
  },
  // Advanced course (Part 3) starts here.
  {
    id: "inputs",
    part: 3,
    icon: "🎛️",
    title: { en: "Function Inputs", zh: "函式參數" },
    short: { en: "Inputs", zh: "參數" },
    concept: { en: "Parameters", zh: "參數 Parameters" },
    missions: withPredict("inputs", inputMissions).map(decorate("inputs")),
  },
  {
    id: "logic",
    part: 3,
    icon: "⚖️",
    title: { en: "Compare & Logic", zh: "比較與邏輯" },
    short: { en: "Logic", zh: "邏輯" },
    concept: { en: "Comparisons & Booleans", zh: "比較與布林邏輯" },
    missions: withPredict("logic", logicMissions).map(decorate("logic")),
  },
  {
    id: "variables",
    part: 3,
    icon: "🎒",
    title: { en: "Many Variables", zh: "多個變數" },
    short: { en: "Variables+", zh: "變數+" },
    concept: { en: "Variables & state", zh: "多個變數與狀態" },
    missions: withPredict("variables", variableMissions).map(decorate("variables")),
  },
  {
    id: "lists",
    part: 3,
    icon: "📦",
    title: { en: "Lists", zh: "串列" },
    short: { en: "Lists", zh: "串列" },
    concept: { en: "Lists (arrays)", zh: "串列（陣列）" },
    missions: withPredict("lists", listMissions).map(decorate("lists")),
  },
  {
    id: "algorithms",
    part: 3,
    icon: "🧪",
    title: { en: "Algorithm Race", zh: "演算法比賽" },
    short: { en: "Algorithms", zh: "演算法" },
    concept: { en: "Comparing algorithms", zh: "比較演算法" },
    missions: withPredict("algorithms", algorithmMissions).map(decorate("algorithms")),
  },
  {
    id: "masters",
    part: 3,
    icon: "🌀",
    title: { en: "Function Masters", zh: "函式大師" },
    short: { en: "Masters", zh: "大師" },
    concept: { en: "Return values & recursion", zh: "回傳值與遞迴" },
    missions: withPredict("masters", masterMissions).map(decorate("masters")),
  },
];

export const ALL_MISSIONS = UNITS.flatMap((unit) => unit.missions);

// 🔮 Predict missions are not numbered: the dots show 🔮 and ?m=p1 / ?m=p2 open them, so "mission 7" and ?m=7
// still mean the same mission as in the course pages.
const isPredict = (mission) => mission.mode === "predict";

export function missionNumber(unit, index) {
  if (isPredict(unit.missions[index])) return null;
  return unit.missions.slice(0, index + 1).filter((m) => !isPredict(m)).length;
}

export function missionParam(unit, index) {
  if (!isPredict(unit.missions[index])) return String(missionNumber(unit, index));
  return `p${unit.missions.slice(0, index + 1).filter(isPredict).length}`;
}

// The index for a ?m= value, or -1 when the unit has no such mission.
export function missionIndex(unit, param) {
  const text = String(param ?? "");
  const predict = /^p(\d+)$/.exec(text);
  const want = Number(predict ? predict[1] : text);
  if (!Number.isInteger(want) || want < 1) return -1;
  let seen = 0;
  return unit.missions.findIndex((m) => isPredict(m) === Boolean(predict) && ++seen === want);
}
