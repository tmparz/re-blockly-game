// The Function Factory book reads the REAL mission data: no copies, no edits.
// Lessons 1–20 follow FUNCTION_PATH; the fp-* practice missions, 🔮 predict missions and the level maker are left out.
import { UNITS, missionNumber } from "../quest/missions/index.js";
import { FUNCTION_PATH } from "../quest/missions/function-path.js";
import { levelMaker } from "../quest/missions/maker.js";
import { FUNCTION_LABELS } from "../quest/blocks.js";

export const UNIT_ID = "functions";
export const LESSON_COUNT = 20;

const unit = UNITS.find((u) => u.id === UNIT_ID);
const byId = new Map(unit.missions.map((m) => [m.id, m]));
const wanted = FUNCTION_PATH
  .map(([id]) => id)
  .filter((id) => !id.startsWith("fp-"))
  .map((id) => byId.get(id))
  .filter((m) => m && m.mode !== "predict" && m.id !== levelMaker.id)
  .slice(0, LESSON_COUNT);

// Each lesson keeps the mission object as it is, plus its Quest Lab number (?m=N), worked out by Quest Lab itself.
export const LESSONS = wanted.map((mission, index) => ({
  n: index + 1,
  mission,
  courseNumber: missionNumber(unit, unit.missions.indexOf(mission)),
}));

// The self-check confirms that book page N really is Quest Lab mission N.
export const courseHref = (lesson) => `quest.html?unit=${UNIT_ID}&m=${lesson.n}`;

export const zh = (value) => (value && typeof value === "object" ? value.zh ?? value.en : value ?? "");

export function fnLabel(name) {
  const [icon, , label] = FUNCTION_LABELS[name] ?? ["🧩", name, name];
  return `${icon} ${label}`;
}

// The same words the Quest Lab blocks use in 中文.
export const BLOCK_TEXT = {
  move: "前進",
  left: "左轉 ↺",
  right: "右轉 ↻",
  pick: "撿起 💎",
  repeat: "重複",
  until: "重複直到 🏁",
  if: "如果",
  ifElse: "如果／否則",
  def: "定義",
  call: "🧩 執行函式",
};

export const COND_TEXT = {
  pathAhead: "前方有路 ⬆️",
  pathLeft: "左邊有路 ⬅️",
  pathRight: "右邊有路 ➡️",
  gemHere: "站在寶石上 💎",
};

// The engine stops with a reason code; children read one friendly sentence instead.
const REASONS = {
  success: "成功了！Robo 撿完寶石，停在旗子 🏁 上。",
  wall: "碰！Robo 撞到牆了：前面沒有路，它只好停下來。",
  noGem: "Robo 想撿寶石，可是這一格沒有寶石，它只好停下來。",
  notGoal: "程式做完了，可是 Robo 還沒走到旗子 🏁。",
  missedGems: "Robo 走到旗子了，可是還有寶石 💎 沒撿到。",
  tooManySteps: "Robo 一直重複、停不下來！我們先幫它停住。",
  recursion: "有個函式一直呼叫自己，停不下來，我們先幫它停住。",
  missingDef: "Robo 呼叫了一個裡面還沒寫東西的函式。",
  noStart: "「▶ 按下執行時」下面還沒有方塊，Robo 不知道要做什麼。",
  unknownBlock: "Robo 看不懂其中一個方塊。",
  crash: "這個程式 Robo 看不懂，換個方塊試試看。",
};

export const reasonText = (reason) => REASONS[reason] ?? `Robo 停下來了（${reason}）。`;

export const TIER_TEXT = { easy: "🟢 簡單", medium: "🟡 中等", hard: "🔴 困難" };
