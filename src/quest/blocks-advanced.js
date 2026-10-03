// Part 3 blocks: named variables, comparisons, logic, while, lists and functions that report an answer.
// Every field is still a dropdown, and each mission chooses which variables and values appear.
import { lang } from "./i18n.js";

const L = (en, zh) => (lang === "zh" ? zh : en);
const HUE = { data: 330, logic: 190, loop: 42, list: 15, fn: 290 };

export const VAR_LABELS = {
  counter: ["🔢", "counter", "計數器"],
  gems: ["💎", "gems", "寶石數"],
  steps: ["👣", "steps", "步數"],
  battery: ["🔋", "battery", "電量"],
  score: ["⭐", "score", "分數"],
  total: ["🧮", "total", "總和"],
  best: ["🏆", "biggest", "最大值"],
  turns: ["🔄", "turns", "轉彎數"],
  answer: ["📝", "answer", "答案"],
  roads: ["🛣️", "side roads", "岔路數"],
  beat: ["🔀", "switch", "開關"],
};
const TOKEN_LABELS = {
  c: ["🔢", "counter", "計數器"],
  item: ["📦", "item", "項目"],
  input: ["🎛️", "input", "輸入"],
  "in-1": ["🎛️", "input − 1", "輸入 − 1"],
  len: ["📏", "list length", "串列長度"],
};
const label = ([icon, en, zh]) => `${icon} ${L(en, zh)}`;
export const varLabel = (name) => label(VAR_LABELS[name] ?? TOKEN_LABELS[name] ?? ["❔", name, name]);

// What the current mission offers in its dropdowns (set by the app before the workspace loads).
let context = { vars: ["counter"], tokens: [] };
export function setMissionContext(mission) {
  context = { vars: mission.vars?.length ? mission.vars : ["counter"], tokens: mission.tokens ?? [] };
}

const numbers = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => [String(from + i), String(from + i)]);
const named = (prefix = "") => [...context.vars, ...context.tokens].map((name) => [`${prefix}${varLabel(name)}`, name]);
const varOptions = () => context.vars.map((name) => [varLabel(name), name]);
const readableOptions = () => named();
const valueOptions = () => [...numbers(0, 10), ...named()];
const changeOptions = () => [["+1", "1"], ["-1", "-1"], ["+2", "2"], ["-2", "-2"], ...named("+ ")];
export const inputOptions = () => [...numbers(1, 9), [label(TOKEN_LABELS.c), "c"], ...named()];
const CMP = () => [["=", "eq"], ["≠", "ne"], [">", "gt"], ["<", "lt"], ["≥", "ge"], ["≤", "le"]];
const LOGIC = () => [[L("and", "而且"), "and"], [L("or", "或者"), "or"]];
export const SENSORS = () => [
  [L("path ahead ⬆️", "前方有路 ⬆️"), "pathAhead"],
  [L("path to the left ⬅️", "左邊有路 ⬅️"), "pathLeft"],
  [L("path to the right ➡️", "右邊有路 ➡️"), "pathRight"],
  [L("on a gem 💎", "站在寶石上 💎"), "gemHere"],
  [L("at the flag 🏁", "在旗子上 🏁"), "atGoal"],
];

const dropdown = (name, options) => new Blockly.FieldDropdown(options, undefined);
function shape(block, { colour, prev = true, body = false, elseBody = false, parts }) {
  const row = block.appendDummyInput();
  parts.forEach((part) => (typeof part === "string" ? row.appendField(part) : row.appendField(dropdown(part[0], part[1]), part[0])));
  if (body) block.appendStatementInput("DO").appendField(L("do", "做"));
  if (elseBody) block.appendStatementInput("ELSE").appendField(L("else", "否則"));
  block.setPreviousStatement(prev);
  block.setNextStatement(true);
  block.setColour(colour);
}

const DEFS = {
  q_var_set: () => ({ colour: HUE.data, parts: ["📦", ["VAR", varOptions], L("set to", "設為"), ["VALUE", valueOptions]] }),
  q_var_change: () => ({ colour: HUE.data, parts: ["📦", ["VAR", varOptions], L("change by", "改變"), ["VALUE", changeOptions]] }),
  q_var_say: () => ({ colour: HUE.data, parts: [L("💬 say", "💬 說出"), ["VAR", varOptions]] }),
  q_if_cmp: () => ({ colour: HUE.logic, body: true, parts: [L("if", "如果"), ["VAR", readableOptions], ["CMP", CMP], ["VALUE", valueOptions]] }),
  q_ifelse_cmp: () => ({ colour: HUE.logic, body: true, elseBody: true,
    parts: [L("if", "如果"), ["VAR", readableOptions], ["CMP", CMP], ["VALUE", valueOptions]] }),
  q_until_cmp: () => ({ colour: HUE.loop, body: true,
    parts: [L("repeat until", "重複直到"), ["VAR", readableOptions], ["CMP", CMP], ["VALUE", valueOptions]] }),
  q_while: () => ({ colour: HUE.loop, body: true, parts: [L("repeat while", "當"), ["COND", SENSORS], L("", "時重複")] }),
  q_if_logic: () => ({ colour: HUE.logic, body: true, parts: [L("if", "如果"), ["A", SENSORS], ["LOGIC", LOGIC], ["B", SENSORS]] }),
  q_ifelse_logic: () => ({ colour: HUE.logic, body: true, elseBody: true, parts: [L("if", "如果"), ["A", SENSORS], ["LOGIC", LOGIC], ["B", SENSORS]] }),
  q_if_not: () => ({ colour: HUE.logic, body: true, parts: [L("if NOT", "如果 不是"), ["COND", SENSORS]] }),
  q_for_each: () => ({ colour: HUE.list, body: true, parts: [L("for each 📦 item in the list", "對串列裡的每個 📦 項目")] }),
  q_list_add: () => ({ colour: HUE.list, parts: [L("add", "把"), ["VALUE", valueOptions], L("to the 📦 list", "加進 📦 串列")] }),
  q_list_say: () => ({ colour: HUE.list, parts: [L("💬 say the 📦 list", "💬 說出 📦 串列")] }),
  q_report: () => ({ colour: HUE.fn, parts: [L("↩️ report", "↩️ 回傳"), ["VALUE", valueOptions]] }),
};

export function defineAdvancedBlocks(functionOptions) {
  for (const [type, spec] of Object.entries(DEFS)) {
    Blockly.Blocks[type] = { init() { shape(this, spec()); } };
  }
  Blockly.Blocks.q_set_call = {
    init() {
      shape(this, { colour: HUE.fn, parts: ["📦", ["VAR", varOptions], L("set to ↩️", "設為 ↩️"), ["NAME", functionOptions],
        L("with 🎛️", "輸入 🎛️"), ["N", inputOptions]] });
    },
  };
}

export const ADVANCED_LABELS = {
  setVar: () => L("📦 set variable", "📦 變數設為"),
  changeVar: () => L("📦 change variable", "📦 變數改變"),
  sayVar: () => L("💬 say variable", "💬 說出變數"),
  ifCmp: () => L("if … compare", "如果 … 比較"),
  ifElseCmp: () => L("if / else … compare", "如果／否則 … 比較"),
  untilCmp: () => L("repeat until … compare", "重複直到 … 比較"),
  whileSense: () => L("repeat while", "當…時重複"),
  ifLogic: () => L("if … and / or", "如果 … 而且／或者"),
  ifElseLogic: () => L("if / else … and / or", "如果／否則 … 而且／或者"),
  ifNot: () => L("if NOT", "如果 不是"),
  forEach: () => L("for each item", "對每個項目"),
  addList: () => L("add to list", "加進串列"),
  sayList: () => L("say the list", "說出串列"),
  report: () => L("↩️ report", "↩️ 回傳"),
  setCall: () => L("set to ↩️ function", "設為 ↩️ 函式結果"),
};

const CHIPS = {
  setVar: ["q_var_set", HUE.data, "📦 set", "📦 設為"],
  changeVar: ["q_var_change", HUE.data, "📦 change", "📦 改變"],
  sayVar: ["q_var_say", HUE.data, "💬 say", "💬 說出"],
  ifCmp: ["q_if_cmp", HUE.logic, "⚖️ if", "⚖️ 如果"],
  ifElseCmp: ["q_ifelse_cmp", HUE.logic, "⚖️ if / else", "⚖️ 如果／否則"],
  untilCmp: ["q_until_cmp", HUE.loop, "🔁 until ⚖️", "🔁 直到 ⚖️"],
  whileSense: ["q_while", HUE.loop, "🔁 while", "🔁 當…時"],
  ifLogic: ["q_if_logic", HUE.logic, "❓ and / or", "❓ 而且／或者"],
  ifElseLogic: ["q_ifelse_logic", HUE.logic, "❓ and / or / else", "❓ 而且／或者／否則"],
  ifNot: ["q_if_not", HUE.logic, "❓ if NOT", "❓ 如果不是"],
  forEach: ["q_for_each", HUE.list, "📦 for each", "📦 每個項目"],
  addList: ["q_list_add", HUE.list, "📦 add", "📦 加進串列"],
  sayList: ["q_list_say", HUE.list, "💬 say list", "💬 說出串列"],
  report: ["q_report", HUE.fn, "↩️ report", "↩️ 回傳"],
};

// Tap-to-add chips for Part 3 ops; set-to-function gets one chip per function.
export function advancedChips(op, functions, functionLabel) {
  const hex = (hue) => Blockly.utils.colour.hueToHex(hue);
  if (op === "setCall") {
    return functions.map((name) => ({ type: "q_set_call", fields: { NAME: name }, label: `📦 = ↩️ ${functionLabel(name)}`, colour: hex(HUE.fn) }));
  }
  const [type, hue, en, zh] = CHIPS[op];
  return [{ type, label: L(en, zh), colour: hex(hue) }];
}
