import { BLOCK_LABELS, LEVEL_TRANSLATIONS, STAGE_TRANSLATIONS, UI_TEXT } from "../i18n/index.js";
import { currentLang, LANGUAGE_KEY } from "./language.js";
import { els } from "./dom.js";

export function t(key, values = {}) {
  const source = UI_TEXT[currentLang]?.[key] ?? UI_TEXT.zh[key] ?? key;
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    source,
  );
}

export function stageText(stage, key) {
  return STAGE_TRANSLATIONS[currentLang]?.[stage.id]?.[key] || stage[key];
}

export function levelText(level, key) {
  return LEVEL_TRANSLATIONS[currentLang]?.[level.id]?.[key] || level[key];
}

export function blockLabel(type) {
  return BLOCK_LABELS[currentLang]?.[type] || BLOCK_LABELS.zh[type] || type;
}

export function conditionOptions() {
  return [
    [t("notDone"), "NOT_DONE"],
    [t("frontBlocked"), "FRONT_BLOCKED"],
    [t("frontClear"), "FRONT_CLEAR"],
    [t("leftClear"), "LEFT_CLEAR"],
    [t("rightClear"), "RIGHT_CLEAR"],
    [t("onGem"), "ON_GEM"],
  ];
}

export function repeatCountOptions() {
  return Array.from({ length: 12 }, (_, index) => {
    const value = String(index + 1);
    return [value, value];
  });
}

export function setButtonText(button, text) {
  const textNode = Array.from(button.childNodes)
    .reverse()
    .find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  if (textNode) {
    textNode.textContent = ` ${text}`;
    return;
  }
  button.append(document.createTextNode(` ${text}`));
}

export function applyStaticTranslations() {
  document.title = t("pageTitle");
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", t("pageDescription"));
  }

  els.totalStarsLabel.textContent = t("totalStars");
  els.missionEyebrow.textContent = t("missionBoard");
  els.workspaceEyebrow.textContent = t("workspaceEyebrow");
  els.workspaceTitle.textContent = t("workspaceTitle");
  els.quickBlocksLabel.textContent = t("quickBlocks");
  els.levelSelectLabel.textContent = t("chooseLevel");
  els.levelSelect.setAttribute("aria-label", t("chooseLevel"));
  els.branchTargetButton.textContent = t("elseTarget");
  els.parentTargetButton.textContent = t("parentTarget");
  els.rootTargetButton.textContent = t("rootProgram");
  els.speedLabel.textContent = t("speed");
  els.loadWarning.textContent = t("loadWarning");
  setButtonText(els.hintToggle, els.hint.hidden ? t("showHint") : t("hideHint"));
  setButtonText(els.runButton, t("run"));
  setButtonText(els.resetButton, t("reset"));
  setButtonText(els.resetMapButton, t("resetMap"));
  setButtonText(els.demoButton, t("demo"));
  setButtonText(els.nextLevelButton, t("nextLevel"));
  setButtonText(els.nextLevelStatusButton, t("nextLevel"));

  els.langButtons.forEach((button) => {
    const active = button.dataset.lang === currentLang;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
