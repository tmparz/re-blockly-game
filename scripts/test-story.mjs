// Validates Story Lab challenges: every example meets all goals, every starter does not, text is bilingual.
import { ALL_STORY_TASKS, checkGoals } from "../src/story/challenges.js";
import { PRODUCT_STEPS, PRODUCT_TASKS } from "../src/story/product.js";
import { GAME_STEPS, GAME_TASKS } from "../src/story/game.js";

const errors = [];
const ids = new Set();

for (const task of [...ALL_STORY_TASKS, ...PRODUCT_TASKS, ...GAME_TASKS]) {
  const fail = (message) => errors.push(`${task.id}: ${message}`);
  if (ids.has(task.id)) fail("duplicate id");
  ids.add(task.id);
  for (const field of ["title", "task"]) {
    if (!task[field]?.en?.trim() || !task[field]?.zh?.trim()) fail(`${field} needs en + zh`);
  }
  task.goals.forEach((g, i) => {
    if (!g.text.en?.trim() || !g.text.zh?.trim()) fail(`goal ${i + 1} needs en + zh`);
  });
  const example = checkGoals(task, task.example);
  example.forEach((ok, i) => { if (!ok) fail(`example misses goal ${i + 1}: ${task.goals[i].text.en}`); });
  if (checkGoals(task, task.starter).every(Boolean)) fail("starter already meets every goal");
  if (checkGoals(task, { blocks: { blocks: [] } }).some(Boolean)) fail("an empty workspace meets a goal");
}

// Product and Game Studio each grow one app: every version must still meet the goals of all earlier versions.
for (const steps of [PRODUCT_STEPS, GAME_STEPS]) {
  steps.forEach((step, index) => {
    steps.slice(0, index).forEach((earlier) => {
      checkGoals(earlier, step.example).forEach((ok, i) => {
        if (!ok) errors.push(`${step.id}: example breaks ${earlier.id} goal ${i + 1}: ${earlier.goals[i].text.en}`);
      });
    });
    if (index && JSON.stringify(step.starter) !== JSON.stringify(steps[index - 1].example)) {
      errors.push(`${step.id}: starter should be the previous version's example`);
    }
  });
}

if (errors.length) {
  console.error(errors.map((line) => `✗ ${line}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${ALL_STORY_TASKS.length} Story Lab tasks and ${PRODUCT_TASKS.length} Product Studio steps and ${GAME_TASKS.length} Game Studio steps: examples meet all goals, starters do not, each version keeps the last one working.`);
}
