// Runs programs with the REAL Quest Lab engine (runMap / evaluate) and turns the result into words a child can read.
// Nothing here simulates Robo: the engine moves it, this file only labels blocks and reads the frames back.
import { evaluate, parseMap, runMap } from "../quest/engine.js";
import { countBlocks, parseProgram } from "../quest/program.js";
import { UNITS, missionIndex } from "../quest/missions/index.js";
import { UNIT_ID, courseHref, reasonText } from "./missions.js";

// Block ids follow the position in the program, so the program view can light up the block the engine is running.
// A list key is "main" or a function name, then "/<index>/do" or "/<index>/else" for blocks inside blocks.
export const blockId = (listKey, index) => `${listKey}#${index}`;
export const ownerOf = (id = "") => String(id).split(/[/#]/)[0];

function tag(nodes, listKey) {
  nodes.forEach((node, index) => {
    node.id = blockId(listKey, index);
    if (node.do) tag(node.do, `${listKey}/${index}/do`);
    if (node.else) tag(node.else, `${listKey}/${index}/else`);
  });
}

// parseProgram builds new node objects, so tagging them never touches the mission data.
export function compile(dsl) {
  const program = parseProgram(dsl);
  tag(program.main, "main");
  Object.entries(program.defs).forEach(([name, body]) => tag(body, name));
  return program;
}

export const blockCount = (dsl) => countBlocks(parseProgram(dsl));

// One run on one map. The engine stops (Halt) on a wall or a missing gem; that becomes one friendly sentence.
export function run(mission, dsl, mapIndex = 0) {
  const rows = mission.maps[mapIndex];
  try {
    const result = runMap(compile(dsl), mission, rows, mapIndex);
    const reason = result.ok ? "success" : (dsl.main ?? []).length ? result.reason : "noStart";
    return { ...result, reason, text: reasonText(reason) };
  } catch (error) {
    return { ok: false, reason: "crash", text: reasonText("crash"), frames: [], stats: null, map: parseMap(rows), error };
  }
}

export const runAll = (mission, dsl) => mission.maps.map((_, index) => run(mission, dsl, index));
export const passes = (mission, dsl) => runAll(mission, dsl).every((result) => result.ok);
export const firstPass = (mission, dsls) => dsls.findIndex((dsl) => passes(mission, dsl));

// How many times a function started: frames whose block is the first block of that function.
export const entries = (result, name) => result.frames.filter((frame) => frame.id === blockId(name, 0)).length;

// Every function called anywhere inside a list of blocks.
export const callsIn = (items = []) => items.flatMap((item) => (typeof item === "object"
  ? [...("call" in item ? [item.call] : []), ...callsIn(item.do), ...callsIn(item.else)]
  : []));

// Who calls this function: ▶ main › … › the function. Used for the "which layer am I in" line.
export function callChain(dsl, owner, seen = new Set()) {
  if (owner === "main" || seen.has(owner)) return ["main"];
  seen.add(owner);
  const defs = dsl.defs ?? {};
  const caller = callsIn(dsl.main).includes(owner)
    ? "main"
    : Object.keys(defs).find((name) => name !== owner && callsIn(defs[name]).includes(owner));
  return caller ? [...callChain(dsl, caller, seen), owner] : ["main", owner];
}

// How many times a function is called when the program has no "until"/"if" (repeats and calls are multiplied out).
export function staticCalls(dsl, name, items = dsl.main ?? [], depth = 0) {
  if (depth > 12) return 0;
  return items.reduce((sum, item) => {
    if (typeof item !== "object") return sum;
    let inner = staticCalls(dsl, name, item.do ?? [], depth) + staticCalls(dsl, name, item.else ?? [], depth);
    if ("call" in item) inner += (item.call === name ? 1 : 0) + staticCalls(dsl, name, dsl.defs?.[item.call] ?? [], depth + 1);
    return sum + ("repeat" in item ? item.repeat : 1) * inner;
  }, 0);
}

// How many moves/turns/pick-ups one block makes (only for blocks without "until"/"if").
export function staticSteps(dsl, item, depth = 0) {
  if (depth > 12) return 0;
  if (typeof item === "string") return 1;
  const list = (items) => items.reduce((sum, inner) => sum + staticSteps(dsl, inner, depth + 1), 0);
  if ("call" in item) return list(dsl.defs?.[item.call] ?? []);
  if ("repeat" in item) return item.repeat * list(item.do ?? []);
  return list(item.do ?? []);
}

// The same program with every function call opened up into its steps (to show how long it would be without functions).
export function inline(dsl, items = dsl.main ?? [], depth = 0) {
  return items.flatMap((item) => {
    if (typeof item === "string") return [item];
    if ("call" in item && depth < 12) return inline(dsl, dsl.defs?.[item.call] ?? [], depth + 1);
    const copy = { ...item };
    if (item.do) copy.do = inline(dsl, item.do, depth);
    if (item.else) copy.else = inline(dsl, item.else, depth);
    return [copy];
  });
}

// Self-check, every time a page loads: the real solution must pass on every map with the real engine,
// pick up every gem, stop on the flag, pass Quest Lab's own grading, and ?m=N must open this same mission.
export function selfCheck(lesson, config = {}) {
  const { mission, n } = lesson;
  const problems = [];
  const many = mission.maps.length > 1;
  const results = runAll(mission, mission.solution);
  results.forEach((result, index) => {
    const where = many ? `地圖 ${index + 1}：` : "";
    if (!result.ok) {
      problems.push(`${where}解答沒有通過（${result.text}）`);
      return;
    }
    const { stats, map } = result;
    if (stats.picked.size !== map.gems.size) problems.push(`${where}寶石沒有收齊（${stats.picked.size}／${map.gems.size}）`);
    if (!map.goal || stats.x !== map.goal.x || stats.y !== map.goal.y) problems.push(`${where}Robo 沒有停在旗子上`);
  });
  try {
    const graded = evaluate(compile(mission.solution), mission);
    if (!graded.ok) problems.push(`Quest Lab 的評分沒有通過（${graded.reason}）`);
  } catch (error) {
    problems.push(`Quest Lab 的評分出錯（${error.message}）`);
  }
  const unit = UNITS.find((u) => u.id === UNIT_ID);
  if (lesson.courseNumber !== n || unit.missions[missionIndex(unit, String(n))] !== mission) {
    problems.push(`${courseHref(lesson)} 打開的不是這一關`);
  }
  if (config.verify) problems.push(...config.verify(results, mission));
  return { ok: !problems.length, problems, results };
}
