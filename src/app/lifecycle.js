import { CURRENT_LEVEL_KEY, CURRENT_LEVEL_ID_KEY } from "./constants.js";
import { LEVELS } from "../data/index.js";
import { createStartBlock, renderQuickBlocks } from "./quick-blocks.js";
import { currentLang, LANGUAGE_KEY } from "./language.js";
import { els } from "./dom.js";
import { initBlockly, updateBlockCount } from "./blockly-workspace.js";
import { readCurrentLevelIndex } from "./storage.js";
import { renderLevels, updateNextLevelButtons } from "./level-view.js";
import { renderProgramBuilder, loadDemoProgram } from "./program-builder.js";
import { resetState, resetMapOnly, setStatus, getBlockLimit } from "./game-state.js";
import { runProgram } from "./runner.js";
import { runtime } from "./runtime.js";
import { syncWorkspaceFromProgram } from "./program-xml.js";
import { t, levelText, blockLabel, setButtonText, applyStaticTranslations } from "./i18n.js";
import { lessonRequirements } from "../data/lesson-rules.js";
import { targetParts, findProgramItem, findProgramParentId } from "./program-model.js";
import { toolboxFor } from "./block-definitions.js";

export function goToNextLevel() {
  if (runtime.isRunning || runtime.currentLevelIndex >= LEVELS.length - 1) {
    return;
  }
  loadLevel(runtime.currentLevelIndex + 1);
}

export function loadLevel(index) {
  if (runtime.isRunning || index === runtime.currentLevelIndex) {
    return;
  }

  runtime.currentLevelIndex = index;
  try {
    localStorage.setItem(CURRENT_LEVEL_KEY, String(index));
    localStorage.setItem(CURRENT_LEVEL_ID_KEY, LEVELS[index].id);
  } catch {
    // Progress still works without persistent storage.
  }
  const level = LEVELS[runtime.currentLevelIndex];
  els.levelKicker.textContent = t("levelKicker", { number: index + 1 });
  els.levelTitle.textContent = levelText(level, "title");
  els.levelGoal.textContent = levelText(level, "goalText");
  const required = lessonRequirements(level);
  if (required.length) {
    els.levelGoal.textContent += " " + t("practiceRequired", { blocks: required.map(blockLabel).join("、") });
  }
  if (level.minRepeatDepth) {
    els.levelGoal.textContent += " " + t("practiceDepthRequired", { depth: level.minRepeatDepth });
  }
  if (level.minWhileDepth) {
    els.levelGoal.textContent += " " + t("practiceWhileDepthRequired", { depth: level.minWhileDepth });
  }
  els.levelConcept.textContent = levelText(level, "concept");
  els.blockLimit.textContent = t("blockLimit", { limit: getBlockLimit(level) });
  els.mapTitle.textContent = levelText(level, "title") || t("mapTitleFallback");
  els.hint.textContent = levelText(level, "hint");
  els.hint.hidden = true;
  els.hintToggle.setAttribute("aria-expanded", "false");
  setButtonText(els.hintToggle, t("showHint"));
  renderQuickBlocks();
  runtime.programStructure = [];
  runtime.selectedContainerId = "root";

  if (runtime.workspace) {
    runtime.workspace.clear();
    runtime.workspace.updateToolbox(toolboxFor(level));
    createStartBlock();
    Blockly.svgResize(runtime.workspace);
  }

  resetState();
  renderProgramBuilder();
  renderLevels();
  updateBlockCount();
  updateNextLevelButtons();
}

export function bindEvents() {
  els.runButton.addEventListener("click", runProgram);
  els.resetButton.addEventListener("click", () => {
    resetState();
    if (runtime.workspace) {
      runtime.programStructure = [];
      runtime.selectedContainerId = "root";
      syncWorkspaceFromProgram();
    }
  });
  els.resetMapButton.addEventListener("click", resetMapOnly);
  els.demoButton.addEventListener("click", loadDemoProgram);
  els.nextLevelButton.addEventListener("click", goToNextLevel);
  els.nextLevelStatusButton.addEventListener("click", goToNextLevel);
  els.levelSelect.addEventListener("change", () => {
    loadLevel(Number(els.levelSelect.value));
  });
  els.parentTargetButton.addEventListener("click", () => {
    runtime.selectedContainerId = findProgramParentId(runtime.selectedContainerId) || "root";
    renderProgramBuilder();
  });
  els.branchTargetButton.addEventListener("click", () => {
    const { itemId, branch } = targetParts(runtime.selectedContainerId);
    const item = findProgramItem(itemId);
    if (item?.type !== "if_else_condition") {
      runtime.selectedContainerId = "root";
    } else {
      runtime.selectedContainerId = branch === "else" ? item.id : `${item.id}:else`;
    }
    renderProgramBuilder();
  });
  els.rootTargetButton.addEventListener("click", () => {
    runtime.selectedContainerId = "root";
    renderProgramBuilder();
  });

  els.hintToggle.addEventListener("click", () => {
    const open = els.hint.hidden;
    els.hint.hidden = !open;
    els.hintToggle.setAttribute("aria-expanded", String(open));
    setButtonText(els.hintToggle, open ? t("hideHint") : t("showHint"));
  });

  els.langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextLang = button.dataset.lang === "en" ? "en" : "zh";
      if (nextLang === currentLang) {
        return;
      }
      try {
        localStorage.setItem(LANGUAGE_KEY, nextLang);
      } catch {
        // The language switch can fall back to the current page language.
      }
      window.location.reload();
    });
  });
}

export function boot() {
  applyStaticTranslations();
  bindEvents();
  const initialLevelIndex = readCurrentLevelIndex();
  renderLevels();
  loadLevel(initialLevelIndex);

  if (!window.Blockly) {
    els.loadWarning.hidden = false;
    els.runButton.disabled = true;
    setStatus(t("missingBlockly"), "bad");
    return;
  }

  initBlockly();
  loadLevel(initialLevelIndex);
}
