// Validates the Quest Lab trace table: for every mission solution on every map, the rows match the engine's
// frames (the same numbers the board shows), turns point the right way, and recursion records its depth.
import { ALL_MISSIONS, UNITS } from "../src/quest/missions/index.js";
import { runMap } from "../src/quest/engine.js";
import { parseProgram } from "../src/quest/program.js";
import { actionText, startState, traceRows } from "../src/quest/trace.js";

const errors = [];
const fail = (mission, index, message) => errors.push(`${mission.id} map ${index + 1}: ${message}`);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let rowsChecked = 0;

for (const mission of ALL_MISSIONS) {
  const program = parseProgram(mission.solution);
  mission.maps.forEach((rows, index) => {
    const result = runMap(program, mission, rows, index);
    const start = startState(mission, index);
    const trace = traceRows(result.frames, start);
    rowsChecked += trace.length;
    if (trace.length !== result.frames.length + 1) fail(mission, index, "one row per frame plus the start row");
    // The start row must hold the values the engine starts with: unchanged values in row 1 still equal them.
    const first = result.frames[0];
    if (first) {
      for (const [name, value] of Object.entries(start.vars)) {
        if (!trace[1].changed.has(name) && first.vars[name] !== value) fail(mission, index, `start value of ${name} is ${value}, engine has ${first.vars[name]}`);
      }
    }
    result.frames.forEach((frame, i) => {
      const row = trace[i + 1];
      if (!same(row.vars, frame.vars) || !same(row.list, frame.list)) fail(mission, index, `row ${i + 1} differs from the board`);
      if (!actionText(row, (name) => name).trim()) fail(mission, index, `row ${i + 1} has no action text`);
    });
    // Following the turn rows from the start direction must end where Robo faces.
    const turns = trace.filter((row) => row.kind === "turn").reduce((rot, row) => rot + (row.turn === "right" ? 1 : -1), start.rot);
    if (result.frames.length && turns !== result.frames.at(-1).rot) fail(mission, index, `turns add up to ${turns}, Robo faces ${result.frames.at(-1).rot}`);
    const usesFunctions = Object.keys(program.defs).length > 0;
    if (!usesFunctions && trace.some((row) => row.depth)) fail(mission, index, "no functions, but a row has a call depth");
  });
}

// Recursion missions must show the calls going deeper.
const masters = UNITS.find((unit) => unit.id === "masters").missions;
const deepest = Math.max(...masters.map((mission) => Math.max(0, ...runMap(parseProgram(mission.solution), mission, mission.maps[0], 0).frames.map((f) => f.depth))));
if (deepest < 3) errors.push(`Function Masters: deepest call is ${deepest}, recursion should reach 3 or more`);

if (errors.length) {
  console.error(errors.slice(0, 40).map((line) => `✗ ${line}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Trace table passed: ${rowsChecked} rows across ${ALL_MISSIONS.length} missions match the board; recursion reaches level ${deepest}.`);
}
