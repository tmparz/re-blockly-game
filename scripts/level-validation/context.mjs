import { LEVELS, STAGES } from "../../src/data/index.js";
import { LEVEL_TRANSLATIONS, STAGE_TRANSLATIONS } from "../../src/i18n/index.js";

export const levels = LEVELS;
export const stages = STAGES;
export const levelTranslations = LEVEL_TRANSLATIONS;
export const stageTranslations = STAGE_TRANSLATIONS;
export const stageOrder = new Map(STAGES.map((stage, index) => [stage.id, index]));
export const stageIds = new Set(stageOrder.keys());
export const levelTextFields = ["title", "concept", "goalText", "hint"];
export const stageTextFields = ["title", "description"];
export const dirs = ["N", "E", "S", "W"];
export const deltas = {
  N: { x: 0, y: -1 }, E: { x: 1, y: 0 }, S: { x: 0, y: 1 }, W: { x: -1, y: 0 },
};
