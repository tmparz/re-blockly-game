import { LEVELS } from "../data/index.js";
import { countLessonBlocks } from "./blockly-workspace.js";
import { els } from "./dom.js";
import { renderBoard } from "./board-view.js";
import { runtime } from "./runtime.js";
import { t } from "./i18n.js";

export function keyOf(point) {
  return `${point.x},${point.y}`;
}

export function samePoint(a, b) {
  return a.x === b.x && a.y === b.y;
}

export function cloneStart(level) {
  return {
    x: level.start.x,
    y: level.start.y,
    dir: level.start.dir,
    collected: new Set(),
    usedTypes: new Set(),
    repeatDepth: 0,
  };
}

export function resetState() {
  const level = LEVELS[runtime.currentLevelIndex];
  runtime.state = cloneStart(level);
  setStatus(t("ready"), "neutral");
  setResult(t("defaultResult"), "neutral");
  renderBoard();
}

export function resetMapOnly() {
  if (runtime.isRunning) {
    return;
  }

  resetState();
  setResult(t("mapReset"), "neutral");
}

export function setStatus(text, mode) {
  els.runStatus.textContent = text;
  els.runStatus.classList.toggle("is-good", mode === "good");
  els.runStatus.classList.toggle("is-bad", mode === "bad");
}

export function setResult(text, mode) {
  els.resultLine.textContent = text;
  els.resultLine.classList.toggle("is-good", mode === "good");
  els.resultLine.classList.toggle("is-bad", mode === "bad");
}

export function getBlockLimit(level = LEVELS[runtime.currentLevelIndex]) {
  return level.maxBlocks || level.targetBlocks;
}

export function isOverBlockLimit() {
  return countLessonBlocks() > getBlockLimit();
}
