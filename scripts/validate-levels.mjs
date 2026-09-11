import { levels, stageOrder } from "./level-validation/context.mjs";
import { validateLevelData, validateTextTranslations } from "./level-validation/checks.mjs";
import { simulateLevel } from "./level-validation/simulator.mjs";

const problems = [];
const ids = new Set();
let lastStageIndex = -1;

problems.push(...validateTextTranslations());
levels.forEach((level, index) => {
  if (ids.has(level.id)) problems.push(`${index + 1} ${level.id}: duplicate level id`);
  ids.add(level.id);
  const currentStageIndex = stageOrder.get(level.stage);
  if (currentStageIndex !== undefined) {
    if (currentStageIndex < lastStageIndex) {
      problems.push(`${index + 1} ${level.id}: stage "${level.stage}" is out of LEVELS order`);
    }
    lastStageIndex = Math.max(lastStageIndex, currentStageIndex);
  }
  problems.push(...validateLevelData(level, index));
  problems.push(...simulateLevel(level, index));
});

if (problems.length) {
  console.error(`Level validation failed with ${problems.length} issue(s):`);
  problems.forEach((problem) => console.error(`- ${problem}`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${levels.length} levels: bilingual text is complete, demo solutions pass, and block limits are respected.`);
}
