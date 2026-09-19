import assert from "node:assert/strict";
import { LEVELS, STAGES } from "../src/data/index.js";
import { LEGACY_LEVEL_IDS } from "../src/data/levels.js";
import { lessonRequirements } from "../src/data/lesson-rules.js";
import { traceLevel } from "./level-validation/simulator.mjs";
import { runRealProgram } from "./level-validation/runtime-harness.mjs";
import { readCurrentLevelIndex } from "../src/app/storage.js";
import { CURRENT_LEVEL_KEY, CURRENT_LEVEL_ID_KEY } from "../src/app/constants.js";

const byId = (id) => LEVELS.find((level) => level.id === id);
const move = { type: "move_forward" };
const right = { type: "turn_right" };
const collect = { type: "collect_gem" };
const traces = new Map();
let assertions = 0;
function check(value, label) { assert.ok(value, label); assertions += 1; }
for (const [index, level] of LEVELS.entries()) {
  const trace = traceLevel(level);
  traces.set(level.id, trace);
  const real = await runRealProgram(level);
  check(trace.ok, `${index + 1} ${level.id}: simulation: ${trace.error}`);
  check(real.ok && real.stars === 3, `${index + 1} ${level.id}: runtime: ${real.message}`);
  assert.deepEqual([real.state.x, real.state.y, real.state.dir, [...real.state.collected]],
    [trace.state.x, trace.state.y, trace.state.dir, [...trace.state.collected]], level.id);
  assertions += 1;
  check(!traceLevel(level, []).ok, `${level.id}: empty program must not pass`);
  if (lessonRequirements(level).length) {
    // Replay exactly the same successful route without any control blocks.
    const flat = trace.stats.steps;
    check(!traceLevel(level, flat).ok, `${level.id}: bypassed lesson requirements`);
    check(!(await runRealProgram(level, flat)).ok, `${level.id}: runtime accepted a flat bypass`);
  }
}

for (const id of ["square-patrol", "for-rectangle-lap"]) {
  check(!traceLevel(byId(id), [right]).ok, `${id}: turn in place`);
  check(!(await runRealProgram(byId(id), [right])).ok, `${id}: runtime turn in place`);
}
for (const id of ["while-vertical-wall-stop", "while-left-until-open"]) {
  const first = traces.get(id).stats.conditions["0"];
  check(first.true === 0 && first.false === 1, `${id}: initial condition must be false`);
}
for (const id of ["if-clear-two-step", "if-first-wall-turn", "if-first-gem-check", "if-else-first-choice"]) {
  const conditions = Object.values(traces.get(id).stats.conditions);
  check(conditions.some((c) => c.true) && conditions.some((c) => c.false), `${id}: both condition outcomes`);
}
for (const id of ["maze-left-hand-rule", "challenge-left-hand-maze", "challenge-final-factory"]) {
  check(Object.values(traces.get(id).stats.visits).some((n) => n > 1), `${id}: must really backtrack`);
}

const mutations = [
  ["if-clear-step", [move]],
  ["if-clear-step", [move, { type: "if_condition", condition: "FRONT_CLEAR", children: [] }]],
  ["if-clear-two-step", [move, move, move, collect]],
  ["if-first-gem-check", [move, collect, move, collect, move, collect, move]],
  ["while-portal-line", [{ type: "while_loop", condition: "ON_GEM", children: [move] }, move, move, move]],
  ["repeat-bridge", [{ type: "repeat_times", times: 1, children: [move, move, move, move, move] }]],
  ["nested-for-station-pairs", [{ type: "repeat_times", times: 3, children: [move, move, collect] }]],
];
for (const [id, program] of mutations) {
  check(!traceLevel(byId(id), program).ok, `${id}: mutation must fail`);
  check(!(await runRealProgram(byId(id), program)).ok, `${id}: runtime mutation must fail`);
}

for (const [index, id] of LEGACY_LEVEL_IDS.entries()) {
  localStorage.clear();
  localStorage.setItem(CURRENT_LEVEL_KEY, index);
  check(LEVELS[readCurrentLevelIndex()].id === id, `${id}: migrate legacy index`);
}
localStorage.setItem(CURRENT_LEVEL_ID_KEY, "if-clear-step");
check(LEVELS[readCurrentLevelIndex()].id === "if-clear-step", "saved ID takes priority over index");
assert.deepEqual(STAGES.map((s) => LEVELS.filter((l) => l.stage === s.id).length), [8, 10, 8, 15, 10, 14, 27, 4, 4]);
console.log(`Curriculum regression passed: 100 real-runtime demos + simulator parity, ${assertions} assertions (negative cases, branching, backtracking, progress migration).`);
