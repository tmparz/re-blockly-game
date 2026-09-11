import { CURRENT_LEVEL_KEY, STORAGE_KEY } from "./constants.js";
import { LEVELS } from "../data/index.js";
import { runtime } from "./runtime.js";

export function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function readCurrentLevelIndex() {
  try {
    const index = Number(localStorage.getItem(CURRENT_LEVEL_KEY) || 0);
    return Math.max(0, Math.min(LEVELS.length - 1, Number.isFinite(index) ? index : 0));
  } catch {
    return 0;
  }
}

export function writeProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runtime.progress));
}
