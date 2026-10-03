// Counting Robots extras: the small steps between the original counter missions.
const countGems = (amount = 1) => [
  { set: 0 },
  { until: true, do: ["move", { if: "gemHere", do: ["pick", { change: amount }] }] },
  "say",
];
const COUNT_BLOCKS = ["move", "pick", "until", "if", "set", "change", "say"];

export const countingExtra = [
  {
    id: "var-1",
    title: { en: "Robo's Number Box", zh: "Robo 的數字盒" },
    story: {
      en: "The counter 🔢 is a box that holds ONE number. It starts at 0. Robo's lucky number is 7: put 7 in the box before Robo says it.",
      zh: "計數器 🔢 是一個只裝「一個」數字的盒子，一開始是 0。Robo 的幸運數字是 7，在 Robo 說出來之前，先把 7 放進盒子。",
    },
    hint: { en: "Add \"set counter to 7\" somewhere before \"say counter\".", zh: "在「說出計數器」前面加上「計數器設為 7」。" },
    maps: [[">..G"]],
    blocks: ["move", "set", "say"],
    expect: "value",
    value: 7,
    starter: { main: ["move", "move", "move", "say"] },
    solution: { main: [{ set: 7 }, "move", "move", "move", "say"] },
  },
  {
    id: "var-2",
    title: { en: "Add One", zh: "加一" },
    story: {
      en: "Robo should say how many steps it took. \"change counter by +1\" adds 1 to the number in the box. Add one after every step.",
      zh: "Robo 要說出自己走了幾步。「計數器改變 +1」會把盒子裡的數字加 1。每走一步就加一次。",
    },
    hint: { en: "move, +1, move, +1, move, +1. The box goes 0 → 1 → 2 → 3.", zh: "前進、+1、前進、+1、前進、+1。盒子會變成 0 → 1 → 2 → 3。" },
    maps: [[">..G"]],
    blocks: ["move", "set", "change", "say"],
    expect: "steps",
    starter: { main: [{ set: 0 }, "move", "move", "move", "say"] },
    solution: { main: [{ set: 0 }, "move", { change: 1 }, "move", { change: 1 }, "move", { change: 1 }, "say"] },
  },
  {
    id: "var-3",
    title: { en: "Set or Change?", zh: "設為還是改變？" },
    story: {
      en: "Robo picked up 3 gems but says 1! \"set\" throws away the old number and puts in a new one. \"change\" adds to the number that is already there. Which one counts?",
      zh: "Robo 撿了 3 顆寶石，卻說 1！「設為」會丟掉舊數字、換成新的；「改變」是在原本的數字上加。哪一個才會數？",
    },
    hint: { en: "Swap each \"set counter to 1\" for \"change counter by +1\".", zh: "把每個「計數器設為 1」換成「計數器改變 +1」。" },
    maps: [[">***G"]],
    blocks: ["move", "pick", "set", "change", "say"],
    expect: "gems",
    starter: {
      main: [{ set: 0 }, "move", "pick", { set: 1 }, "move", "pick", { set: 1 }, "move", "pick", { set: 1 }, "move", "say"],
    },
    solution: {
      main: [{ set: 0 }, "move", "pick", { change: 1 }, "move", "pick", { change: 1 }, "move", "pick", { change: 1 }, "move", "say"],
    },
  },
  {
    id: "var-4",
    title: { en: "The Forgetful Counter", zh: "健忘的計數器" },
    story: {
      en: "Robo counts, but always says 0! Look closely: the counter goes back to 0 every time the loop repeats.",
      zh: "Robo 有在數，卻總是說 0！仔細看：迴圈每重複一次，計數器就被變回 0。",
    },
    hint: { en: "\"set counter to 0\" should happen once, before the loop starts.", zh: "「計數器設為 0」只要做一次，放在迴圈開始之前。" },
    maps: [[">*.*G"], [">**.*.G"]],
    blocks: COUNT_BLOCKS,
    expect: "gems",
    starter: {
      main: [{ until: true, do: [{ set: 0 }, "move", { if: "gemHere", do: ["pick", { change: 1 }] }] }, "say"],
    },
    solution: { main: countGems() },
  },
  {
    id: "var-5",
    title: { en: "Count Only Gems", zh: "只數寶石" },
    story: {
      en: "Robo's number is too big. It adds 1 on EVERY step, not only when it finds a gem.",
      zh: "Robo 說的數字太大了。它每走一步都加 1，而不是只有找到寶石時才加。",
    },
    hint: { en: "Move \"change counter by +1\" inside the \"if on a gem\" block.", zh: "把「計數器改變 +1」搬進「如果站在寶石上」裡面。" },
    maps: [[">.*..*G"], [">*.*.G"]],
    blocks: COUNT_BLOCKS,
    expect: "gems",
    starter: {
      main: [{ set: 0 }, { until: true, do: ["move", { change: 1 }, { if: "gemHere", do: ["pick"] }] }, "say"],
    },
    solution: { main: countGems() },
  },
  {
    id: "var-6",
    title: { en: "Gem Points", zh: "寶石積分" },
    story: {
      en: "Game time! Every gem is worth 2 points. Count the points and say the score at the flag.",
      zh: "遊戲時間！每顆寶石值 2 分。算出分數，到旗子時說出總分。",
    },
    hint: { en: "Use \"change counter by +2\" each time Robo picks up a gem.", zh: "每撿一顆寶石，就用「計數器改變 +2」。" },
    maps: [[">*.*G"], [">.**.*G"]],
    blocks: COUNT_BLOCKS,
    expect: "points",
    points: 2,
    starter: { main: countGems().slice(0, 1).concat("say") },
    solution: { main: countGems(2) },
  },
  {
    id: "var-7",
    title: { en: "Exactly Six Steps", zh: "剛好六步" },
    story: {
      en: "The tunnel keeps going after the flag, and there is no \"until 🏁\" block. Count each step and stop when the counter reaches 6.",
      zh: "隧道在旗子後面還有路，而且這次沒有「重複直到 🏁」。每走一步就數一下，計數器到 6 就停。",
    },
    hint: { en: "Set to 0 → repeat until counter = 6 (move, +1).", zh: "設為 0 → 重複直到計數器 = 6（前進、+1）。" },
    maps: [[">.....G...."]],
    blocks: ["move", "set", "change", "untilCount"],
    require: { untilCount: 1 },
    maxBlocks: 5,
    starter: { main: [] },
    solution: { main: [{ set: 0 }, { untilCount: 6, do: ["move", { change: 1 }] }] },
  },
  {
    id: "var-8",
    title: { en: "Countdown Launch", zh: "倒數發射" },
    story: {
      en: "5, 4, 3, 2, 1, 0… go! Start the counter at 5. Robo moves once for each number and stops when it reaches 0.",
      zh: "5、4、3、2、1、0……出發！計數器從 5 開始。每倒數一個數字，Robo 就前進一格，到 0 就停。",
    },
    hint: { en: "Set to 5 → repeat until counter = 0 (move, -1).", zh: "設為 5 → 重複直到計數器 = 0（前進、-1）。" },
    maps: [[">....G..."]],
    blocks: ["move", "set", "change", "untilCount"],
    require: { untilCount: 1 },
    maxBlocks: 5,
    starter: { main: [{ set: 5 }] },
    solution: { main: [{ set: 5 }, { untilCount: 0, do: ["move", { change: -1 }] }] },
  },
  {
    id: "var-9",
    title: { en: "Turns Are Free", zh: "轉彎不耗電" },
    story: {
      en: "Battery starts at 10. Moving uses 1, but turning uses nothing. Walk the spiral and say the battery left.",
      zh: "電池一開始是 10。前進一步用 1 格電，轉彎不用電。走完漩渦，說出還剩多少電。",
    },
    hint: { en: "Put \"-1\" next to move (in the \"if\" part), not next to turn.", zh: "把「-1」放在前進旁邊（「如果」那一格），不要放在轉彎旁邊。" },
    maps: [[">..#", "##.#", "G..#"], [">...", "G##.", "...."]],
    blocks: ["move", "right", "until", "ifElse", "set", "change", "say"],
    expect: "battery",
    battery: 10,
    starter: { main: [] },
    solution: {
      main: [{ set: 10 }, { until: true, do: [{ if: "pathAhead", do: ["move", { change: -1 }], else: ["right"] }] }, "say"],
    },
  },
  {
    id: "var-10",
    title: { en: "The Counting Function", zh: "會數數的函式" },
    story: {
      en: "The main program is ready, but the function \"count gem\" is empty. Fill it in: pick up the gem AND add 1.",
      zh: "主程式寫好了，但「撿起並數」這個函式是空的。把它填好：撿起寶石，「並且」加 1。",
    },
    hint: { en: "Inside \"define count gem\": pick up, then change counter by +1.", zh: "在「定義 撿起並數」裡面放：撿起，然後計數器改變 +1。" },
    maps: [[">*.**G"], [">.*.*.*G"]],
    blocks: [...COUNT_BLOCKS, "def", "call"],
    functions: ["countGem"],
    require: { call: 1 },
    starter: {
      main: [{ set: 0 }, { until: true, do: ["move", { if: "gemHere", do: [{ call: "countGem" }] }] }, "say"],
      defs: { countGem: [] },
    },
    solution: {
      main: [{ set: 0 }, { until: true, do: ["move", { if: "gemHere", do: [{ call: "countGem" }] }] }, "say"],
      defs: { countGem: ["pick", { change: 1 }] },
    },
  },
  {
    id: "var-11",
    title: { en: "Grand Treasure Tour", zh: "尋寶大冒險" },
    story: {
      en: "Boss mission! Twisty paths, and every gem is worth 2 points. Write a \"smart walk\" function and a \"count gem\" function, then report the score on all three maps.",
      zh: "魔王關！路會轉來轉去，每顆寶石值 2 分。寫一個「聰明走」函式和一個「撿起並數」函式，在三張地圖都報對分數。",
    },
    hint: {
      en: "smart walk: path ahead → move, else (path left → left, else right). Main: set 0, repeat until 🏁 (smart walk, if on a gem → count gem), say.",
      zh: "聰明走：前方有路 → 前進，否則（左邊有路 → 左轉，否則右轉）。主程式：設為 0，重複直到 🏁（聰明走，站在寶石上就撿起並數），說出。",
    },
    maps: [[">.*#", "##*#", "##.G"], ["##*G", "##*#", ">*.#"], [">**.**G"]],
    blocks: ["move", "left", "right", "pick", "until", "if", "ifElse", "set", "change", "say", "def", "call"],
    functions: ["walk", "countGem"],
    expect: "points",
    points: 2,
    require: { def: 2 },
    starter: { main: [] },
    solution: {
      main: [{ set: 0 }, { until: true, do: [{ call: "walk" }, { if: "gemHere", do: [{ call: "countGem" }] }] }, "say"],
      defs: {
        walk: [{ if: "pathAhead", do: ["move"], else: [{ if: "pathLeft", do: ["left"], else: ["right"] }] }],
        countGem: ["pick", { change: 2 }],
      },
    },
  },
];
