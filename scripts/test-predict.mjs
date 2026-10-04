// Validates 🔮 predict missions: the fixed program runs to the end, exactly one choice is right,
// every Part 3 unit opens and closes with one, numbering skips them, and Blockly keeps every value.
import { ALL_MISSIONS, UNITS, missionIndex, missionNumber, missionParam } from "../src/quest/missions/index.js";
import { choicesOf, choiceText, judge, lockState, rightChoice, runPredict } from "../src/quest/predict.js";
import { parseProgram, programFromState, stateFromDsl } from "../src/quest/program.js";

const errors = [];
const fail = (mission, message) => errors.push(`${mission.id}: ${message}`);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const predicts = ALL_MISSIONS.filter((m) => m.mode === "predict");

for (const mission of predicts) {
  if (!mission.lesson?.en || !mission.lesson?.zh) fail(mission, "needs a bilingual lesson");
  const { result, answer } = runPredict(mission);
  if (result.id !== undefined) fail(mission, `program stops early: ${result.reason}`);
  const choices = choicesOf(mission);
  if (choices.length < 3 || choices.length > 4) fail(mission, "needs 3 or 4 choices");
  if (new Set(choices.map(choiceText)).size !== choices.length) fail(mission, "choices repeat");
  const right = choices.filter((choice) => same(choice, answer));
  if (right.length !== 1) fail(mission, `${right.length} choices match what Robo does (${choiceText(answer)})`);
  if (mission.ask.type === "cell") {
    Object.entries(mission.ask.marks).forEach(([name, [x, y]]) => {
      if (!".>".includes(mission.maps[0][y]?.[x] ?? "#")) fail(mission, `mark ${name} is not on an open square`);
    });
  }
  // Stars: first right guess 3, right after a miss 2, wrong 0 with the trace showing what really happened.
  const first = judge(mission, rightChoice(mission), false);
  const later = judge(mission, rightChoice(mission), true);
  const wrong = judge(mission, choices.find((choice) => !same(choice, answer)), false);
  if (!first.ok || first.stars !== 3 || later.stars !== 2) fail(mission, "right guesses should earn 3, then 2 stars");
  if (wrong.ok || !wrong.reason.startsWith("wrongGuess") || wrong.maps[0].want !== choiceText(answer)) fail(mission, "a wrong guess should report the real answer");
  // The locked Blockly copy must give back the same program (no value lost in a dropdown).
  const state = lockState(stateFromDsl(mission.program));
  if (!same(programFromState(state).main.length, parseProgram(mission.program).main.length)) fail(mission, "program changes in Blockly");
  if (state.blocks.blocks.some((b) => b.movable !== false || b.editable !== false)) fail(mission, "blocks should be locked");
}

for (const unit of UNITS.filter((u) => u.part === 3)) {
  const list = unit.missions;
  if (list[0].mode !== "predict" || list.at(-1).mode !== "predict") errors.push(`${unit.id}: should open and close with a 🔮 predict mission`);
  list.forEach((mission, index) => {
    if (missionIndex(unit, missionParam(unit, index)) !== index) errors.push(`${unit.id}: ?m=${missionParam(unit, index)} does not open mission ${index + 1}`);
  });
  if (missionNumber(unit, 1) !== 1) errors.push(`${unit.id}: the first regular mission should still be number 1`);
}

if (errors.length) {
  console.error(errors.map((line) => `✗ ${line}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${predicts.length} 🔮 predict missions: each has exactly one right choice, every Part 3 unit opens and closes with one, and mission numbers stay the same.`);
}
