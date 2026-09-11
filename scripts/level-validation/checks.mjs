import {
  levelTextFields, levelTranslations, levels, stageIds, stages, stageTextFields, stageTranslations,
} from "./context.mjs";
import { collectTypes, countBlocks, hasText, keyOf } from "./utils.mjs";

export function validateTextTranslations() {
  const problems = [];
  const englishStages = stageTranslations.en || {};
  const englishLevels = levelTranslations.en || {};

  stages.forEach((stage, index) => {
    const label = `stage ${index + 1} ${stage.id}`;
    for (const field of stageTextFields) {
      if (!hasText(stage[field])) {
        problems.push(`${label}: missing zh ${field}`);
      }
      if (!hasText(englishStages[stage.id]?.[field])) {
        problems.push(`${label}: missing en ${field}`);
      }
    }
  });

  levels.forEach((level, index) => {
    const label = `${index + 1} ${level.id}`;
    for (const field of levelTextFields) {
      if (!hasText(level[field])) {
        problems.push(`${label}: missing zh ${field}`);
      }
      if (!hasText(englishLevels[level.id]?.[field])) {
        problems.push(`${label}: missing en ${field}`);
      }
    }
  });

  return problems;
}

export function validateLevelData(level, index) {
  const problems = [];
  const label = `${index + 1} ${level.id}`;
  const walls = new Set();
  const gems = new Set();

  if (!stageIds.has(level.stage)) {
    problems.push(`${label}: unknown stage "${level.stage}"`);
  }
  if (level.id.startsWith("while-") && level.stage !== "while") {
    problems.push(`${label}: while-prefixed level is in "${level.stage}" stage`);
  }
  if (level.id.startsWith("if-") && level.stage !== "if") {
    problems.push(`${label}: if-prefixed level is in "${level.stage}" stage`);
  }

  const inside = (point) =>
    point.x >= 0 && point.y >= 0 && point.x < level.grid.cols && point.y < level.grid.rows;

  if (!inside(level.start)) {
    problems.push(`${label}: start is outside the grid`);
  }
  if (!inside(level.goal)) {
    problems.push(`${label}: goal is outside the grid`);
  }

  for (const wall of level.walls) {
    const key = keyOf(wall);
    if (!inside(wall)) {
      problems.push(`${label}: wall ${key} is outside the grid`);
    }
    if (walls.has(key)) {
      problems.push(`${label}: duplicate wall at ${key}`);
    }
    walls.add(key);
  }

  for (const gem of level.gems) {
    const key = keyOf(gem);
    if (!inside(gem)) {
      problems.push(`${label}: gem ${key} is outside the grid`);
    }
    if (gems.has(key)) {
      problems.push(`${label}: duplicate gem at ${key}`);
    }
    if (walls.has(key)) {
      problems.push(`${label}: gem ${key} overlaps a wall`);
    }
    gems.add(key);
  }

  if (walls.has(keyOf(level.start))) {
    problems.push(`${label}: start overlaps a wall`);
  }
  if (walls.has(keyOf(level.goal))) {
    problems.push(`${label}: goal overlaps a wall`);
  }

  const allowed = new Set(level.blocks);
  for (const type of collectTypes(level.solution)) {
    if (!allowed.has(type)) {
      problems.push(`${label}: solution uses unavailable block "${type}"`);
    }
  }

  const blockCount = countBlocks(level.solution);
  const blockLimit = level.maxBlocks || level.targetBlocks;
  if (blockCount > blockLimit) {
    problems.push(`${label}: solution uses ${blockCount} blocks but limit is ${blockLimit}`);
  }

  return problems;
}
