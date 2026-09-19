import { DELTAS, DIRS } from "./constants.js";
import { LEVELS } from "../data/index.js";
import { countLessonBlocks } from "./blockly-workspace.js";
import { keyOf, samePoint, setStatus } from "./game-state.js";
import { renderBoard } from "./board-view.js";
import { runtime } from "./runtime.js";
import { t, blockLabel } from "./i18n.js";
import { missingPractice } from "../data/lesson-rules.js";

export function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function insideGrid(level, point) {
  return point.x >= 0 && point.y >= 0 && point.x < level.grid.cols && point.y < level.grid.rows;
}

export function wallSet(level) {
  return new Set(level.walls.map(keyOf));
}

export function pointAhead() {
  const delta = DELTAS[runtime.state.dir];
  return { x: runtime.state.x + delta.x, y: runtime.state.y + delta.y };
}

export function pointForTurn(turn) {
  const dir = DIRS[(DIRS.indexOf(runtime.state.dir) + turn + DIRS.length) % DIRS.length];
  const delta = DELTAS[dir];
  return { x: runtime.state.x + delta.x, y: runtime.state.y + delta.y };
}

export function conditionMatches(condition) {
  const level = LEVELS[runtime.currentLevelIndex];
  if (condition === "ON_GEM") {
    const gems = new Set(level.gems.map(keyOf));
    const here = keyOf(runtime.state);
    return gems.has(here) && !runtime.state.collected.has(here);
  }
  if (condition === "NOT_DONE") {
    const allGems = level.gems.every((gem) => runtime.state.collected.has(keyOf(gem)));
    return !samePoint(runtime.state, level.goal) || !allGems;
  }

  const walls = wallSet(level);
  const blockedAt = (point) => !insideGrid(level, point) || walls.has(keyOf(point));
  const blocked = blockedAt(pointAhead());
  if (condition === "FRONT_CLEAR") {
    return !blocked;
  }
  if (condition === "FRONT_BLOCKED") {
    return blocked;
  }
  if (condition === "LEFT_CLEAR") {
    return !blockedAt(pointForTurn(-1));
  }
  if (condition === "RIGHT_CLEAR") {
    return !blockedAt(pointForTurn(1));
  }
  return false;
}

export async function executeCommand(command) {
  const level = LEVELS[runtime.currentLevelIndex];
  if (command.type === "turn") {
    const nextIndex = (DIRS.indexOf(runtime.state.dir) + command.value + DIRS.length) % DIRS.length;
    runtime.state.dir = DIRS[nextIndex];
    setStatus(command.value > 0 ? t("turnRightStatus") : t("turnLeftStatus"), "neutral");
    renderBoard();
    return;
  }

  if (command.type === "move") {
    const delta = DELTAS[runtime.state.dir];
    const next = { x: runtime.state.x + delta.x, y: runtime.state.y + delta.y };
    const walls = wallSet(level);
    if (!insideGrid(level, next) || walls.has(keyOf(next))) {
      throw new Error(t("hitWall"));
    }
    runtime.state.x = next.x;
    runtime.state.y = next.y;
    setStatus(t("moveStatus"), "neutral");
    renderBoard();
    return;
  }

  if (command.type === "collect") {
    const here = keyOf(runtime.state);
    const gemKeys = new Set(level.gems.map(keyOf));
    if (!gemKeys.has(here)) {
      throw new Error(t("noGem"));
    }
    if (runtime.state.collected.has(here)) {
      throw new Error(t("gemAlready"));
    }
    runtime.state.collected.add(here);
    setStatus(t("collectStatus"), "neutral");
    renderBoard();
  }
}

export function evaluateWin() {
  const level = LEVELS[runtime.currentLevelIndex];
  const allGems = level.gems.every((gem) => runtime.state.collected.has(keyOf(gem)));
  const reachedGoal = samePoint(runtime.state, level.goal);

  if (!reachedGoal) {
    return { ok: false, message: t("noGoal") };
  }
  if (!allGems) {
    return { ok: false, message: t("missingGems") };
  }

  const missing = missingPractice(level, runtime.state.usedTypes);
  if (missing.length) {
    return { ok: false, message: t("practiceMissing", { blocks: missing.map(blockLabel).join("、") }) };
  }
  if (runtime.state.repeatDepth < (level.minRepeatDepth || 0)) {
    return { ok: false, message: t("practiceDepth", { depth: level.minRepeatDepth }) };
  }

  const blockCount = countLessonBlocks();
  const efficient = blockCount <= level.targetBlocks;
  const stars = efficient ? 3 : 1;

  return {
    ok: true,
    stars,
    message: t("passedStars", { stars }),
  };
}
