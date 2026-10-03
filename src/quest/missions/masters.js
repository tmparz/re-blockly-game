// Advanced Unit 6 · Function Masters: functions that report an answer, early report, and recursion
// (a function that calls itself with a smaller number until it reaches 0).
const set = (v, value) => ({ op: "setVar", var: v, value });
const add = (v, value = 1) => ({ op: "changeVar", var: v, value });
const say = (v) => ({ op: "sayVar", var: v });
const report = (value) => ({ op: "report", value });
const setCall = (v, name, n) => ({ op: "setCall", var: v, name, n });
const ifInput = (body) => ({ op: "ifCmp", var: "input", cmp: "gt", value: 0, do: body });
const call = (name, n) => ({ call: name, n });
const COUNT_WALK = { countWalk: [set("gems", 0), { repeatN: true, do: ["move", { if: "gemHere", do: ["pick", add("gems")] }] }, report("gems")] };
const DOUBLE = { double: [set("answer", "input"), add("answer", "input"), report("answer")] };
const FIND_GEM = { findGem: [set("steps", 0), { repeatN: true, do: ["move", add("steps"), { if: "gemHere", do: [report("steps")] }] }, report(0)] };
const SHRINK = [">....", "####.", "##G#.", "##..."];
const GO = { go: [{ repeatN: true, do: ["move"] }] };
const GO_GEMS = { go: [{ repeatN: true, do: ["move", { if: "gemHere", do: ["pick", add("gems")] }] }] };
const spiralDef = { spiral: [ifInput([call("go", "input"), "right", call("spiral", "in-1")])] };
const countDef = (after) => ({ count: [ifInput(after
  ? [call("count", "in-1"), { op: "addList", value: "input" }]
  : [{ op: "addList", value: "input" }, call("count", "in-1")])] });

export const masters = [
  {
    id: "fm-1",
    title: { en: "A Function That Answers", zh: "會回答的函式" },
    story: {
      en: "\"count walk\" walks the input and ↩️ reports how many gems it found. Keep its answer: set 📝 answer to ↩️ count walk with 5. Then say it.",
      zh: "「邊走邊數」會走輸入的格數，並 ↩️ 回傳找到幾顆寶石。把答案存起來：📝 答案設為 ↩️ 邊走邊數 輸入 5，然後說出來。",
    },
    hint: { en: "Replace \"do count walk with 5\" with \"set 📝 answer to ↩️ count walk with 5\".", zh: "把「執行 邊走邊數 輸入 5」換成「📝 答案 設為 ↩️ 邊走邊數 輸入 5」。" },
    maps: [[">*.**G"]],
    blocks: ["move", "pick", "if", "def", "callN", "repeatN", "setVar", "changeVar", "sayVar", "report", "setCall"],
    functions: ["countWalk"],
    vars: ["gems", "answer"],
    expect: "wants",
    wants: [3],
    starter: { main: [call("countWalk", 5), say("answer")], defs: COUNT_WALK },
    solution: { main: [setCall("answer", "countWalk", 5), say("answer")], defs: COUNT_WALK },
  },
  {
    id: "fm-2",
    title: { en: "Don't Forget to Report", zh: "別忘了回傳" },
    story: {
      en: "This function counts the gems but never hands the answer back. Add ↩️ report 💎 gems at the end of the function.",
      zh: "這個函式有數寶石，卻沒有把答案交回來。在函式最後加上「↩️ 回傳 💎 寶石數」。",
    },
    hint: { en: "The last block inside \"count walk\" should be ↩️ report 💎 gems.", zh: "「邊走邊數」裡面最後一個方塊，應該是「↩️ 回傳 💎 寶石數」。" },
    maps: [[">**.*.G"], [">.*G"]],
    blocks: ["move", "pick", "if", "def", "callN", "repeatN", "setVar", "changeVar", "sayVar", "report", "setCall"],
    functions: ["countWalk"],
    vars: ["gems", "answer", "steps"],
    expect: "wants",
    wants: [3, 1],
    varStart: [{ steps: 6 }, { steps: 3 }],
    starter: { main: [setCall("answer", "countWalk", "steps"), say("answer")], defs: { countWalk: COUNT_WALK.countWalk.slice(0, 2) } },
    solution: { main: [setCall("answer", "countWalk", "steps"), say("answer")], defs: COUNT_WALK },
  },
  {
    id: "fm-3",
    title: { en: "The Doubling Machine", zh: "變兩倍機器" },
    story: {
      en: "Write \"double\": put the input in 📝 answer, add the input once more, and ↩️ report the answer. Robo doubles 👣 steps and says it.",
      zh: "寫出「變兩倍」：把輸入放進 📝 答案，再加一次輸入，然後 ↩️ 回傳答案。Robo 會把 👣 步數變兩倍並說出來。",
    },
    hint: { en: "double: set 📝 to 🎛️ input → change 📝 by + 🎛️ input → ↩️ report 📝.", zh: "變兩倍：📝 設為 🎛️ 輸入 → 📝 改變 + 🎛️ 輸入 → ↩️ 回傳 📝。" },
    maps: [[">G"], [">G"]],
    blocks: ["move", "def", "setVar", "changeVar", "sayVar", "report", "setCall"],
    functions: ["double"],
    vars: ["steps", "answer", "score"],
    tokens: ["input"],
    varStart: [{ steps: 3 }, { steps: 5 }],
    expect: "wants",
    wants: [6, 10],
    starter: { main: ["move", setCall("score", "double", "steps"), say("score")], defs: { double: [] } },
    solution: { main: ["move", setCall("score", "double", "steps"), say("score")], defs: DOUBLE },
  },
  {
    id: "fm-4",
    title: { en: "Report Early", zh: "提早回傳" },
    story: {
      en: "\"find gem\" walks until it lands on a gem. ↩️ report stops the function RIGHT AWAY, so Robo stops at the first gem. Say how far it was.",
      zh: "「找寶石」會一直走，直到踩到寶石。「↩️ 回傳」會「立刻」結束函式，所以 Robo 會停在第一顆寶石上。說出它有多遠。",
    },
    hint: { en: "Inside the repeat: if on a gem → ↩️ report 👣 steps. Main: set 📝 to ↩️ find gem with 9, then say 📝.", zh: "在重複裡面：站在寶石上 → ↩️ 回傳 👣 步數。主程式：📝 設為 ↩️ 找寶石 輸入 9，再說出 📝。" },
    maps: [[">..*....*"], [">.....*.."]],
    blocks: ["move", "if", "def", "callN", "repeatN", "setVar", "changeVar", "sayVar", "report", "setCall"],
    functions: ["findGem"],
    vars: ["steps", "answer"],
    win: { goal: false, exactGems: 0 },
    expect: "wants",
    wants: [3, 6],
    starter: { main: [setCall("answer", "findGem", 9), say("answer")], defs: { findGem: [set("steps", 0), { repeatN: true, do: ["move", add("steps")] }, report(0)] } },
    solution: { main: [setCall("answer", "findGem", 9), say("answer")], defs: FIND_GEM },
  },
  {
    id: "fm-5",
    title: { en: "A Function That Calls Itself", zh: "呼叫自己的函式" },
    story: {
      en: "\"walk\" moves once, then calls ITSELF. That is called recursion. But it never stops! Send 🎛️ input − 1 so the number gets smaller until it reaches 0.",
      zh: "「走」前進一次，然後呼叫「自己」，這叫做遞迴。可是它停不下來！改成送「🎛️ 輸入 − 1」，數字會越來越小，直到 0。",
    },
    hint: { en: "Inside walk: do walk with 🎛️ input − 1 (not input).", zh: "在「走」裡面：執行 走 輸入 🎛️ 輸入 − 1（不是輸入）。" },
    maps: [[">....G........"]],
    blocks: ["move", "def", "callN", "ifCmp"],
    functions: ["go"],
    tokens: ["input", "in-1"],
    starter: { main: [call("go", 5)], defs: { go: [ifInput(["move", call("go", "input")])] } },
    solution: { main: [call("go", 5)], defs: { go: [ifInput(["move", call("go", "in-1")])] } },
  },
  {
    id: "fm-6",
    title: { en: "The Shrinking Spiral", zh: "越來越小的漩渦" },
    story: {
      en: "4, 3, 2, 1: each side is one shorter. Write \"spiral\": if input > 0, walk the input, turn right, then call spiral with input − 1.",
      zh: "4、3、2、1：每一邊少一格。寫出「漩渦」：如果輸入 > 0，走輸入的格數、右轉，再呼叫「漩渦」並輸入「輸入 − 1」。",
    },
    hint: { en: "spiral: if 🎛️ input > 0 → (walk with 🎛️ input, turn right, spiral with 🎛️ input − 1). Main: spiral with 4.", zh: "漩渦：如果 🎛️ 輸入 > 0 →（走 輸入 🎛️ 輸入、右轉、漩渦 輸入 🎛️ 輸入 − 1）。主程式：漩渦 輸入 4。" },
    maps: [SHRINK],
    blocks: ["move", "right", "def", "callN", "repeatN", "ifCmp"],
    functions: ["go", "spiral"],
    tokens: ["input", "in-1"],
    starter: { main: [call("spiral", 4)], defs: { ...GO, spiral: [] } },
    solution: { main: [call("spiral", 4)], defs: { ...GO, ...spiralDef } },
  },
  {
    id: "fm-7",
    title: { en: "Recursive Countdown", zh: "遞迴倒數" },
    story: {
      en: "Make the list 5, 4, 3, 2, 1 with recursion: \"count\" adds its input to the list, then calls count with input − 1.",
      zh: "用遞迴做出串列 5、4、3、2、1：「數數」先把輸入加進串列，再呼叫「數數」並輸入「輸入 − 1」。",
    },
    hint: { en: "count: if 🎛️ input > 0 → (add 🎛️ input to the list, count with 🎛️ input − 1). Main: count with 5, say the list.", zh: "數數：如果 🎛️ 輸入 > 0 →（把 🎛️ 輸入加進串列、數數 輸入 🎛️ 輸入 − 1）。主程式：數數 輸入 5，說出串列。" },
    maps: [[">G"]],
    blocks: ["move", "def", "callN", "ifCmp", "addList", "sayList"],
    functions: ["count"],
    tokens: ["input", "in-1"],
    expect: "wants",
    wants: [[5, 4, 3, 2, 1]],
    starter: { main: ["move", call("count", 5), "sayList"], defs: { count: [] } },
    solution: { main: ["move", call("count", 5), "sayList"], defs: countDef(false) },
  },
  {
    id: "fm-8",
    title: { en: "Before or After?", zh: "之前還是之後？" },
    story: {
      en: "Same function, but now we want 1, 2, 3, 4, 5. Move \"add input to the list\" AFTER the call to itself. Why does the order flip?",
      zh: "同一個函式，但這次要 1、2、3、4、5。把「把輸入加進串列」搬到呼叫自己的「後面」。為什麼順序會反過來？",
    },
    hint: { en: "count: if input > 0 → (count with input − 1, THEN add input to the list).", zh: "數數：如果輸入 > 0 →（先 數數 輸入 輸入 − 1，「再」把輸入加進串列）。" },
    maps: [[">G"]],
    blocks: ["move", "def", "callN", "ifCmp", "addList", "sayList"],
    functions: ["count"],
    tokens: ["input", "in-1"],
    expect: "wants",
    wants: [[1, 2, 3, 4, 5]],
    starter: { main: ["move", call("count", 5), "sayList"], defs: countDef(false) },
    solution: { main: ["move", call("count", 5), "sayList"], defs: countDef(true) },
  },
  {
    id: "fm-9",
    title: { en: "Spiral Treasure Report", zh: "漩渦寶藏報告" },
    story: {
      en: "Boss mission! Walk the shrinking spiral with recursion, pick up every gem on the way, and say how many 💎 gems you found.",
      zh: "魔王關！用遞迴走完越來越小的漩渦，撿起路上每一顆寶石，說出找到幾顆 💎 寶石。",
    },
    hint: { en: "walk: repeat input (move, if on a gem → pick, 💎 +1). spiral: like \"The Shrinking Spiral\". Main: 💎 = 0, spiral 4, say 💎.", zh: "走：重複 輸入 次（前進，站在寶石上 → 撿起、💎 +1）。漩渦：和「越來越小的漩渦」一樣。主程式：💎 = 0、漩渦 4、說出 💎。" },
    maps: [[">.*.*", "####.", "##G#*", "##*.*"]],
    blocks: ["move", "right", "pick", "if", "def", "callN", "repeatN", "ifCmp", "setVar", "changeVar", "sayVar"],
    functions: ["go", "spiral"],
    vars: ["gems"],
    tokens: ["input", "in-1"],
    expect: "wants",
    wants: [5],
    starter: { main: [] },
    solution: { main: [set("gems", 0), call("spiral", 4), say("gems")], defs: { ...GO_GEMS, ...spiralDef } },
  },
];

export const MASTERS_PATH = [
  ["fm-1", "easy", { en: "A function can hand back an answer (report).", zh: "函式可以把答案交回來（回傳）。" }],
  ["fm-2", "easy", { en: "No report, no answer.", zh: "沒有回傳，就沒有答案。" }],
  ["fm-3", "medium", { en: "Write a function that calculates and reports.", zh: "寫一個會計算並回傳的函式。" }],
  ["fm-4", "medium", { en: "Report ends the function right away.", zh: "回傳會立刻結束函式。" }],
  ["fm-5", "medium", { en: "Recursion: a function calls itself with a smaller number.", zh: "遞迴：函式用更小的數字呼叫自己。" }],
  ["fm-6", "hard", { en: "Recursion can draw patterns that shrink.", zh: "遞迴可以畫出越來越小的圖案。" }],
  ["fm-7", "hard", { en: "Recursion can build a list.", zh: "遞迴可以做出串列。" }],
  ["fm-8", "hard", { en: "Work before the call or after it: the order flips.", zh: "在呼叫之前做，還是之後做：順序會反過來。" }],
  ["fm-9", "hard", { en: "Use everything together.", zh: "全部學到的一起用。" }],
];
