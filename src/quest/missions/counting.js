// Unit 3 · Counting Robots: a variable (the counter) remembers a number while the program runs.
const countGems = [
  { set: 0 },
  { until: true, do: ["move", { if: "gemHere", do: ["pick", { change: 1 }] }] },
  "say",
];

export const counting = [
  {
    id: "count-1",
    title: { en: "Say the Number", zh: "說出數字" },
    story: {
      en: "Robo has a counter 🔢 that remembers a number. It counts gems as it picks them up, but it forgets to tell us! Add the \"say counter\" block at the end.",
      zh: "Robo 有一個會記住數字的計數器 🔢。它邊撿寶石邊數，卻忘了告訴我們！在最後加上「說出計數器」。",
    },
    hint: { en: "\"say counter\" goes after the loop, so Robo says it once at the end.", zh: "「說出計數器」放在迴圈後面，最後說一次就好。" },
    maps: [[">.*.*.*G"]],
    blocks: ["move", "pick", "until", "if", "set", "change", "say"],
    expect: "gems",
    starter: { main: countGems.slice(0, 2) },
    solution: { main: countGems },
  },
  {
    id: "count-2",
    title: { en: "Count Every Gem", zh: "每顆都要數" },
    story: {
      en: "Now Robo says the number, but it always says 0. Robo needs to add 1 to the counter every time it picks up a gem.",
      zh: "現在 Robo 會說數字了，但每次都說 0。Robo 每撿一顆寶石，計數器就要加 1。",
    },
    hint: { en: "Put \"change counter by 1\" right after \"pick up\".", zh: "把「計數器改變 1」放在「撿起」後面。" },
    maps: [[">*.**.G"], [">.*...*G"]],
    blocks: ["move", "pick", "until", "if", "set", "change", "say"],
    expect: "gems",
    starter: {
      main: [{ set: 0 }, { until: true, do: ["move", { if: "gemHere", do: ["pick"] }] }, "say"],
    },
    solution: { main: countGems },
  },
  {
    id: "count-3",
    title: { en: "Start From Zero", zh: "從零開始數" },
    story: {
      en: "Robo's answer is always too big! Check where the counter starts.",
      zh: "Robo 說的數字總是太大！檢查計數器是從幾開始的。",
    },
    hint: { en: "Before you count anything, the counter should be 0.", zh: "還沒開始數的時候，計數器應該是 0。" },
    maps: [[">.**..*G"], [">*..G"]],
    blocks: ["move", "pick", "until", "if", "set", "change", "say"],
    expect: "gems",
    starter: {
      main: [{ set: 3 }, { until: true, do: ["move", { if: "gemHere", do: ["pick", { change: 1 }] }] }, "say"],
    },
    solution: { main: countGems },
  },
  {
    id: "count-4",
    title: { en: "Works on Every Map", zh: "每張地圖都能用" },
    story: {
      en: "Three different hallways! Write ONE program that counts the gems on any hallway. Good code works every time.",
      zh: "三條不同的走廊！寫「一個」程式，不管哪條走廊都能數對寶石。好的程式每次都能用。",
    },
    hint: { en: "Set to 0 → repeat until the flag (move, if gem: pick + add 1) → say.", zh: "設為 0 → 重複直到旗子（前進、有寶石就撿起並加 1）→ 說出。" },
    maps: [[">**.G"], [">.*.*.**.G"], [">...*G"]],
    blocks: ["move", "pick", "until", "if", "set", "change", "say"],
    expect: "gems",
    starter: { main: [] },
    solution: { main: countGems },
  },
  {
    id: "count-5",
    title: { en: "How Long Is the Tunnel?", zh: "隧道有多長？" },
    story: {
      en: "No gems here. Count how many steps Robo takes to reach the flag, then say the number.",
      zh: "這裡沒有寶石。數一數 Robo 走幾步才到旗子，然後說出來。",
    },
    hint: { en: "Add 1 to the counter after every move.", zh: "每前進一次，計數器就加 1。" },
    maps: [[">..G"], [">.....G"], [">.......G"]],
    blocks: ["move", "until", "set", "change", "say"],
    expect: "steps",
    starter: { main: [] },
    solution: { main: [{ set: 0 }, { until: true, do: ["move", { change: 1 }] }, "say"] },
  },
  {
    id: "count-6",
    title: { en: "Battery Countdown", zh: "電池倒數" },
    story: {
      en: "Robo's battery starts at 10. Every step uses 1. When Robo reaches the flag, say how much battery is left.",
      zh: "Robo 的電池一開始是 10。每走一步用掉 1。到旗子時，說出還剩多少電。",
    },
    hint: { en: "Set the counter to 10, and change it by -1 each step.", zh: "計數器設為 10，每走一步改變 -1。" },
    maps: [[">...G"], [">.....G"], [">..G"]],
    blocks: ["move", "until", "set", "change", "say"],
    expect: "battery",
    battery: 10,
    starter: { main: [] },
    solution: { main: [{ set: 10 }, { until: true, do: ["move", { change: -1 }] }, "say"] },
  },
  {
    id: "count-7",
    title: { en: "Just Three Gems", zh: "只要三顆" },
    story: {
      en: "The bag only holds 3 gems. Pick up exactly 3, then stop. Use \"repeat until counter = 3\".",
      zh: "袋子只裝得下 3 顆寶石。剛好撿 3 顆就停下來。用「重複直到計數器 = 3」。",
    },
    hint: { en: "The loop stops by itself when the counter reaches 3.", zh: "計數器變成 3 的時候，迴圈就會自己停下來。" },
    maps: [[">******"], [">.*.*..**.*"]],
    blocks: ["move", "pick", "if", "set", "change", "say", "untilCount"],
    expect: "gems",
    win: { exactGems: 3 },
    starter: { main: [] },
    solution: {
      main: [{ set: 0 }, { untilCount: 3, do: ["move", { if: "gemHere", do: ["pick", { change: 1 }] }] }, "say"],
    },
  },
  {
    id: "count-8",
    title: { en: "Count the Corners", zh: "數轉角" },
    story: {
      en: "Each path twists in a spiral. Count how many times Robo turns, and say the number at the flag.",
      zh: "每條路都像漩渦一樣轉彎。數一數 Robo 轉了幾次彎，到旗子時說出來。",
    },
    hint: { en: "If there is a path ahead, move. Else, turn right and add 1.", zh: "前方有路就前進，否則右轉並加 1。" },
    maps: [
      [">..#", "##.#", "G..#"],
      [">...", "G##.", "...."],
      [">....", "    .", " .G .", " ...."],
    ],
    blocks: ["move", "right", "until", "ifElse", "set", "change", "say"],
    expect: "turns",
    starter: { main: [] },
    solution: {
      main: [{ set: 0 }, { until: true, do: [{ if: "pathAhead", do: ["move"], else: ["right", { change: 1 }] }] }, "say"],
    },
  },
  {
    id: "count-9",
    title: { en: "Treasure Report", zh: "寶藏報告" },
    story: {
      en: "Final mission! The paths turn left AND right, and the gems are in different places. Find the flag and report how many gems you found.",
      zh: "最終任務！路會左轉也會右轉，寶石位置也不同。走到旗子，並報告你找到幾顆寶石。",
    },
    hint: {
      en: "Inside the loop: if path ahead → move, else (if path left → turn left, else turn right). Then check for a gem.",
      zh: "迴圈裡：前方有路 → 前進，否則（左邊有路 → 左轉，否則右轉）。然後檢查寶石。",
    },
    maps: [[">.*#", "##*#", "##.G"], ["##*G", "##*#", ">*.#"], [">**.**G"]],
    blocks: ["move", "left", "right", "pick", "until", "if", "ifElse", "set", "change", "say"],
    expect: "gems",
    starter: { main: [] },
    solution: {
      main: [
        { set: 0 },
        { until: true, do: [
          { if: "pathAhead", do: ["move"], else: [{ if: "pathLeft", do: ["left"], else: ["right"] }] },
          { if: "gemHere", do: ["pick", { change: 1 }] },
        ] },
        "say",
      ],
    },
  },
];
