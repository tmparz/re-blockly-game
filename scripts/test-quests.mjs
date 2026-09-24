// Validates Quest Lab missions: solutions pass on every map, starters fail, text is bilingual.
import { UNITS, ALL_MISSIONS } from "../src/quest/missions/index.js";
import { evaluate, parseMap } from "../src/quest/engine.js";
import { parseProgram, programFromState, stateFromDsl, usage } from "../src/quest/program.js";

const errors = [];
const fail = (mission, message) => errors.push(`${mission.id}: ${message}`);
const ids = new Set();

for (const mission of ALL_MISSIONS) {
  if (ids.has(mission.id)) fail(mission, "duplicate id");
  ids.add(mission.id);

  for (const field of ["title", "story", "hint"]) {
    if (!mission[field]?.en?.trim() || !mission[field]?.zh?.trim()) fail(mission, `${field} needs en + zh`);
  }

  mission.maps.forEach((rows, index) => {
    const map = parseMap(rows);
    const needsGoal = mission.win?.exactGems == null;
    if (needsGoal && !map.goal) fail(mission, `map ${index + 1} has no goal`);
  });

  const solution = parseProgram(mission.solution);
  const used = usage(solution);
  for (const op of Object.keys(used)) {
    if (used[op] && op !== "def" && !mission.blocks.includes(op)) fail(mission, `solution uses "${op}" not in palette`);
  }
  if (used.def && !mission.blocks.includes("def")) fail(mission, "solution defines a function without def block");
  for (const name of Object.keys(solution.defs)) {
    if (!mission.functions?.includes(name)) fail(mission, `function "${name}" not listed`);
  }

  // Round-trip through Blockly JSON so the browser path is covered too.
  const roundTrip = programFromState(stateFromDsl(mission.solution));
  const result = evaluate(roundTrip, mission);
  if (!result.ok) {
    const where = result.failedIndex != null ? ` on map ${result.failedIndex + 1}` : "";
    fail(mission, `solution failed: ${result.reason}${where}`);
  } else if (result.stars !== 3) fail(mission, `solution earns ${result.stars} stars`);

  if (mission.starter) {
    const starter = evaluate(programFromState(stateFromDsl(mission.starter)), mission);
    if (starter.ok) fail(mission, "starter program already passes");
  }
  if (mission.maxBlocks < mission.best) fail(mission, "maxBlocks is below solution size");
}

if (errors.length) {
  console.error(errors.map((line) => `✗ ${line}`).join("\n"));
  process.exitCode = 1;
} else {
  const summary = UNITS.map((unit) => `${unit.id} ${unit.missions.length}`).join(", ");
  console.log(`Validated ${ALL_MISSIONS.length} Quest Lab missions (${summary}).`);
}
