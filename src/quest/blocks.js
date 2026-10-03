// Blockly blocks for Quest Lab. Every field is a dropdown, so no on-screen keyboard is needed.
import { lang } from "./i18n.js";
import { ADVANCED_LABELS, advancedChips, defineAdvancedBlocks, inputOptions } from "./blocks-advanced.js";

const L = (en, zh) => (lang === "zh" ? zh : en);

export const FUNCTION_LABELS = {
  hop: ["🐸", "hop", "跳兩格"],
  corner: ["↪️", "corner", "轉角"],
  stairs: ["🪜", "stairs", "下樓梯"],
  row: ["💎", "gem row", "寶石列"],
  room: ["🚪", "visit room", "進房間"],
  turnAround: ["🔄", "turn around", "向後轉"],
  hall: ["🛤️", "hallway", "走廊"],
  climb: ["🧗", "climb", "爬一階"],
  tower: ["🏰", "tower", "城塔"],
  dash: ["🏃", "dash", "衝三格"],
  grab: ["🧺", "grab", "走走撿"],
  rock: ["🪨", "over rock", "翻石頭"],
  gemStep: ["💎", "gem step", "階梯撿寶"],
  pocketUp: ["⤴️", "up pocket", "上口袋"],
  pocketDown: ["⤵️", "down pocket", "下口袋"],
  hurdle: ["🏅", "hurdle", "跨欄"],
  walk: ["🧭", "smart walk", "聰明走"],
  peak: ["⛰️", "peak", "爬山頭"],
  up: ["↗️", "up", "上一階"],
  down: ["↘️", "down", "下一階"],
  smart: ["🤖", "smart step", "聰明一步"],
  countGem: ["🧮", "count gem", "撿起並數"],
  go: ["🚶", "walk", "走"],
  turns: ["🔃", "turn right ×", "右轉幾次"],
};

const functionLabel = (name) => {
  const [icon, en, zh] = FUNCTION_LABELS[name] ?? ["🧩", name, name];
  return `${icon} ${L(en, zh)}`;
};

let functionNames = ["hop"];
export function setFunctionNames(names = []) {
  functionNames = names.length ? names : ["hop"];
}
const functionOptions = () => functionNames.map((name) => [functionLabel(name), name]);

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));
const numberOptions = (values) => values.map((value) => [value, value]);
const CONDITIONS = () => [
  [L("path ahead ⬆️", "前方有路 ⬆️"), "pathAhead"],
  [L("path to the left ⬅️", "左邊有路 ⬅️"), "pathLeft"],
  [L("path to the right ➡️", "右邊有路 ➡️"), "pathRight"],
  [L("on a gem 💎", "站在寶石上 💎"), "gemHere"],
];

const COLOURS = { start: 145, move: 205, turn: 260, gem: 38, loop: 42, logic: 190, fn: 290, data: 330 };
const statement = (type, message0, colour, args0) => ({
  type, message0, args0, colour, previousStatement: null, nextStatement: null,
});
const container = (type, message0, args0, colour, extra = {}) => ({
  ...statement(type, message0, colour, args0),
  message1: L("do %1", "做 %1"),
  args1: [{ type: "input_statement", name: "DO" }],
  ...extra,
});

export const BLOCK_LABELS = {
  move: () => L("move forward", "前進"),
  left: () => L("turn left ↺", "左轉 ↺"),
  right: () => L("turn right ↻", "右轉 ↻"),
  pick: () => L("pick up 💎", "撿起 💎"),
  say: () => L("💬 say counter", "💬 說出計數器"),
  repeat: () => L("repeat", "重複"),
  until: () => L("repeat until 🏁", "重複直到 🏁"),
  untilCount: () => L("repeat until counter =", "重複直到計數器 ="),
  if: () => L("if", "如果"),
  ifElse: () => L("if / else", "如果／否則"),
  def: () => L("define", "定義"),
  call: () => L("🧩 do function", "🧩 執行函式"),
  callN: () => L("🎛️ do function with input", "🎛️ 執行函式並輸入"),
  repeatN: () => L("repeat 🎛️ input times", "重複 🎛️ 輸入 次"),
  set: () => L("set counter", "計數器設為"),
  change: () => L("change counter", "計數器改變"),
  ...ADVANCED_LABELS,
};

export function defineQuestBlocks() {
  Blockly.defineBlocksWithJsonArray([
    { type: "q_start", message0: L("▶ when Run", "▶ 按下執行時"), nextStatement: null, colour: COLOURS.start },
    statement("q_move", BLOCK_LABELS.move(), COLOURS.move),
    statement("q_left", BLOCK_LABELS.left(), COLOURS.turn),
    statement("q_right", BLOCK_LABELS.right(), COLOURS.turn),
    statement("q_pick", BLOCK_LABELS.pick(), COLOURS.gem),
    statement("q_say", BLOCK_LABELS.say(), COLOURS.data),
    container("q_repeat", L("repeat %1 times", "重複 %1 次"),
      [{ type: "field_dropdown", name: "TIMES", options: numberOptions(range(2, 10)) }], COLOURS.loop),
    container("q_until", BLOCK_LABELS.until(), undefined, COLOURS.loop),
    container("q_repeat_n", L("repeat 🎛️ input times", "重複 🎛️ 輸入 次"), undefined, COLOURS.fn),
    container("q_until_count", L("repeat until 🔢 counter = %1", "重複直到 🔢 計數器 = %1"),
      [{ type: "field_dropdown", name: "N", options: numberOptions(range(0, 10)) }], COLOURS.loop),
    container("q_if", L("if %1", "如果 %1"), [{ type: "field_dropdown", name: "COND", options: CONDITIONS() }], COLOURS.logic),
    container("q_ifelse", L("if %1", "如果 %1"), [{ type: "field_dropdown", name: "COND", options: CONDITIONS() }],
      COLOURS.logic, { message2: L("else %1", "否則 %1"), args2: [{ type: "input_statement", name: "ELSE" }] }),
    statement("q_set", L("🔢 set counter to %1", "🔢 計數器設為 %1"), COLOURS.data,
      [{ type: "field_dropdown", name: "N", options: numberOptions(range(0, 10)) }]),
    statement("q_change", L("🔢 change counter by %1", "🔢 計數器改變 %1"), COLOURS.data,
      [{ type: "field_dropdown", name: "N", options: [["+1", "1"], ["-1", "-1"], ["+2", "2"]] }]),
  ]);

  Blockly.Blocks.q_def = {
    init() {
      this.appendDummyInput()
        .appendField(L("🧩 define", "🧩 定義"))
        .appendField(new Blockly.FieldDropdown(functionOptions), "NAME");
      this.appendStatementInput("DO");
      this.setColour(COLOURS.fn);
      this.setTooltip(L("The steps inside have a name. Call it to run them.", "裡面的步驟有了名字，呼叫它就會執行。"));
    },
  };
  Blockly.Blocks.q_call_n = {
    init() {
      this.appendDummyInput()
        .appendField(L("do", "執行"))
        .appendField(new Blockly.FieldDropdown(functionOptions), "NAME")
        .appendField(L("with 🎛️", "輸入 🎛️"))
        .appendField(new Blockly.FieldDropdown(inputOptions), "N");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(COLOURS.fn);
      this.setTooltip(L("Sends a number into the function. Inside, \"repeat input times\" uses it.", "把一個數字送進函式，函式裡的「重複 輸入 次」會用到它。"));
    },
  };
  defineAdvancedBlocks(functionOptions);
  Blockly.Blocks.q_call = {
    init() {
      this.appendDummyInput()
        .appendField(L("do", "執行"))
        .appendField(new Blockly.FieldDropdown(functionOptions), "NAME");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(COLOURS.fn);
    },
  };
}

const TYPES = {
  move: "q_move", left: "q_left", right: "q_right", pick: "q_pick", say: "q_say",
  repeat: "q_repeat", until: "q_until", untilCount: "q_until_count", if: "q_if", ifElse: "q_ifelse",
  set: "q_set", change: "q_change", repeatN: "q_repeat_n",
};

const CHIP_COLOUR = {
  move: COLOURS.move, left: COLOURS.turn, right: COLOURS.turn, pick: COLOURS.gem, say: COLOURS.data,
  repeat: COLOURS.loop, until: COLOURS.loop, untilCount: COLOURS.loop, if: COLOURS.logic, ifElse: COLOURS.logic,
  set: COLOURS.data, change: COLOURS.data, repeatN: COLOURS.fn,
};
const CHIP_LABEL = {
  move: () => L("⬆️ move", "⬆️ 前進"),
  left: () => L("↺ left", "↺ 左轉"),
  right: () => L("↻ right", "↻ 右轉"),
  pick: () => L("💎 pick up", "💎 撿起"),
  say: () => L("💬 say", "💬 說出"),
  repeat: () => L("🔁 repeat", "🔁 重複"),
  until: () => L("🔁 until 🏁", "🔁 直到 🏁"),
  untilCount: () => L("🔁 until =", "🔁 直到 ="),
  if: () => L("❓ if", "❓ 如果"),
  ifElse: () => L("❓ if / else", "❓ 如果／否則"),
  set: () => L("🔢 set", "🔢 設為"),
  change: () => L("🔢 change", "🔢 改變"),
  repeatN: () => L("🔁 input times", "🔁 輸入 次"),
};

// Chips for the tap-to-add bar, in the same order as the toolbox.
export function quickItems(mission) {
  const hex = (hue) => Blockly.utils.colour.hueToHex(hue);
  const items = [];
  for (const op of mission.blocks) {
    if (op === "def" || op === "call") {
      mission.functions.forEach((name) => items.push({
        type: op === "def" ? "q_def" : "q_call",
        fields: { NAME: name },
        unique: op === "def",
        label: op === "def" ? `${L("define", "定義")} ${functionLabel(name)}` : functionLabel(name),
        colour: hex(COLOURS.fn),
      }));
    } else if (op === "callN") {
      mission.functions.forEach((name) => items.push({
        type: "q_call_n", fields: { NAME: name }, label: `${functionLabel(name)} 🎛️`, colour: hex(COLOURS.fn),
      }));
    } else if (!TYPES[op]) {
      items.push(...advancedChips(op, mission.functions ?? [], functionLabel));
    } else {
      items.push({ type: TYPES[op], label: CHIP_LABEL[op](), colour: hex(CHIP_COLOUR[op]) });
    }
  }
  return items;
}
