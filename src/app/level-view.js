import { LEVELS, STAGES } from "../data/index.js";
import { els } from "./dom.js";
import { getBlockLimit } from "./game-state.js";
import { runtime } from "./runtime.js";
import { safeText } from "./xml.js";
import { t, stageText, levelText, setButtonText } from "./i18n.js";

export function renderLevels() {
  els.levelSelect.innerHTML = STAGES.map((stage) => {
    const stageLevels = LEVELS
      .map((level, index) => ({ level, index }))
      .filter(({ level }) => level.stage === stage.id);

    if (!stageLevels.length) {
      return "";
    }

    const options = stageLevels.map(({ level, index }) => {
      const stars = runtime.progress[level.id]?.stars || 0;
      const title = t("levelCardTitle", { number: index + 1, title: levelText(level, "title") });
      const meta = `${levelText(level, "concept")} · ${t("limitShort", { limit: getBlockLimit(level) })} · ${"★".repeat(stars)}${"☆".repeat(3 - stars)}`;
      return `<option value="${index}">${safeText(`${title} - ${meta}`)}</option>`;
    }).join("");

    return `<optgroup label="${safeText(stageText(stage, "title"))}">${options}</optgroup>`;
  }).join("");

  if (runtime.currentLevelIndex >= 0) {
    els.levelSelect.value = String(runtime.currentLevelIndex);
  }

  const total = LEVELS.reduce((sum, level) => sum + (runtime.progress[level.id]?.stars || 0), 0);
  els.totalStars.textContent = `${total} / ${LEVELS.length * 3}`;
}

export function updateNextLevelButtons() {
  const isLastLevel = runtime.currentLevelIndex >= LEVELS.length - 1;
  [els.nextLevelButton, els.nextLevelStatusButton].forEach((button) => {
    button.disabled = runtime.isRunning || isLastLevel;
    setButtonText(button, isLastLevel ? t("lastLevel") : t("nextLevel"));
    button.setAttribute("aria-label", isLastLevel ? t("lastLevel") : t("nextLevel"));
  });
  els.resetMapButton.disabled = runtime.isRunning;
}
