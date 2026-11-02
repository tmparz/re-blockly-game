// Function Factory finale: kids design their own level, solve it with a function, and share it.
// The example map is what "Answer" loads; at runtime the kid's own map replaces maps[0].
export const MAKER_PALETTE = ["move", "left", "right", "pick", "repeat", "if", "def", "call"];
export const MAKER_FUNCTIONS = ["stairs", "climb", "tower", "room", "hop", "corner", "hall", "row", "turnAround"];

export const levelMaker = {
  id: "fn-make",
  kind: "maker",
  dot: "🛠",
  tier: "project",
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
  maps: [[">.###", "#*.##", "##*.#", "###*G"]],
  example: [">.###", "#*.##", "##*.#", "###*G"],
  blocks: MAKER_PALETTE,
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

const MAP_CHARS = /^[#.*G<>^v ]+$/;

// A level shared by link: ?unit=functions&play=<rows joined by "/">&best=<blocks>.
export function friendLevel(params) {
  const raw = params.get("play");
  if (!raw) return null;
  const rows = raw.split("/");
  const width = Math.max(...rows.map((row) => row.length));
  const text = rows.join("");
  const starts = (text.match(/[<>^v]/g) ?? []).length;
  const goals = (text.match(/G/g) ?? []).length;
  if (rows.length < 2 || rows.length > 10 || width > 10 || !rows.every((row) => MAP_CHARS.test(row))) return null;
  if (starts !== 1 || goals !== 1) return null;
  const best = Math.min(60, Math.max(1, Number.parseInt(params.get("best"), 10) || 20));
  return {
    ...levelMaker,
    id: "fn-friend",
    kind: "friend",
    extra: true,
    dot: "👫",
    title: { en: "A Friend's Level", zh: "同學的關卡" },
    story: {
      en: `A classmate built this level and solved it with ${best} blocks. Can you solve it too — maybe with even fewer?`,
      zh: `這是同學設計的關卡，作者用 ${best} 個方塊解開了。你也能解開嗎？能不能用更少的方塊？`,
    },
    hint: { en: "Look for the part that repeats. That part is your function!", zh: "找找看哪一段一直重複，那一段就是你的函式！" },
    maps: [rows.map((row) => row.padEnd(width, "#"))],
    require: { call: 1 },
    best,
    maxBlocks: best + 15,
    solution: null,
  };
}

// Adds a shared level as a bonus mission at the end of Function Factory.
// Returns [unit index, mission index] to open it, or null when the link has no valid level.
export function addFriendLevel(units, params) {
  const friend = friendLevel(params);
  const unitIndex = units.findIndex((unit) => unit.id === "functions");
  if (!friend || unitIndex < 0) return null;
  const { missions } = units[unitIndex];
  missions.push({ ...friend, unit: "functions", id: `friend:${friend.maps[0].join("/")}` });
  return [unitIndex, missions.length - 1];
}
