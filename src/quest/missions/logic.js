// Advanced Unit 2 · Compare & Logic: named variables, > < ≥, while, NOT, AND / OR, and ifs inside ifs.
const set = (v, value) => ({ op: "setVar", var: v, value });
const add = (v, value = 1) => ({ op: "changeVar", var: v, value });
const say = (v) => ({ op: "sayVar", var: v });
const ifCmp = (v, cmp, value, body) => ({ op: "ifCmp", var: v, cmp, value, do: body });
const untilCmp = (v, cmp, value, body) => ({ op: "untilCmp", var: v, cmp, value, do: body });
const whileSense = (cond, body) => ({ op: "whileSense", cond, do: body });
const pickIfGem = { if: "gemHere", do: ["pick"] };
const CROSS_A = ["#.#.#.##", ">......G", "##.#####"];
const CROSS_B = ["##.#.##", ">.....G", "##.##.#"];
const CROSS_C = ["#.#.#.#", ">.....G", "#.#.###"];
const countSides = (logic) => [
  set("roads", 0),
  { until: true, do: ["move", { op: "ifLogic", a: "pathLeft", logic, b: "pathRight", do: [add("roads")] }] },
  say("roads"),
];

export const logic = [
  {
    id: "lg-1",
    title: { en: "Give It a Name", zh: "幫變數取名字" },
    story: {
      en: "In Part 3, variables have names! This one is called 👣 steps. Count every step to the flag and say the number.",
      zh: "第三階段的變數有名字了！這個叫做 👣 步數。數一數走到旗子的每一步，然後說出來。",
    },
    hint: { en: "Set 👣 steps to 0 → repeat until 🏁 (move, change 👣 steps by +1) → say 👣 steps.", zh: "👣 步數設為 0 → 重複直到 🏁（前進、👣 步數改變 +1）→ 說出 👣 步數。" },
    maps: [[">...G"], [">......G"]],
    blocks: ["move", "until", "setVar", "changeVar", "sayVar"],
    vars: ["steps"],
    expect: "steps",
    starter: { main: [set("steps", 0)] },
    solution: { main: [set("steps", 0), { until: true, do: ["move", add("steps")] }, say("steps")] },
  },
  {
    id: "lg-2",
    title: { en: "Stop at Four", zh: "走到 4 就停" },
    story: {
      en: "The tunnel keeps going after the flag. Use \"repeat until 👣 steps = 4\" so Robo stops in the right place.",
      zh: "隧道在旗子後面還有路。用「重複直到 👣 步數 = 4」，讓 Robo 停在對的地方。",
    },
    hint: { en: "Set steps to 0 → repeat until 👣 steps = 4 (move, +1).", zh: "步數設為 0 → 重複直到 👣 步數 = 4（前進、+1）。" },
    maps: [[">...G...."]],
    blocks: ["move", "setVar", "changeVar", "untilCmp"],
    vars: ["steps"],
    require: { untilCmp: 1 },
    maxBlocks: 5,
    starter: { main: [] },
    solution: { main: [set("steps", 0), untilCmp("steps", "eq", 4, ["move", add("steps")])] },
  },
  {
    id: "lg-3",
    title: { en: "Jumping Past Five", zh: "跳過了 5" },
    story: {
      en: "Each gem is worth 2 points: 0, 2, 4, 6… Robo should stop once it has 5 points or more, but \"= 5\" never happens! Fix the comparison.",
      zh: "每顆寶石 2 分：0、2、4、6……Robo 應該在 5 分「以上」就停，可是分數永遠不會「= 5」！修正比較方式。",
    },
    hint: { en: "Change \"=\" to \"≥\" (greater than or equal).", zh: "把「=」改成「≥」（大於或等於）。" },
    maps: [[">******"]],
    blocks: ["move", "pick", "setVar", "changeVar", "untilCmp"],
    vars: ["score"],
    win: { exactGems: 3 },
    starter: { main: [set("score", 0), untilCmp("score", "eq", 5, ["move", "pick", add("score", 2)])] },
    solution: { main: [set("score", 0), untilCmp("score", "ge", 5, ["move", "pick", add("score", 2)])] },
  },
  {
    id: "lg-4",
    title: { en: "Less Than Two", zh: "少於 2 顆" },
    story: {
      en: "Robo's pocket holds only 2 gems. Pick up a gem only if 💎 gems < 2, and still walk all the way to the flag.",
      zh: "Robo 的口袋只裝得下 2 顆寶石。只有在 💎 寶石數 < 2 時才撿，而且還是要走到旗子。",
    },
    hint: { en: "Repeat until 🏁: move, then if 💎 gems < 2 → (if on a gem → pick up, +1).", zh: "重複直到 🏁：前進，然後如果 💎 寶石數 < 2 →（如果站在寶石上 → 撿起、+1）。" },
    maps: [[">*.**.*G"], [">.***G"]],
    blocks: ["move", "pick", "until", "if", "setVar", "changeVar", "ifCmp"],
    vars: ["gems"],
    win: { exactGems: 2 },
    require: { ifCmp: 1 },
    starter: { main: [set("gems", 0), { until: true, do: ["move", { if: "gemHere", do: ["pick", add("gems")] }] }] },
    solution: {
      main: [set("gems", 0), { until: true, do: ["move", ifCmp("gems", "lt", 2, [{ if: "gemHere", do: ["pick", add("gems")] }])] }],
    },
  },
  {
    id: "lg-5",
    title: { en: "Is 3 Bigger Than 3?", zh: "3 比 3 大嗎？" },
    story: {
      en: "Rule: start picking up gems from step 3. Robo only gets 2 gems, but it should get 3! Is \"> 3\" the right test on step 3?",
      zh: "規則：從第 3 步開始撿寶石。Robo 只撿到 2 顆，應該要 3 顆！在第 3 步時，「> 3」是對的嗎？",
    },
    hint: { en: "3 > 3 is false. Use \"≥ 3\" so step 3 counts too.", zh: "3 > 3 不成立。用「≥ 3」，第 3 步才會算進去。" },
    maps: [[">*****G"]],
    blocks: ["move", "pick", "until", "if", "setVar", "changeVar", "ifCmp"],
    vars: ["steps"],
    win: { exactGems: 3 },
    starter: { main: [set("steps", 0), { until: true, do: ["move", add("steps"), ifCmp("steps", "gt", 3, [pickIfGem])] }] },
    solution: { main: [set("steps", 0), { until: true, do: ["move", add("steps"), ifCmp("steps", "ge", 3, [pickIfGem])] }] },
  },
  {
    id: "lg-6",
    title: { en: "Square in an Open Field", zh: "空地上走正方形" },
    story: {
      en: "No walls to guide Robo! Walk a square with sides of 3: if 👣 steps < 3 move, else turn right and start counting again.",
      zh: "沒有牆可以靠！走一個邊長 3 的正方形：如果 👣 步數 < 3 就前進，否則右轉，重新開始數。",
    },
    hint: { en: "Repeat until 🏁: if 👣 steps < 3 → (move, +1) else → (turn right, set 👣 steps to 0).", zh: "重複直到 🏁：如果 👣 步數 < 3 →（前進、+1）否則 →（右轉、👣 步數設為 0）。" },
    maps: [[">....", ".....", ".....", ".G...", "....."]],
    blocks: ["move", "right", "until", "setVar", "changeVar", "ifElseCmp"],
    vars: ["steps"],
    require: { ifElseCmp: 1 },
    starter: { main: [set("steps", 0)] },
    solution: {
      main: [set("steps", 0), { until: true, do: [{ op: "ifElseCmp", var: "steps", cmp: "lt", value: 3,
        do: ["move", add("steps")], else: ["right", set("steps", 0)] }] }],
    },
  },
  {
    id: "lg-7",
    title: { en: "Repeat While", zh: "當…時重複" },
    story: {
      en: "\"repeat while\" keeps going AS LONG AS something is true. Move while there is a path ahead, turn right, and do it again.",
      zh: "「當…時重複」會在條件「成立的時候」一直做。前方有路時一直前進，右轉，再做一次。",
    },
    hint: { en: "while path ahead (move) → turn right → while path ahead (move).", zh: "當前方有路時重複（前進）→ 右轉 → 當前方有路時重複（前進）。" },
    maps: [[">....", "####.", "####.", "####G"], [">..", "##.", "##.", "##.", "##G"]],
    blocks: ["move", "right", "whileSense"],
    require: { whileSense: 2 },
    starter: { main: [whileSense("pathAhead", ["move"])] },
    solution: { main: [whileSense("pathAhead", ["move"]), "right", whileSense("pathAhead", ["move"])] },
  },
  {
    id: "lg-8",
    title: { en: "If NOT", zh: "如果「不是」" },
    story: {
      en: "NOT flips a question. \"if NOT path ahead\" means \"if there is a wall in front\". Use it to walk every spiral.",
      zh: "「不是」會把問題反過來。「如果 不是 前方有路」就是「如果前面是牆」。用它走完每個漩渦。",
    },
    hint: { en: "Repeat until 🏁: if NOT path ahead → turn right. Then move.", zh: "重複直到 🏁：如果 不是 前方有路 → 右轉。然後前進。" },
    maps: [[">..#", "##.#", "G..#"], [">...", "G##.", "...."]],
    blocks: ["move", "right", "until", "ifNot"],
    require: { ifNot: 1 },
    starter: { main: [{ until: true, do: ["move"] }] },
    solution: { main: [{ until: true, do: [{ op: "ifNot", cond: "pathAhead", do: ["right"] }, "move"] }] },
  },
  {
    id: "lg-9",
    title: { en: "Side Roads (OR)", zh: "岔路（或者）" },
    story: {
      en: "Count the side roads: after each step, if there is a path left OR a path right, add 1. Say the number at the flag.",
      zh: "數一數岔路：每走一步，如果左邊有路「或者」右邊有路，就加 1。到旗子時說出數字。",
    },
    hint: { en: "Repeat until 🏁: move, if path left OR path right → 🛣️ +1. Then say.", zh: "重複直到 🏁：前進，如果 左邊有路 或者 右邊有路 → 🛣️ +1。最後說出。" },
    maps: [CROSS_A, CROSS_B],
    blocks: ["move", "until", "setVar", "changeVar", "sayVar", "ifLogic"],
    vars: ["roads"],
    expect: "wants",
    wants: [4, 3],
    starter: { main: [set("roads", 0), { until: true, do: ["move"] }, say("roads")] },
    solution: { main: countSides("or") },
  },
  {
    id: "lg-10",
    title: { en: "Real Crossroads (AND)", zh: "十字路口（而且）" },
    story: {
      en: "A crossroads has a path on BOTH sides. This program counts too many! Change OR to AND.",
      zh: "十字路口是「兩邊」都有路。這個程式數太多了！把「或者」改成「而且」。",
    },
    hint: { en: "OR: at least one side. AND: both sides at the same time.", zh: "或者：至少一邊有路。而且：兩邊同時有路。" },
    maps: [CROSS_B, CROSS_C],
    blocks: ["move", "until", "setVar", "changeVar", "sayVar", "ifLogic"],
    vars: ["roads"],
    expect: "wants",
    wants: [1, 2],
    starter: { main: countSides("or") },
    solution: { main: countSides("and") },
  },
  {
    id: "lg-11",
    title: { en: "An If Inside an If", zh: "如果裡面的如果" },
    story: {
      en: "Gems are worth 2 points, and Robo may keep at most 4 points. On a gem, check a second question: is ⭐ score < 4? Only then pick it up.",
      zh: "每顆寶石 2 分，Robo 最多只能有 4 分。站在寶石上時，再問第二個問題：⭐ 分數 < 4 嗎？是的話才撿。",
    },
    hint: { en: "Repeat until 🏁: move, if on a gem → (if ⭐ score < 4 → pick up, +2).", zh: "重複直到 🏁：前進，如果站在寶石上 →（如果 ⭐ 分數 < 4 → 撿起、+2）。" },
    maps: [[">.*.**.*G"], [">***G"]],
    blocks: ["move", "pick", "until", "if", "setVar", "changeVar", "ifCmp"],
    vars: ["score"],
    win: { exactGems: 2 },
    starter: { main: [set("score", 0)] },
    solution: {
      main: [set("score", 0), { until: true, do: ["move", { if: "gemHere", do: [ifCmp("score", "lt", 4, ["pick", add("score", 2)])] }] }],
    },
  },
  {
    id: "lg-12",
    title: { en: "Rules of the Maze", zh: "迷宮規則" },
    story: {
      en: "Boss mission! Walk each maze, pick up gems only while you have fewer than 2, and say how many 👣 steps you took.",
      zh: "魔王關！走完每個迷宮，寶石少於 2 顆時才撿，最後說出走了幾 👣 步。",
    },
    hint: {
      en: "Loop: if path ahead → (move, 👣 +1) else (if path left → left, else right). Then: if 💎 gems < 2 → (if on a gem → pick, +1).",
      zh: "迴圈：前方有路 →（前進、👣 +1）否則（左邊有路 → 左轉，否則右轉）。接著：如果 💎 寶石數 < 2 →（站在寶石上 → 撿起、+1）。",
    },
    maps: [[">.*#", "##*#", "##*G"], ["##*G", "##*#", ">**#"], [">**.**G"]],
    blocks: ["move", "left", "right", "pick", "until", "if", "ifElse", "setVar", "changeVar", "sayVar", "ifCmp"],
    vars: ["steps", "gems"],
    win: { exactGems: 2 },
    expect: "steps",
    starter: { main: [] },
    solution: {
      main: [
        set("steps", 0), set("gems", 0),
        { until: true, do: [
          { if: "pathAhead", do: ["move", add("steps")], else: [{ if: "pathLeft", do: ["left"], else: ["right"] }] },
          ifCmp("gems", "lt", 2, [{ if: "gemHere", do: ["pick", add("gems")] }]),
        ] },
        say("steps"),
      ],
    },
  },
];

// Learning path: [mission id, tier, lesson shown as "🎯 ..."].
export const LOGIC_PATH = [
  ["lg-1", "easy", { en: "A variable can have a name that says what it holds.", zh: "變數可以取一個名字，說明它裝的是什麼。" }],
  ["lg-2", "easy", { en: "Compare a variable to a number to stop a loop.", zh: "把變數和數字比較，讓迴圈停下來。" }],
  ["lg-3", "easy", { en: "\"≥\" still works when a number jumps past the target.", zh: "數字跳過目標時，「≥」還是抓得到。" }],
  ["lg-4", "easy", { en: "\"<\" means less than.", zh: "「<」是小於。" }],
  ["lg-5", "medium", { en: "\"> 3\" leaves out 3; \"≥ 3\" includes it.", zh: "「> 3」不包含 3，「≥ 3」包含 3。" }],
  ["lg-6", "medium", { en: "A variable can decide which way to go.", zh: "變數可以決定要往哪裡走。" }],
  ["lg-7", "medium", { en: "\"while\" repeats as long as something is true.", zh: "「當…時重複」會在條件成立時一直做。" }],
  ["lg-8", "medium", { en: "NOT flips a question.", zh: "「不是」會把問題反過來。" }],
  ["lg-9", "hard", { en: "OR is true if at least one part is true.", zh: "「或者」只要有一邊成立就成立。" }],
  ["lg-10", "hard", { en: "AND is true only if both parts are true.", zh: "「而且」要兩邊都成立才成立。" }],
  ["lg-11", "hard", { en: "An if inside an if: both questions must be yes.", zh: "如果裡面再放如果：兩個問題都要是「是」。" }],
  ["lg-12", "hard", { en: "Use everything together.", zh: "全部學到的一起用。" }],
];
