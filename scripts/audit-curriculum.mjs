import { LEVELS } from "../src/data/levels.js";
import { countBlocks } from "./level-validation/utils.mjs";

// This report flags candidates for human review; similarity alone is not a defect.
const groups = new Map();
for (const [index, level] of LEVELS.entries()) {
  const signature = JSON.stringify(level.solution);
  const group = groups.get(signature) || [];
  group.push(`${index + 1} ${level.id}`);
  groups.set(signature, group);
  if (level.start.x === level.goal.x && level.start.y === level.goal.y && !level.gems.length) {
    console.log(`Already at goal: ${index + 1} ${level.id}`);
  }
  if (countBlocks(level.solution) > 20) {
    console.log(`Long demo (${countBlocks(level.solution)} blocks): ${index + 1} ${level.id}`);
  }
}
for (const group of groups.values()) {
  if (group.length > 1) console.log(`Same demo: ${group.join(" / ")}`);
}
