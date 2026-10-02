// Function Factory advanced: functions with loops, decisions and other functions inside.
const ROCK = ["left", "move", "right", "move", "move", "right", "move", "left"];

export const functionAdvanced = [
  {
    id: "fg-9",
    title: { en: "Hurdle Race", zh: "跨欄賽跑" },
    story: {
      en: "Every map has a different number of hurdles. Make \"hurdle\" jump ONE hurdle and take one step, then repeat it until the flag.",
      zh: "每張地圖的欄架數量都不一樣。做一個「跨欄」：跳過一個欄架再走一步，然後一直重複到旗子。",
    },
    hint: {
      en: "hurdle: left, move, right, move, move, right, move, left, move. Main: repeat until 🏁 (hurdle).",
      zh: "跨欄：左轉、前進、右轉、前進、前進、右轉、前進、左轉、前進。主程式：重複直到 🏁（跨欄）。",
    },
    maps: [
      ["...", ">#.G"],
      ["......", ">#..#.G"],
      [".........", ">#..#..#.G"],
    ],
    blocks: ["move", "left", "right", "until", "def", "call"],
    functions: ["hurdle"],
    require: { call: 1, until: 1 },
    starter: { main: [], defs: { hurdle: [] } },
    solution: { main: [{ until: true, do: [{ call: "hurdle" }] }], defs: { hurdle: [...ROCK, "move"] } },
  },
  {
    id: "fg-10",
    title: { en: "Smart Walker", zh: "聰明走路" },
    story: {
      en: "One function can solve every maze! \"smart walk\" looks around: go forward if it can, otherwise turn toward the open path.",
      zh: "一個函式就能走完每個迷宮！「聰明走」會先看看四周：前面有路就走，不然就轉向有路的那邊。",
    },
    hint: {
      en: "smart walk: if path ahead → move, else (if path left → turn left, else → turn right).",
      zh: "聰明走：如果前方有路 → 前進，否則（如果左邊有路 → 左轉，否則 → 右轉）。",
    },
    maps: [
      [">..#", "##.#", "G..#"],
      ["#..G", "#.##", ">.##"],
      [">..#", "##.#", "#..#", "#.##", "#.G#"],
    ],
    blocks: ["move", "left", "right", "until", "ifElse", "def", "call"],
    functions: ["walk"],
    require: { call: 1, until: 1, ifElse: 2 },
    starter: { main: [], defs: { walk: [] } },
    solution: {
      main: [{ until: true, do: [{ call: "walk" }] }],
      defs: { walk: [{ if: "pathAhead", do: ["move"], else: [{ if: "pathLeft", do: ["left"], else: ["right"] }] }] },
    },
  },
  {
    id: "fg-11",
    title: { en: "Mountains of Functions", zh: "函式疊疊山" },
    story: {
      en: "\"up\" is ready. Build \"down\", then build \"peak\" out of up and down. A function can be made of other functions!",
      zh: "「上一階」已經做好了。完成「下一階」，再用上一階和下一階組成「爬山頭」。函式可以由其他函式組成！",
    },
    hint: {
      en: "down: move, right, move, left. peak: up, up, pick up, down, down.",
      zh: "下一階：前進、右轉、前進、左轉。爬山頭：上一階、上一階、撿起、下一階、下一階。",
    },
    maps: [["##*.##*.##", "#........#", ">.##..##.G"]],
    blocks: ["move", "left", "right", "pick", "def", "call"],
    functions: ["peak", "up", "down"],
    require: { def: 3, call: 4 },
    starter: { main: [], defs: { peak: [], up: ["move", "left", "move", "right"], down: [] } },
    solution: {
      main: [{ call: "peak" }, { call: "peak" }, "move"],
      defs: {
        peak: [{ call: "up" }, { call: "up" }, "pick", { call: "down" }, { call: "down" }],
        up: ["move", "left", "move", "right"],
        down: ["move", "right", "move", "left"],
      },
    },
  },
  {
    id: "fg-12",
    title: { en: "Final Boss", zh: "終極魔王" },
    story: {
      en: "Gems and rocks are in different places on every map. \"smart step\" picks up a gem if there is one, then walks or climbs over a rock.",
      zh: "每張地圖的寶石和石頭位置都不一樣。「聰明一步」：有寶石就撿，前面有路就走，沒路就翻石頭。",
    },
    hint: {
      en: "smart step: if on a gem → pick up. Then if path ahead → move, else → over rock. Main: repeat until 🏁.",
      zh: "聰明一步：如果站在寶石上 → 撿起。接著如果前方有路 → 前進，否則 → 翻石頭。主程式：重複直到 🏁。",
    },
    maps: [
      ["  ...", ">.*#.*..G"],
      ["... ...", ">#.*.#*.G"],
      ["     ...", ">*..*.#G"],
    ],
    blocks: ["move", "left", "right", "pick", "until", "if", "ifElse", "def", "call"],
    functions: ["smart", "rock"],
    require: { def: 2, until: 1 },
    starter: { main: [], defs: { smart: [], rock: ROCK } },
    solution: {
      main: [{ until: true, do: [{ call: "smart" }] }],
      defs: {
        smart: [{ if: "gemHere", do: ["pick"] }, { if: "pathAhead", do: ["move"], else: [{ call: "rock" }] }],
        rock: ROCK,
      },
    },
  },
];
