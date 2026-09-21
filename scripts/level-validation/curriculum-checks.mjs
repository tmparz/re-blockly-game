import { lessonRequirements } from "../../src/data/lesson-rules.js";
import { keyOf } from "./utils.mjs";

const types = new Set(["move_forward", "turn_left", "turn_right", "collect_gem",
  "repeat_times", "while_loop", "if_condition", "if_else_condition"]);
const conditions = new Set(["FRONT_CLEAR", "FRONT_BLOCKED", "LEFT_CLEAR", "RIGHT_CLEAR", "NOT_DONE", "ON_GEM"]);
const roles = new Set(["introduce", "practice", "transfer", "integrate", "generalize"]);

export function validateCurriculumLevel(level, index) {
  const problems = [];
  const fail = (message) => problems.push(`${index + 1} ${level.id}: ${message}`);
  if (!level.objective?.trim()) fail("missing learning objective");
  if (!roles.has(level.role)) fail(`invalid pedagogy role: ${level.role}`);
  if (!level.newSkill?.trim()) fail("missing newSkill curriculum key");
  if (!Array.isArray(level.reinforces)) fail("reinforces must be an array");
  if (level.start.x === level.goal.x && level.start.y === level.goal.y && !level.gems.length) {
    fail("start is already a completed mission; a patrol needs observable objectives");
  }
  for (const type of lessonRequirements(level)) {
    if (!level.blocks.includes(type)) fail(`required practice block is unavailable: ${type}`);
  }
  if (level.minRepeatDepth && (!Number.isInteger(level.minRepeatDepth) || level.minRepeatDepth < 2)) {
    fail("invalid minimum repeat depth");
  }
  if (level.minWhileDepth && (!Number.isInteger(level.minWhileDepth) || level.minWhileDepth < 2)) {
    fail("invalid minimum while depth");
  }
  function visit(sequence) {
    for (const item of sequence) {
      if (!types.has(item.type)) fail(`unknown solution block: ${item.type}`);
      if (item.type === "repeat_times" && (!Number.isInteger(item.times) || item.times < 2 || item.times > 12)) {
        fail("reference Repeat counts must be 2..12; Repeat 1 has no teaching purpose");
      }
      if (["while_loop", "if_condition", "if_else_condition"].includes(item.type) && !conditions.has(item.condition)) {
        fail(`unknown condition: ${item.condition}`);
      }
      if (["while_loop", "repeat_times", "if_condition", "if_else_condition"].includes(item.type) && !item.children?.length) {
        fail("reference control blocks must contain actions");
      }
      if (item.type === "if_else_condition" && !item.elseChildren?.length) fail("empty reference Else branch");
      visit(item.children || []);
      visit(item.elseChildren || []);
    }
  }
  visit(level.solution);
  const walls = new Set(level.walls.map(keyOf));
  const seen = new Set([keyOf(level.start)]);
  const queue = [level.start];
  for (let head = 0; head < queue.length; head += 1) {
    const point = queue[head];
    for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const next = { x: point.x + dx, y: point.y + dy };
      const key = keyOf(next);
      if (next.x < 0 || next.y < 0 || next.x >= level.grid.cols || next.y >= level.grid.rows || walls.has(key) || seen.has(key)) continue;
      seen.add(key);
      queue.push(next);
    }
  }
  for (const point of [level.goal, ...level.gems]) {
    if (!seen.has(keyOf(point))) fail(`unreachable objective: ${keyOf(point)}`);
  }
  return problems;
}
