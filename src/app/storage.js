import { CURRENT_LEVEL_KEY, CURRENT_LEVEL_ID_KEY, STORAGE_KEY } from "./constants.js";
import { LEVELS } from "../data/index.js";
import { LEGACY_LEVEL_IDS } from "../data/levels.js";
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
    const legacyIndex = Number(localStorage.getItem(CURRENT_LEVEL_KEY) || 0);
    const savedId = localStorage.getItem(CURRENT_LEVEL_ID_KEY) || LEGACY_LEVEL_IDS[legacyIndex];
    return Math.max(0, LEVELS.findIndex((level) => level.id === savedId));
  } catch {
    return 0;
  }
}

export function writeProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runtime.progress));
}
