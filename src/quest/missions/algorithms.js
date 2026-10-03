// Advanced Unit 5 · Algorithm Race: programs that all reach the goal can still be better or worse.
// A battery limit (maxMoves) turns "which way is faster?" into something Robo can test.
const iff = (cond, yes, no) => ({ if: cond, do: yes, else: no });
const set = (v, value) => ({ op: "setVar", var: v, value });
const add = (v, value = 1) => ({ op: "changeVar", var: v, value });
const say = (v) => ({ op: "sayVar", var: v });
const loop = (...body) => ({ until: true, do: body });
const RULES = {
  rightHand: iff("pathRight", ["right", "move"], [iff("pathAhead", ["move"], ["left"])]),
  leftHand: iff("pathLeft", ["left", "move"], [iff("pathAhead", ["move"], ["right"])]),
  straightRight: iff("pathAhead", ["move"], [iff("pathRight", ["right"], ["left"])]),
};
const MAZE = ["move", "left", "right", "until", "ifElse"];
const countGems = (rule) => [set("gems", 0), loop(RULES[rule], { if: "gemHere", do: ["pick", add("gems")] }), say("gems")];

export const algorithms = [
  {
    id: "al-1",
    title: { en: "Two Ways There", zh: "兩條路都到得了" },
    story: {
      en: "This program follows the wall with its left hand. It reaches the flag… in 12 moves! The battery only lasts 2. Find a shorter way.",
      zh: "這個程式用左手摸著牆走，可以走到旗子……但要 12 步！電池只夠走 2 步，找一條更短的路。",
    },
    hint: { en: "Look at the map: the flag is just below Robo. Turn right and move twice.", zh: "看地圖：旗子就在 Robo 下面。右轉，前進兩次。" },
    maps: [[">.....", ".####.", "G....."]],
    blocks: MAZE,
    win: { maxMoves: 2 },
    starter: { main: [loop(RULES.leftHand)] },
    solution: { main: ["right", "move", "move"] },
  },
  {
    id: "al-2",
    title: { en: "Ask in a Different Order", zh: "換個順序問" },
    story: {
      en: "Right-hand wall following takes 8 moves here. Keep the same questions, but ask \"path ahead?\" FIRST. It only takes 4!",
      zh: "右手貼牆在這裡要走 8 步。問題一樣，但「先」問「前方有路嗎？」，只要 4 步！",
    },
    hint: { en: "if path ahead → move, else (if path right → right, else left).", zh: "前方有路 → 前進，否則（右邊有路 → 右轉，否則左轉）。" },
    maps: [[">...G", ".###.", "....."]],
    blocks: MAZE,
    win: { maxMoves: 4 },
    require: { ifElse: 2 },
    starter: { main: [loop(RULES.rightHand)] },
    solution: { main: [loop(RULES.straightRight)] },
  },
  {
    id: "al-3",
    title: { en: "Every Rule Wins Somewhere", zh: "每種規則都有贏的地方" },
    story: {
      en: "On this map, \"straight first\" takes 8 moves, but left-hand wall following takes only 4. Switch the rule!",
      zh: "在這張地圖，「先直走」要 8 步，但左手貼牆只要 4 步。換個規則！",
    },
    hint: { en: "if path left → (left, move), else (if path ahead → move, else right).", zh: "左邊有路 →（左轉、前進），否則（前方有路 → 前進，否則右轉）。" },
    maps: [["..G..", ".###.", ">...."]],
    blocks: MAZE,
    win: { maxMoves: 4 },
    require: { ifElse: 2 },
    starter: { main: [loop(RULES.straightRight)] },
    solution: { main: [loop(RULES.leftHand)] },
  },
  {
    id: "al-4",
    title: { en: "Stop When You Find It", zh: "找到就停" },
    story: {
      en: "Robo needs just ONE gem. This program keeps searching after it finds one and wastes battery. Stop as soon as 💎 gems ≥ 1.",
      zh: "Robo 只需要「一顆」寶石。這個程式找到之後還一直找，浪費電。只要 💎 寶石數 ≥ 1 就停下來。",
    },
    hint: { en: "Set 💎 to 0 → repeat until 💎 ≥ 1 (move, if on a gem → pick up, +1).", zh: "💎 設為 0 → 重複直到 💎 ≥ 1（前進，站在寶石上 → 撿起、+1）。" },
    maps: [[">..*.*.*.."], [">.*......*"]],
    blocks: ["move", "pick", "if", "whileSense", "setVar", "changeVar", "untilCmp"],
    vars: ["gems"],
    win: { goal: false, exactGems: 1, maxMoves: 3 },
    starter: { main: [{ op: "whileSense", cond: "pathAhead", do: ["move", { if: "gemHere", do: ["pick"] }] }] },
    solution: {
      main: [set("gems", 0), { op: "untilCmp", var: "gems", cmp: "ge", value: 1, do: ["move", { if: "gemHere", do: ["pick", add("gems")] }] }],
    },
  },
  {
    id: "al-5",
    title: { en: "Don't Count What You Know", zh: "知道了就不用再數" },
    story: {
      en: "How many items are in the list? You could count them one by one, but the list already knows: use 📏 list length.",
      zh: "串列裡有幾個項目？可以一個一個數，但串列自己就知道：用 📏 串列長度。",
    },
    hint: { en: "move → set 🔢 counter to 📏 list length → say 🔢 counter.", zh: "前進 → 🔢 計數器設為 📏 串列長度 → 說出 🔢 計數器。" },
    maps: [[">G"], [">G"]],
    lists: [[4, 8, 1], [2, 2, 5, 7, 3]],
    blocks: ["move", "forEach", "setVar", "changeVar", "sayVar"],
    vars: ["counter"],
    tokens: ["len"],
    expect: "wants",
    wants: [3, 5],
    maxBlocks: 4,
    starter: { main: ["move", set("counter", 0), { op: "forEach", do: [add("counter")] }, say("counter")] },
    solution: { main: ["move", set("counter", "len"), say("counter")] },
  },
  {
    id: "al-6",
    title: { en: "Battery Treasure Hunt", zh: "省電尋寶" },
    story: {
      en: "Boss mission! On all three maps, reach the flag in 5 moves or fewer AND say how many gems you found. Test the rules to find the one that fits.",
      zh: "魔王關！三張地圖都要在 5 步以內走到旗子，「而且」說出找到幾顆寶石。試試不同規則，找出最適合的那一個。",
    },
    hint: { en: "Try left-hand wall following, and check for a gem after every step.", zh: "試試左手貼牆，每一步之後都檢查有沒有寶石。" },
    maps: [[".*G..", "*###.", ">...."], ["##G##", "##*##", "##...", ">.*..", "##..."], ["G....", "*###.", "*#...", "*#.##", ">...."]],
    blocks: [...MAZE, "pick", "if", "setVar", "changeVar", "sayVar"],
    vars: ["gems"],
    win: { maxMoves: 5 },
    expect: "wants",
    wants: [2, 2, 3],
    starter: { main: countGems("rightHand") },
    solution: { main: countGems("leftHand") },
  },
];

export const ALGORITHMS_PATH = [
  ["al-1", "easy", { en: "Two programs can both work, but one can be shorter.", zh: "兩個程式都能過關，但其中一個可以更短。" }],
  ["al-2", "easy", { en: "The order of your questions changes the route.", zh: "問問題的順序，會改變走的路。" }],
  ["al-3", "medium", { en: "No rule is best everywhere: test and compare.", zh: "沒有一種規則到哪裡都最好：測試、比較。" }],
  ["al-4", "medium", { en: "Stop searching once you have what you need.", zh: "找到需要的，就停止搜尋。" }],
  ["al-5", "hard", { en: "Use what you already know instead of counting again.", zh: "用已經知道的資訊，不用再數一次。" }],
  ["al-6", "hard", { en: "Choose the algorithm that fits the job.", zh: "選出最適合這個工作的演算法。" }],
];
