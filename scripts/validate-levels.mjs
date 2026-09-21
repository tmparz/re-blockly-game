import { levels, stageOrder } from "./level-validation/context.mjs";
import { validateLevelData, validateTextTranslations } from "./level-validation/checks.mjs";
import { simulateLevel } from "./level-validation/simulator.mjs";
import { validateCurriculumLevel } from "./level-validation/curriculum-checks.mjs";

const problems = [];
const ids = new Set();
const objectives = new Set();
const skills = new Set();
let lastStageIndex = -1;

problems.push(...validateTextTranslations());
levels.forEach((level, index) => {
  if (ids.has(level.id)) problems.push(`${index + 1} ${level.id}: duplicate level id`);
  ids.add(level.id);
  if (objectives.has(level.objective)) problems.push(`${index + 1} ${level.id}: duplicate learning objective`);
  objectives.add(level.objective);
  if (skills.has(level.newSkill)) problems.push(`${index + 1} ${level.id}: duplicate newSkill key "${level.newSkill}"`);
  skills.add(level.newSkill);
  const currentStageIndex = stageOrder.get(level.stage);
  if (currentStageIndex !== undefined) {
    if (currentStageIndex < lastStageIndex) {
      problems.push(`${index + 1} ${level.id}: stage "${level.stage}" is out of LEVELS order`);
    }
    lastStageIndex = Math.max(lastStageIndex, currentStageIndex);
  }
  problems.push(...validateLevelData(level, index));
  problems.push(...validateCurriculumLevel(level, index));
  problems.push(...simulateLevel(level, index));
});

if (problems.length) {
  console.error(`Level validation failed with ${problems.length} issue(s):`);
  problems.forEach((problem) => console.error(`- ${problem}`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${levels.length} levels: bilingual text is complete, demo solutions pass, and block limits are respected.`);
}
