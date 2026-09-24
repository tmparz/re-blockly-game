// Pure simulator: runs a program on a map and returns a trace of frames to animate.
import { countBlocks, usage } from "./program.js";

const STEP_LIMIT = 1000;
const CALL_DEPTH_LIMIT = 12;
const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const START_DIRS = { "^": 0, ">": 1, v: 2, "<": 3 };

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
};

class Halt {
  constructor(reason, id) {
    this.reason = reason;
    this.id = id;
  }
}

export function runMap(program, level, rows) {
  const map = parseMap(rows);
  const s = { ...map.start, rot: map.start.dir, picked: new Set(), counter: 0, said: [], moves: 0, turns: 0, steps: 0 };
  const frames = [];
  const push = (kind, id, extra = {}) =>
    frames.push({ kind, id, x: s.x, y: s.y, rot: s.rot, counter: s.counter, ...extra });
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
    throw new Error(`Unknown condition "${cond}".`);
  };
  const turn = (delta, id) => {
    s.dir = (s.dir + delta + 4) % 4;
    s.rot += delta;
    s.turns += 1;
    push("turn", id);
  };
  const execList = (nodes, depth) => nodes.forEach((node) => exec(node, depth));

  function exec(node, depth) {
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
        s.said.push(s.counter);
        push("say", node.id, { value: s.counter });
        break;
      case "set":
        s.counter = node.n;
        push("counter", node.id);
        break;
      case "change":
        s.counter += node.n;
        push("counter", node.id);
        break;
      case "repeat":
        for (let i = 0; i < node.n; i += 1) execList(node.do, depth);
        break;
      case "until":
        while (!atGoal()) {
          tick(node.id);
          execList(node.do, depth);
        }
        break;
      case "untilCount":
        while (s.counter !== node.n) {
          tick(node.id);
          execList(node.do, depth);
        }
        break;
      case "if":
        if (test(node.cond)) execList(node.do, depth);
        break;
      case "ifElse":
        execList(test(node.cond) ? node.do : node.else, depth);
        break;
      case "call": {
        const body = program.defs[node.name];
        if (!body) throw new Halt("missingDef", node.id);
        if (depth >= CALL_DEPTH_LIMIT) throw new Halt("recursion", node.id);
        execList(body, depth + 1);
        break;
      }
      default:
        throw new Halt("unknownBlock", node.id);
    }
  }

  const finish = (ok, reason, extra = {}) => ({ ok, reason, ...extra, frames, stats: s, map });
  try {
    execList(program.main, 0);
  } catch (error) {
    if (!(error instanceof Halt)) throw error;
    return finish(false, error.reason, { id: error.id });
  }
  const win = level.win ?? {};
  if (map.goal && win.goal !== false && !atGoal()) return finish(false, "notGoal");
  if (win.exactGems != null && s.picked.size !== win.exactGems) return finish(false, "exactGems");
  if (win.exactGems == null && s.picked.size < map.gems.size) return finish(false, "missedGems");
  if (level.expect) {
    const want = EXPECT[level.expect](s, level);
    if (!s.said.length) return finish(false, "noSay", { want });
    if (s.said.at(-1) !== want) return finish(false, "wrongSay", { want, said: s.said.at(-1) });
  }
  return finish(true, "success");
}

export function evaluate(program, level) {
  const blocks = program.main ? countBlocks(program) : 0;
  const base = { ok: false, blocks, maps: [], stars: 0 };
  if (!program.main) return { ...base, reason: "noStart" };
  if (blocks > level.maxBlocks) return { ...base, reason: "tooManyBlocks" };
  const used = usage(program);
  for (const [op, n] of Object.entries(level.require ?? {})) {
    if ((used[op] ?? 0) < n) return { ...base, reason: "require", op, n };
  }
  const maps = level.maps.map((rows) => runMap(program, level, rows));
  const failed = maps.find((result) => !result.ok);
  if (failed) return { ...base, maps, reason: failed.reason, failedIndex: maps.indexOf(failed) };
  return { ...base, ok: true, maps, reason: "success", stars: blocks <= level.best ? 3 : 2 };
}
