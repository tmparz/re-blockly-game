// Advanced Unit 3 · Many Variables: two boxes at once, copying, adding one variable to another,
// a variable as a function input, a 0/1 switch, keeping the biggest, and swapping with a helper box.
const set = (v, value) => ({ op: "setVar", var: v, value });
const add = (v, value = 1) => ({ op: "changeVar", var: v, value });
const say = (v) => ({ op: "sayVar", var: v });
const whileAhead = (body) => ({ op: "whileSense", cond: "pathAhead", do: body });
const grab = (v) => ({ if: "gemHere", do: ["pick", add(v)] });
const WALK = { go: [{ repeatN: true, do: ["move"] }] };
const SPIRAL_A = [">**#", "##.#", "G.*#"];
const SPIRAL_B = [">.*.", "G##*", "****"];
const SPIRAL_C = [">*.**", "    *", " .G *", " *.*."];
const countBoth = (stepVar) => [set(stepVar, 0), set("gems", 0), { until: true, do: ["move", add(stepVar), grab("gems")] }];
const bestRow = (withTotal) => [
  set("gems", 0), set("best", 0), ...(withTotal ? [set("total", 0)] : []),
  { until: true, do: [{ if: "pathAhead", do: ["move", { if: "gemHere", do: ["pick", add("gems"), ...(withTotal ? [add("total")] : [])] }],
    else: [{ op: "ifCmp", var: "gems", cmp: "gt", value: "best", do: [set("best", "gems")] }, set("gems", 0), "right"] }] },
];

export const variables = [
  {
    id: "mv-1",
    title: { en: "Two Boxes", zh: "兩個盒子" },
    story: {
      en: "Robo can use two variables at the same time! Count 👣 steps AND 💎 gems, then say steps first and gems second.",
      zh: "Robo 可以同時用兩個變數！數 👣 步數「和」💎 寶石數，先說步數、再說寶石數。",
    },
    hint: { en: "Set both to 0 → repeat until 🏁 (move, 👣 +1, if on a gem → pick, 💎 +1) → say 👣 → say 💎.", zh: "兩個都設為 0 → 重複直到 🏁（前進、👣 +1、站在寶石上 → 撿起、💎 +1）→ 說出 👣 → 說出 💎。" },
    maps: [[">*..*.G"], [">.**G"]],
    blocks: ["move", "pick", "until", "if", "setVar", "changeVar", "sayVar"],
    vars: ["steps", "gems"],
    expect: "sequence",
    wants: [[6, 2], [4, 2]],
    starter: { main: [set("steps", 0), set("gems", 0)] },
    solution: { main: [...countBoth("steps"), say("steps"), say("gems")] },
  },
  {
    id: "mv-2",
    title: { en: "The Wrong Box", zh: "放錯盒子" },
    story: {
      en: "Robo says too many steps and 0 gems. When it picks up a gem, it adds 1 to the wrong box!",
      zh: "Robo 說的步數太多、寶石卻是 0。撿到寶石時，它把 1 加到錯的盒子裡了！",
    },
    hint: { en: "In the \"on a gem\" part, change the dropdown from 👣 steps to 💎 gems.", zh: "在「站在寶石上」裡面，把下拉選單從 👣 步數改成 💎 寶石數。" },
    maps: [[">.*.*.*G"], [">**.G"]],
    blocks: ["move", "pick", "until", "if", "setVar", "changeVar", "sayVar"],
    vars: ["steps", "gems"],
    expect: "sequence",
    wants: [[7, 3], [4, 2]],
    starter: { main: [set("steps", 0), set("gems", 0), { until: true, do: ["move", add("steps"), grab("steps")] }, say("steps"), say("gems")] },
    solution: { main: [...countBoth("steps"), say("steps"), say("gems")] },
  },
  {
    id: "mv-3",
    title: { en: "Every Box Needs a Start", zh: "每個盒子都要有起點" },
    story: {
      en: "🔋 battery starts at 10 and goes down 1 each step. 💎 gems start at 0. Robo says a battery below zero, so one box is missing its start!",
      zh: "🔋 電量從 10 開始，每走一步減 1。💎 寶石數從 0 開始。Robo 說電量是負的，有一個盒子忘了設定起點！",
    },
    hint: { en: "Add \"set 🔋 battery to 10\" at the top.", zh: "在最上面加上「🔋 電量設為 10」。" },
    maps: [[">*..*G"], [">.***..G"]],
    blocks: ["move", "pick", "until", "if", "setVar", "changeVar", "sayVar"],
    vars: ["battery", "gems"],
    expect: "sequence",
    wants: [[5, 2], [3, 3]],
    starter: { main: [set("gems", 0), { until: true, do: ["move", add("battery", -1), grab("gems")] }, say("battery"), say("gems")] },
    solution: { main: [set("battery", 10), set("gems", 0), { until: true, do: ["move", add("battery", -1), grab("gems")] }, say("battery"), say("gems")] },
  },
  {
    id: "mv-4",
    title: { en: "Moves and Turns", zh: "前進和轉彎" },
    story: {
      en: "Walk each spiral. Count 👣 steps in one box and 🔄 turns in another. Say steps, then turns.",
      zh: "走完每個漩渦。一個盒子數 👣 步數，另一個數 🔄 轉彎數。先說步數，再說轉彎數。",
    },
    hint: { en: "If path ahead → (move, 👣 +1) else → (turn right, 🔄 +1).", zh: "前方有路 →（前進、👣 +1）否則 →（右轉、🔄 +1）。" },
    maps: [[">..#", "##.#", "G..#"], [">...", "G##.", "...."]],
    blocks: ["move", "right", "until", "ifElse", "setVar", "changeVar", "sayVar"],
    vars: ["steps", "turns"],
    expect: "sequence",
    wants: [[6, 2], [9, 3]],
    starter: { main: [] },
    solution: {
      main: [set("steps", 0), set("turns", 0),
        { until: true, do: [{ if: "pathAhead", do: ["move", add("steps")], else: ["right", add("turns")] }] }, say("steps"), say("turns")],
    },
  },
  {
    id: "mv-5",
    title: { en: "Far Gems Score More", zh: "越遠的寶石越多分" },
    story: {
      en: "A gem is worth as many points as the step Robo is on: a gem on step 4 is worth 4. Change ⭐ score by 👣 steps!",
      zh: "寶石的分數等於 Robo 走到第幾步：第 4 步的寶石值 4 分。用 👣 步數來改變 ⭐ 分數！",
    },
    hint: { en: "On a gem: pick up, then change ⭐ score by + 👣 steps.", zh: "站在寶石上：撿起，然後 ⭐ 分數改變 + 👣 步數。" },
    maps: [[">*.*..*G"], [">..**G"]],
    blocks: ["move", "pick", "until", "if", "setVar", "changeVar", "sayVar"],
    vars: ["steps", "score"],
    expect: "wants",
    wants: [10, 7],
    starter: { main: [set("steps", 0), set("score", 0), { until: true, do: ["move", add("steps"), { if: "gemHere", do: ["pick", add("score")] }] }, say("score")] },
    solution: { main: [set("steps", 0), set("score", 0), { until: true, do: ["move", add("steps"), { if: "gemHere", do: ["pick", add("score", "steps")] }] }, say("score")] },
  },
  {
    id: "mv-6",
    title: { en: "Walk Your Gems", zh: "撿幾顆就走幾格" },
    story: {
      en: "The path down is as long as the number of gems in the first hallway. Count 💎 gems, turn right, then walk with 🎛️ 💎 gems.",
      zh: "往下的路，長度等於第一條走廊的寶石數。數 💎 寶石數，右轉，再「走 輸入 💎 寶石數」。",
    },
    hint: { en: "while path ahead (move, if on a gem → pick, +1) → turn right → walk with 💎 gems.", zh: "當前方有路時（前進、站在寶石上 → 撿起、+1）→ 右轉 → 走 輸入 💎 寶石數。" },
    maps: [[">*.*", "###.", "###G", "###."], [">**.*", "####.", "####.", "####G", "####."]],
    blocks: ["move", "right", "pick", "if", "whileSense", "setVar", "changeVar", "def", "callN", "repeatN"],
    vars: ["gems"],
    functions: ["go"],
    starter: { main: [set("gems", 0), whileAhead(["move", grab("gems")]), "right"], defs: WALK },
    solution: { main: [set("gems", 0), whileAhead(["move", grab("gems")]), "right", { call: "go", n: "gems" }], defs: WALK },
  },
  {
    id: "mv-7",
    title: { en: "Save It Before It Changes", zh: "先存起來再說" },
    story: {
      en: "Say how many gems were in the FIRST hallway only. 💎 gems keeps growing, so copy it into 📝 answer at the corner.",
      zh: "只要說出「第一條」走廊有幾顆寶石。💎 寶石數會一直變大，所以在轉角把它複製到 📝 答案裡。",
    },
    hint: { en: "After the first hallway: set 📝 answer to 💎 gems. At the end, say 📝 answer.", zh: "走完第一條走廊後：📝 答案設為 💎 寶石數。最後說出 📝 答案。" },
    maps: [[">*.**", "####*", "####G"], [">.*", "##*", "##*", "##G"]],
    blocks: ["move", "right", "pick", "if", "whileSense", "setVar", "changeVar", "sayVar"],
    vars: ["gems", "answer"],
    expect: "wants",
    wants: [3, 1],
    starter: { main: [set("gems", 0), whileAhead(["move", grab("gems")]), "right", whileAhead(["move", grab("gems")]), say("gems")] },
    solution: {
      main: [set("gems", 0), whileAhead(["move", grab("gems")]), set("answer", "gems"), "right", whileAhead(["move", grab("gems")]), say("answer")],
    },
  },
  {
    id: "mv-8",
    title: { en: "On, Off, On, Off", zh: "開、關、開、關" },
    story: {
      en: "Pick up a gem on every SECOND step. Use 🔀 switch as an on/off box: if it is 0, make it 1; else make it 0 and pick up.",
      zh: "每「兩步」撿一顆寶石。把 🔀 開關當成開／關的盒子：如果是 0 就變 1；否則變回 0 並撿起。",
    },
    hint: { en: "Repeat until 🏁: move, if 🔀 = 0 → set 🔀 to 1, else → set 🔀 to 0, pick up.", zh: "重複直到 🏁：前進，如果 🔀 = 0 → 🔀 設為 1，否則 → 🔀 設為 0、撿起。" },
    maps: [[">******G"]],
    blocks: ["move", "pick", "until", "setVar", "ifElseCmp"],
    vars: ["beat"],
    win: { exactGems: 3 },
    starter: { main: [set("beat", 0), { until: true, do: ["move"] }] },
    solution: {
      main: [set("beat", 0), { until: true, do: ["move", { op: "ifElseCmp", var: "beat", cmp: "eq", value: 0, do: [set("beat", 1)], else: [set("beat", 0), "pick"] }] }],
    },
  },
  {
    id: "mv-9",
    title: { en: "The Biggest Row", zh: "最多的一排" },
    story: {
      en: "Which straight part of the spiral has the most gems? At each corner: if 💎 gems > 🏆 biggest, copy gems into biggest. Then empty 💎 gems.",
      zh: "漩渦的哪一段寶石最多？每到轉角：如果 💎 寶石數 > 🏆 最大值，就把寶石數複製到最大值。然後把 💎 寶石數歸零。",
    },
    hint: { en: "else part: if 💎 > 🏆 → set 🏆 to 💎. Set 💎 to 0. Turn right. At the end, say 🏆.", zh: "否則的部分：如果 💎 > 🏆 → 🏆 設為 💎。💎 設為 0。右轉。最後說出 🏆。" },
    maps: [SPIRAL_A, SPIRAL_B],
    blocks: ["move", "right", "pick", "until", "if", "ifElse", "setVar", "changeVar", "sayVar", "ifCmp"],
    vars: ["gems", "best"],
    expect: "wants",
    wants: [2, 3],
    starter: { main: [set("gems", 0), set("best", 0)] },
    solution: { main: [...bestRow(false), say("best")] },
  },
  {
    id: "mv-10",
    title: { en: "Swap the Boxes", zh: "交換盒子" },
    story: {
      en: "The numbers are in the wrong boxes! Swap 💎 gems and 👣 steps. This program loses a number. Use 📝 answer as a helper box.",
      zh: "數字放錯盒子了！把 💎 寶石數和 👣 步數交換。這個程式會弄丟一個數字，用 📝 答案當作幫忙的盒子。",
    },
    hint: { en: "📝 = 💎 → 💎 = 👣 → 👣 = 📝. Like swapping two cups of juice with an empty cup.", zh: "📝 = 💎 → 💎 = 👣 → 👣 = 📝。就像用一個空杯子交換兩杯果汁。" },
    maps: [[">..G"], [">..G"]],
    blocks: ["move", "setVar"],
    vars: ["gems", "steps", "answer"],
    varStart: [{ gems: 7, steps: 3 }, { gems: 2, steps: 5 }],
    wantVars: [{ gems: 3, steps: 7 }, { gems: 5, steps: 2 }],
    starter: { main: [set("gems", "steps"), set("steps", "gems"), "move", "move", "move"] },
    solution: { main: [set("answer", "gems"), set("gems", "steps"), set("steps", "answer"), "move", "move", "move"] },
  },
  {
    id: "mv-11",
    title: { en: "Gem Report", zh: "寶石報告" },
    story: {
      en: "Boss mission! On three spirals, keep 🧮 total of all gems AND 🏆 the biggest row. Say total, then biggest.",
      zh: "魔王關！在三個漩渦裡，記下全部寶石的 🧮 總和，「和」寶石 🏆 最多的一排。先說總和，再說最大值。",
    },
    hint: { en: "Like \"The Biggest Row\", but on a gem also add 1 to 🧮 total.", zh: "和「最多的一排」一樣，但撿到寶石時也把 🧮 總和加 1。" },
    maps: [SPIRAL_A, SPIRAL_B, SPIRAL_C],
    blocks: ["move", "right", "pick", "until", "if", "ifElse", "setVar", "changeVar", "sayVar", "ifCmp"],
    vars: ["gems", "best", "total"],
    expect: "sequence",
    wants: [[3, 2], [6, 3], [7, 3]],
    starter: { main: [] },
    solution: { main: [...bestRow(true), say("total"), say("best")] },
  },
];

export const VARIABLES_PATH = [
  ["mv-1", "easy", { en: "Two variables can count two things at once.", zh: "兩個變數可以同時數兩種東西。" }],
  ["mv-2", "easy", { en: "Check which box each block changes.", zh: "檢查每個方塊改的是哪個盒子。" }],
  ["mv-3", "easy", { en: "Every variable needs its own starting value.", zh: "每個變數都要有自己的起始值。" }],
  ["mv-4", "easy", { en: "Each box keeps its own count.", zh: "每個盒子各自記自己的數。" }],
  ["mv-5", "medium", { en: "Change one variable by another variable.", zh: "用一個變數去改變另一個變數。" }],
  ["mv-6", "medium", { en: "Send a variable into a function.", zh: "把變數送進函式。" }],
  ["mv-7", "medium", { en: "Copy a variable to save its value for later.", zh: "複製變數，把現在的值存起來。" }],
  ["mv-8", "medium", { en: "A variable can be a switch: 0 = off, 1 = on.", zh: "變數可以當開關：0 = 關，1 = 開。" }],
  ["mv-9", "hard", { en: "Keep the biggest number you have seen.", zh: "記住看過最大的數字。" }],
  ["mv-10", "hard", { en: "To swap two variables you need a helper.", zh: "交換兩個變數，需要一個幫忙的盒子。" }],
  ["mv-11", "hard", { en: "Use everything together.", zh: "全部學到的一起用。" }],
];
