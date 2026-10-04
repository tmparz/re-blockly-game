// 🔮 Predict missions: work out the right choice by running the fixed program, and judge a student's guess.
import { runMap } from "./engine.js";
import { parseProgram } from "./program.js";

export const isPredict = (mission) => mission?.mode === "predict";
export const choicesOf = (mission) => (mission.ask.type === "cell" ? Object.keys(mission.ask.marks) : mission.choices);
export const choiceText = (choice) => (Array.isArray(choice) ? `[${choice.join(", ")}]` : String(choice));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// What really happens: the last thing Robo said, or the marked square it stops on.
export function outcomeOf(mission, result) {
  if (mission.ask.type === "cell") {
    const { x, y } = result.stats;
    return Object.entries(mission.ask.marks).find(([, [mx, my]]) => mx === x && my === y)?.[0] ?? null;
  }
  return result.stats.said.at(-1) ?? null;
}

export function runPredict(mission) {
  const result = runMap(parseProgram(mission.program), mission, mission.maps[0], 0);
  return { result, answer: outcomeOf(mission, result) };
}

export const rightChoice = (mission) => choicesOf(mission).find((choice) => same(choice, runPredict(mission).answer));

// Shaped like engine.evaluate() so the runner and the result line treat it like any other run.
// First right guess: ⭐⭐⭐; right after a wrong guess or a peek at the answer: ⭐⭐.
export function judge(mission, choice, missedBefore) {
  const { result, answer } = runPredict(mission);
  const ok = same(choice, answer);
  const map = { ...result, want: choiceText(answer), said: choiceText(choice) };
  return { ok, maps: [map], blocks: 0, reason: ok ? "success" : mission.ask.type === "cell" ? "wrongGuessCell" : "wrongGuess", failedIndex: ok ? undefined : 0, stars: ok ? (missedBefore ? 2 : 3) : 0 };
}

// The fixed program cannot be dragged, edited or deleted.
export function lockState(state) {
  const lock = (block) => {
    if (!block) return;
    Object.assign(block, { movable: false, editable: false, deletable: false });
    Object.values(block.inputs ?? {}).forEach((input) => lock(input.block));
    lock(block.next?.block);
  };
  state.blocks.blocks.forEach(lock);
  return state;
}
