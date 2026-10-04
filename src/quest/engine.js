// Pure simulator: runs a program on a map and returns a trace of frames to animate.
import { countBlocks, usage } from "./program.js";

const STEP_LIMIT = 1000;
const CALL_DEPTH_LIMIT = 12;
const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const START_DIRS = { "^": 0, ">": 1, v: 2, "<": 3 };
const COMPARE = {
  eq: (a, b) => a === b, ne: (a, b) => a !== b, gt: (a, b) => a > b,
  lt: (a, b) => a < b, ge: (a, b) => a >= b, le: (a, b) => a <= b,
};

export const key = (x, y) => `${x},${y}`;

export function parseMap(rows) {
  const map = { rows, w: 0, h: rows.length, open: new Set(), gems: new Set(), goal: null, start: null };
  rows.forEach((row, y) => {
    map.w = Math.max(map.w, row.length);
    [...row].forEach((ch, x) => {
      if (ch === "#" || ch === " ") return;
      map.open.add(key(x, y));
      if (ch === "*") map.gems.add(key(x, y));
      if (ch === "G") map.goal = { x, y };
      if (ch in START_DIRS) map.start = { x, y, dir: START_DIRS[ch] };
    });
  });
  if (!map.start) throw new Error(`Map has no start arrow:\n${rows.join("\n")}`);
  return map;
}

const EXPECT = {
  gems: (s) => s.picked.size,
  steps: (s) => s.moves,
  turns: (s) => s.turns,
  battery: (s, level) => level.battery - s.moves,
  points: (s, level) => s.picked.size * level.points,
  value: (s, level) => level.value,
  // Part 3: the right answer is listed per map (a number or a list).
  wants: (s, level, index) => level.wants[index],
  // Everything Robo said, in order (e.g. [steps, gems]).
  sequence: (s, level, index) => level.wants[index],
};
const pickFor = (value, index) => (Array.isArray(value) ? value[index] : value);

class Halt {
  constructor(reason, id) {
    this.reason = reason;
    this.id = id;
  }
}

// Thrown by "report" and caught by the function call that is waiting for the answer.
class Report {
  constructor(value) {
    this.value = value;
  }
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function runMap(program, level, rows, index = 0) {
  const map = parseMap(rows);
  const vars = { counter: 0, ...Object.fromEntries((level.vars ?? []).map((name) => [name, 0])), ...pickFor(level.varStart, index) };
  const s = { ...map.start, rot: map.start.dir, picked: new Set(), vars, list: [...(level.lists?.[index] ?? [])],
    said: [], moves: 0, turns: 0, steps: 0, depth: 0, input: null };
  const frames = [];
  const push = (kind, id, extra = {}) => frames.push({
    kind, id, x: s.x, y: s.y, rot: s.rot, counter: s.vars.counter, vars: { ...s.vars }, list: [...s.list],
    depth: s.depth, input: s.input, ...extra,
  });
  const tick = (id) => {
    s.steps += 1;
    if (s.steps > STEP_LIMIT) throw new Halt("tooManySteps", id);
  };
  const isOpen = (turn) => {
    const [dx, dy] = DIRS[(s.dir + turn + 4) % 4];
    return map.open.has(key(s.x + dx, s.y + dy));
  };
  const atGoal = () => Boolean(map.goal) && s.x === map.goal.x && s.y === map.goal.y;
  const test = (cond) => {
    if (cond === "pathAhead") return isOpen(0);
    if (cond === "pathLeft") return isOpen(-1);
    if (cond === "pathRight") return isOpen(1);
    if (cond === "gemHere") return map.gems.has(key(s.x, s.y)) && !s.picked.has(key(s.x, s.y));
    if (cond === "atGoal") return atGoal();
    throw new Error(`Unknown condition "${cond}".`);
  };
  // A value is a number, a variable name, or a special word: the function input, the list item, the list length.
  const value = (tok, ctx, id) => {
    if (typeof tok === "number") return tok;
    if (tok === "c") return s.vars.counter;
    if (tok === "input" || tok === "in-1") {
      if (ctx.input == null) throw new Halt("noInput", id);
      return tok === "input" ? ctx.input : ctx.input - 1;
    }
    if (tok === "item") {
      if (ctx.item == null) throw new Halt("noItem", id);
      return ctx.item;
    }
    if (tok === "len") return s.list.length;
    if (tok in s.vars) return s.vars[tok];
    throw new Error(`Unknown value "${tok}".`);
  };
  const compare = (node, ctx) => COMPARE[node.cmp](value(node.var, ctx, node.id), value(node.value, ctx, node.id));
  const logic = (node) => (node.logic === "and" ? test(node.a) && test(node.b) : test(node.a) || test(node.b));
  const setVar = (name, next, id) => {
    s.vars[name] = next;
    push("counter", id);
  };
  const turn = (delta, id) => {
    s.dir = (s.dir + delta + 4) % 4;
    s.rot += delta;
    s.turns += 1;
    push("turn", id);
  };
  // ctx: { depth, input (number sent to the running function), item (current "for each" item) }.
  const execList = (nodes, ctx) => nodes.forEach((node) => exec(node, ctx));
  const loopWhile = (node, ctx, keepGoing) => {
    while (keepGoing()) {
      tick(node.id);
      execList(node.do, ctx);
    }
  };
  const call = (node, ctx, sent) => {
    const body = program.defs[node.name];
    if (!body) throw new Halt("missingDef", node.id);
    if (ctx.depth >= CALL_DEPTH_LIMIT) throw new Halt("recursion", node.id);
    // Frames record how deep the calls go and the input in use, for the trace table.
    const outer = [s.depth, s.input];
    [s.depth, s.input] = [ctx.depth + 1, sent ?? null];
    try {
      execList(body, { depth: ctx.depth + 1, input: sent, item: ctx.item });
    } catch (signal) {
      if (signal instanceof Report) return signal.value;
      throw signal;
    } finally {
      [s.depth, s.input] = outer;
    }
    return undefined;
  };

  function exec(node, ctx) {
    tick(node.id);
    switch (node.op) {
      case "move": {
        if (!isOpen(0)) {
          push("bump", node.id);
          throw new Halt("wall", node.id);
        }
        const [dx, dy] = DIRS[s.dir];
        s.x += dx;
        s.y += dy;
        s.moves += 1;
        push("move", node.id);
        break;
      }
      case "left": turn(-1, node.id); break;
      case "right": turn(1, node.id); break;
      case "pick":
        if (!test("gemHere")) throw new Halt("noGem", node.id);
        s.picked.add(key(s.x, s.y));
        push("pick", node.id, { gem: key(s.x, s.y) });
        break;
      case "say":
        s.said.push(s.vars.counter);
        push("say", node.id, { value: s.vars.counter });
        break;
      case "set": setVar("counter", node.n, node.id); break;
      case "change": setVar("counter", s.vars.counter + node.n, node.id); break;
      case "repeat":
        for (let i = 0; i < node.n; i += 1) execList(node.do, ctx);
        break;
      case "repeatN": {
        if (ctx.input == null) throw new Halt("noInput", node.id);
        for (let i = 0; i < ctx.input; i += 1) execList(node.do, ctx);
        break;
      }
      case "until": loopWhile(node, ctx, () => !atGoal()); break;
      case "untilCount": loopWhile(node, ctx, () => s.vars.counter !== node.n); break;
      case "if":
        if (test(node.cond)) execList(node.do, ctx);
        break;
      case "ifElse": execList(test(node.cond) ? node.do : node.else, ctx); break;
      case "call": call(node, ctx, undefined); break;
      case "callN": call(node, ctx, value(node.n, ctx, node.id)); break;
      // ---- Part 3 ----
      case "setVar": setVar(node.var, value(node.value, ctx, node.id), node.id); break;
      case "changeVar": setVar(node.var, s.vars[node.var] + value(node.value, ctx, node.id), node.id); break;
      case "sayVar":
        s.said.push(s.vars[node.var]);
        push("say", node.id, { value: s.vars[node.var] });
        break;
      case "ifCmp":
        if (compare(node, ctx)) execList(node.do, ctx);
        break;
      case "ifElseCmp": execList(compare(node, ctx) ? node.do : node.else, ctx); break;
      case "untilCmp": loopWhile(node, ctx, () => !compare(node, ctx)); break;
      case "whileSense": loopWhile(node, ctx, () => test(node.cond)); break;
      case "ifLogic":
        if (logic(node)) execList(node.do, ctx);
        break;
      case "ifElseLogic": execList(logic(node) ? node.do : node.else, ctx); break;
      case "ifNot":
        if (!test(node.cond)) execList(node.do, ctx);
        break;
      case "forEach":
        for (const item of [...s.list]) execList(node.do, { ...ctx, item });
        break;
      case "addList":
        s.list.push(value(node.value, ctx, node.id));
        push("list", node.id);
        break;
      case "sayList":
        s.said.push([...s.list]);
        push("say", node.id, { value: `[${s.list.join(", ")}]` });
        break;
      case "report":
        if (!ctx.depth) throw new Halt("reportOutside", node.id);
        throw new Report(value(node.value, ctx, node.id));
      case "setCall": {
        const answer = call(node, ctx, value(node.n, ctx, node.id));
        if (answer === undefined) throw new Halt("noReport", node.id);
        setVar(node.var, answer, node.id);
        break;
      }
      default:
        throw new Halt("unknownBlock", node.id);
    }
  }

  const finish = (ok, reason, extra = {}) => ({ ok, reason, ...extra, frames, stats: s, map });
  try {
    execList(program.main, { depth: 0 });
  } catch (error) {
    if (!(error instanceof Halt)) throw error;
    return finish(false, error.reason, { id: error.id });
  }
  const win = level.win ?? {};
  if (map.goal && win.goal !== false && !atGoal()) return finish(false, "notGoal");
  if (win.exactGems != null && s.picked.size !== win.exactGems) return finish(false, "exactGems");
  if (win.exactGems == null && s.picked.size < map.gems.size) return finish(false, "missedGems");
  if (win.maxMoves != null && s.moves > win.maxMoves) return finish(false, "tooManyMoves", { want: win.maxMoves, said: s.moves });
  const wantVars = pickFor(level.wantVars, index);
  if (wantVars && Object.entries(wantVars).some(([name, want]) => s.vars[name] !== want)) return finish(false, "wrongVars");
  if (level.expect) {
    const want = EXPECT[level.expect](s, level, index);
    const said = level.expect === "sequence" ? s.said : s.said.at(-1);
    if (!s.said.length) return finish(false, "noSay", { want });
    if (!same(said, want)) return finish(false, "wrongSay", { want, said });
  }
  return finish(true, "success");
}

export function evaluate(program, level) {
  const blocks = program.main ? countBlocks(program) : 0;
  const base = { ok: false, blocks, maps: [], stars: 0 };
  if (!program.main) return { ...base, reason: "noStart" };
  // Run first so students can test any partial program; the limits below only decide whether it counts as a win.
  const maps = level.maps.map((rows, index) => runMap(program, level, rows, index));
  const failed = maps.find((result) => !result.ok);
  if (failed) return { ...base, maps, reason: failed.reason, failedIndex: maps.indexOf(failed) };
  if (blocks > level.maxBlocks) return { ...base, maps, reason: "tooManyBlocks" };
  const used = usage(program);
  for (const [op, n] of Object.entries(level.require ?? {})) {
    if ((used[op] ?? 0) < n) return { ...base, maps, reason: "require", op, n };
  }
  return { ...base, ok: true, maps, reason: "success", stars: blocks <= level.best ? 3 : 2 };
}
