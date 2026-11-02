// Level Maker projects: students design their own level, solve it, and share it as a link.
// mission.maker says how many maps to draw and which goals to check; "Answer" loads mission.example.
const MAKER_FUNCTIONS = ["stairs", "climb", "tower", "room", "hop", "corner", "hall", "row", "turnAround"];

// Function Factory finale: one map with a repeating pattern, solved with a function.
export const levelMaker = {
  id: "fn-make",
  kind: "maker",
  dot: "🛠",
  tier: "project",
  maker: { maps: 1, goals: ["map", "gems", "fn", "solved"] },
  lesson: { en: "Make something with functions: design a level, solve it, share it.", zh: "用函式做作品：設計關卡、解開它、分享出去。" },
  title: { en: "Level Maker", zh: "關卡設計師" },
  story: {
    en: "Design your own level! Pick a tool, tap the map to paint a path with a repeating pattern, then solve it with a function. (Tap 🤖 again to turn it.)",
    zh: "設計你自己的關卡！選工具、點地圖畫出有重複圖樣的路，再用函式解開它。（再點一下 🤖 可以轉方向）",
  },
  hint: {
    en: "Design the repeating part first (stairs, towers, rooms…). Then build ONE function for it and call it again and again.",
    zh: "先設計會重複的那一段（樓梯、城塔、小房間……），再為它做「一個」函式，然後一直呼叫它。",
  },
  friendHint: { en: "Look for the part that repeats. That part is your function!", zh: "找找看哪一段一直重複，那一段就是你的函式！" },
  friendRequire: { call: 1 },
  maps: [[">.###", "#*.##", "##*.#", "###*G"]],
  example: [[">.###", "#*.##", "##*.#", "###*G"]],
  blocks: ["move", "left", "right", "pick", "repeat", "if", "def", "call"],
  functions: MAKER_FUNCTIONS,
  require: { def: 1, call: 2 },
  maxBlocks: 60,
  best: 999,
  starter: { main: [] },
  solution: {
    main: [{ call: "stairs" }, { call: "stairs" }, { call: "stairs" }, "move"],
    defs: { stairs: ["move", "right", "move", "pick", "left"] },
  },
};

// Counting Robots finale: two maps with different numbers of gems, one program that counts right on both.
const countGems = [{ set: 0 }, { until: true, do: ["move", { if: "gemHere", do: ["pick", { change: 1 }] }] }, "say"];
export const countMaker = {
  id: "count-make",
  kind: "maker",
  dot: "🛠",
  tier: "project",
  maker: { maps: 2, goals: ["map", "differ", "counter", "solved"] },
  lesson: { en: "A variable lets ONE program give the right answer on every map.", zh: "有了變數，「一個」程式就能在每張地圖都答對。" },
  title: { en: "Counting Level Maker", zh: "數數關卡設計師" },
  story: {
    en: "Draw TWO maps with a different number of gems (tap the tabs 1 and 2 to switch). Then write ONE program that picks up every gem and says how many — right on both maps!",
    zh: "畫「兩張」寶石數量不一樣的地圖（點 1、2 切換）。再寫「一個」程式：撿起每顆寶石，並說出有幾顆，兩張地圖都要說對！",
  },
  hint: {
    en: "set counter to 0 → repeat until 🏁 (move, if on a gem: pick up + change counter by 1) → say counter. Paths that turn need if / else too.",
    zh: "計數器設為 0 → 重複直到 🏁（前進，站在寶石上就撿起並計數器 +1）→ 說出計數器。路會轉彎的話，還要加「如果／否則」。",
  },
  friendHint: { en: "Saying a number you counted by eye won't work on both maps. Use the counter!", zh: "用眼睛數好再直接說，兩張地圖不可能都對。要用計數器！" },
  friendRequire: { change: 1, say: 1 },
  maps: [["#######", ">*.*.*G", "#######"], ["#######", ">.**..G", "#######"]],
  example: [["#######", ">*.*.*G", "#######"], ["#######", ">.**..G", "#######"]],
  blocks: ["move", "left", "right", "pick", "until", "if", "ifElse", "set", "change", "say", "def", "call"],
  functions: ["walk", "countGem"],
  expect: "gems",
  require: { set: 1, change: 1, say: 1 },
  maxBlocks: 60,
  best: 999,
  starter: { main: [] },
  solution: { main: countGems },
};

const MAKERS = { functions: levelMaker, counting: countMaker };
const MAP_CHARS = /^[#.*G<>^v ]+$/;

function parseSharedMap(text) {
  const rows = text.split("/");
  const width = Math.max(...rows.map((row) => row.length));
  const all = rows.join("");
  if (rows.length < 2 || rows.length > 10 || width > 10 || !rows.every((row) => MAP_CHARS.test(row))) return null;
  if ((all.match(/[<>^v]/g) ?? []).length !== 1 || (all.match(/G/g) ?? []).length !== 1) return null;
  return rows.map((row) => row.padEnd(width, "#"));
}

// A level shared by link: ?unit=<unit>&play=<maps joined by "|", rows by "/">&best=<blocks>.
export function friendLevel(params) {
  const base = MAKERS[params.get("unit")];
  const raw = params.get("play");
  if (!base || !raw) return null;
  const maps = raw.split("|").map(parseSharedMap);
  if (maps.length > 3 || maps.some((rows) => !rows)) return null;
  const best = Math.min(60, Math.max(1, Number.parseInt(params.get("best"), 10) || 20));
  return {
    ...base,
    id: `friend:${params.get("unit")}:${raw}`,
    kind: "friend",
    extra: true,
    dot: "👫",
    title: { en: "A Friend's Level", zh: "同學的關卡" },
    story: {
      en: `A classmate built this level and solved it with ${best} blocks. Can you solve it too — maybe with even fewer?`,
      zh: `這是同學設計的關卡，作者用 ${best} 個方塊解開了。你也能解開嗎？能不能用更少的方塊？`,
    },
    hint: base.friendHint,
    maps,
    require: base.friendRequire,
    best,
    maxBlocks: best + 15,
    solution: null,
  };
}

// Adds a shared level as a bonus mission at the end of its unit.
// Returns [unit index, mission index] to open it, or null when the link has no valid level.
export function addFriendLevel(units, params) {
  const friend = friendLevel(params);
  const unitIndex = units.findIndex((unit) => unit.id === params.get("unit"));
  if (!friend || unitIndex < 0) return null;
  const { missions } = units[unitIndex];
  missions.push({ ...friend, unit: units[unitIndex].id });
  return [unitIndex, missions.length - 1];
}
