// Function Factory practice (after missions 16–20): every mission is ONE program that must pass THREE maps.
// Each practises one idea from 17–20: repeat a function to the flag, "if" inside a function, rules inside a function.
const ROOM = ["left", "move", "pick", "right", "right", "move", "left"];
const UP = ["left", "move", "right"];
const DOWN = ["right", "move", "left"];

export const functionPractice = [
  {
    id: "fp-1",
    title: { en: "Stairs of Any Height", zh: "幾階都能爬" },
    story: {
      en: "Each staircase has a different number of steps. Make \"climb\" go up ONE step (and grab a gem if there is one), then repeat it until the flag.",
      zh: "每座樓梯的階數都不一樣。讓「爬一階」只爬「一階」（有寶石就撿），再重複到旗子。",
    },
    hint: {
      en: "climb: left, move, right, move, if on a gem → pick up. Main: repeat until 🏁 (climb).",
      zh: "爬一階：左轉、前進、右轉、前進、如果站在寶石上 → 撿起。主程式：重複直到 🏁（爬一階）。",
    },
    maps: [
      ["#.G", ".*#", ">##"],
      ["##.G", "#.*#", ".*##", ">###"],
      ["###.G", "##.*#", "#.*##", ".*###", ">####"],
    ],
    blocks: ["move", "left", "right", "pick", "until", "if", "def", "call"],
    functions: ["climb"],
    require: { call: 1, until: 1 },
    starter: { main: [], defs: { climb: [] } },
    solution: {
      main: [{ until: true, do: [{ call: "climb" }] }],
      defs: { climb: ["left", "move", "right", "move", { if: "gemHere", do: ["pick"] }] },
    },
  },
  {
    id: "fp-2",
    title: { en: "Rooms Anywhere", zh: "房間在哪都不怕" },
    story: {
      en: "\"visit room\" is ready. The rooms are in different places on every map. Make \"smart step\" check for a room on the left, visit it if there is one, then move.",
      zh: "「進房間」已經做好了。每張地圖的房間位置都不一樣。讓「聰明一步」先看左邊有沒有房間，有就進去，然後前進。",
    },
    hint: {
      en: "smart step: if path to the left → visit room. Then move. Main: repeat until 🏁 (smart step).",
      zh: "聰明一步：如果左邊有路 → 進房間。然後前進。主程式：重複直到 🏁（聰明一步）。",
    },
    maps: [
      ["##*##*#", ">.....G"],
      ["#*#**###", ">......G"],
      ["###*##", ">....G"],
    ],
    blocks: ["move", "left", "right", "pick", "until", "if", "def", "call"],
    functions: ["smart", "room"],
    require: { def: 2, until: 1, if: 1 },
    starter: { main: [], defs: { smart: [], room: ROOM } },
    solution: {
      main: [{ until: true, do: [{ call: "smart" }] }],
      defs: { smart: [{ if: "pathLeft", do: [{ call: "room" }] }, "move"], room: ROOM },
    },
  },
  {
    id: "fp-3",
    title: { en: "Spiral Gem Hunt", zh: "漩渦尋寶" },
    story: {
      en: "Every spiral is a different size, and the gems move around. Make \"smart walk\" follow the path: forward if it can, otherwise turn right. Grab gems on the way.",
      zh: "每個漩渦大小不同，寶石位置也不同。讓「聰明走」沿著路走：能前進就前進，不能就右轉。路上的寶石要撿起來。",
    },
    hint: {
      en: "smart walk: if path ahead → move, else → turn right. Main: repeat until 🏁 (smart walk, then if on a gem → pick up).",
      zh: "聰明走：前方有路 → 前進，否則 → 右轉。主程式：重複直到 🏁（聰明走，然後站在寶石上就撿起）。",
    },
    maps: [
      [">.*#", "##.#", "G*.#"],
      [">*..", "G##*", "...."],
      [">.*..", "    *", " .G .", " .*.."],
    ],
    blocks: ["move", "right", "pick", "until", "if", "ifElse", "def", "call"],
    functions: ["walk"],
    require: { call: 1, until: 1, ifElse: 1 },
    starter: { main: [], defs: { walk: [] } },
    solution: {
      main: [{ until: true, do: [{ call: "walk" }, { if: "gemHere", do: ["pick"] }] }],
      defs: { walk: [{ if: "pathAhead", do: ["move"], else: ["right"] }] },
    },
  },
  {
    id: "fp-4",
    title: { en: "Left Hand on the Wall", zh: "左手扶著牆" },
    story: {
      en: "These mazes have dead ends! A new rule always works: keep your left hand on the wall. Turn left if you can, else go forward, else turn right.",
      zh: "這些迷宮有死路！有個規則一定走得出去：左手一直扶著牆。能左轉就左轉，不行就前進，再不行就右轉。",
    },
    hint: {
      en: "smart walk: if path left → turn left + move, else (if path ahead → move, else → turn right). Main: repeat until 🏁 (smart walk).",
      zh: "聰明走：左邊有路 → 左轉＋前進，否則（前方有路 → 前進，否則 → 右轉）。主程式：重複直到 🏁（聰明走）。",
    },
    maps: [
      [">..#", "#.##", "#..G"],
      ["...#G", ".#.#.", ">#..."],
      [">.#..", "#.#.#", "#...G"],
    ],
    blocks: ["move", "left", "right", "until", "ifElse", "def", "call"],
    functions: ["walk"],
    require: { call: 1, until: 1, ifElse: 2 },
    starter: { main: [], defs: { walk: [] } },
    solution: {
      main: [{ until: true, do: [{ call: "walk" }] }],
      defs: { walk: [{ if: "pathLeft", do: ["left", "move"], else: [{ if: "pathAhead", do: ["move"], else: ["right"] }] }] },
    },
  },
  {
    id: "fp-5",
    title: { en: "Mountain Trail", zh: "登山步道" },
    story: {
      en: "Practice boss! Every trail goes up and down in a different order. \"up\" and \"down\" are ready. Write ONE \"smart step\" that picks up gems and decides: forward, up, or down.",
      zh: "練習魔王關！每條步道上上下下的順序都不同。「上一階」「下一階」已經做好。寫「一個」聰明一步：撿寶石，再決定要前進、往上還是往下。",
    },
    hint: {
      en: "smart step: if on a gem → pick up. Then if path ahead → move, else (if path left → up, else → down). Main: repeat until 🏁.",
      zh: "聰明一步：站在寶石上 → 撿起。然後前方有路 → 前進，否則（左邊有路 → 上一階，否則 → 下一階）。主程式：重複直到 🏁。",
    },
    maps: [
      ["#.*.#", ">.#.G"],
      ["##.*.##", "#..#.*#", ">.###.G"],
      [">.#.G", "#.*.#"],
    ],
    blocks: ["move", "left", "right", "pick", "until", "if", "ifElse", "def", "call"],
    functions: ["smart", "up", "down"],
    require: { def: 3, until: 1 },
    starter: { main: [], defs: { smart: [], up: UP, down: DOWN } },
    solution: {
      main: [{ until: true, do: [{ call: "smart" }] }],
      defs: {
        smart: [{ if: "gemHere", do: ["pick"] }, { if: "pathAhead", do: ["move"], else: [{ if: "pathLeft", do: [{ call: "up" }], else: [{ call: "down" }] }] }],
        up: UP,
        down: DOWN,
      },
    },
  },
];
