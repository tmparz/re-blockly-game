import { LEVELS } from "../data/index.js";
import { cloneProgramItem, targetParts, findProgramItem, getTargetLabel } from "./program-model.js";
import { els } from "./dom.js";
import { resetState, setResult } from "./game-state.js";
import { runtime } from "./runtime.js";
import { safeText } from "./xml.js";
import { syncWorkspaceFromProgram } from "./program-xml.js";
import { t, blockLabel, conditionOptions } from "./i18n.js";

export function renderConditionSelect(item) {
  const options = conditionOptions()
    .map(([label, value]) => `<option value="${value}"${item.condition === value ? " selected" : ""}>${safeText(label)}</option>`)
    .join("");
  return `
    <label class="condition-select">
      <span>${safeText(t("condition"))}</span>
      <select data-condition-id="${item.id}">
        ${options}
      </select>
    </label>
  `;
}

export function renderProgramItem(item, depth = 0) {
  const isContainer =
    item.type === "repeat_times" || item.type === "while_loop" || item.type === "if_condition" || item.type === "if_else_condition";
  const selected = item.id === runtime.selectedContainerId ? " is-selected" : "";
  const depthStyle = ` style="--depth: ${depth}"`;
  const removeButton = `<button class="program-icon-button danger" type="button" data-remove-id="${item.id}" aria-label="${safeText(t("removeBlock", { label: blockLabel(item.type) }))}">×</button>`;

  if (item.type === "repeat_times") {
    return `
      <div class="program-item${selected}"${depthStyle}>
        <button class="program-chip is-container" type="button" data-select-container="${item.id}">${safeText(t("repeatChip", { times: item.times || 1 }))}</button>
        <button class="program-icon-button" type="button" data-repeat-dec="${item.id}" aria-label="${safeText(t("decreaseRepeat"))}">−</button>
        <button class="program-icon-button" type="button" data-repeat-inc="${item.id}" aria-label="${safeText(t("increaseRepeat"))}">＋</button>
        ${removeButton}
      </div>
      ${(item.children || []).map((child) => renderProgramItem(child, depth + 1)).join("")}
    `;
  }

  if (item.type === "while_loop") {
    return `
      <div class="program-item${selected}"${depthStyle}>
        <button class="program-chip is-container" type="button" data-select-container="${item.id}">${safeText(t("whileChip"))}</button>
        ${renderConditionSelect(item)}
        ${removeButton}
      </div>
      ${(item.children || []).map((child) => renderProgramItem(child, depth + 1)).join("")}
    `;
  }

  if (item.type === "if_condition") {
    return `
      <div class="program-item${selected}"${depthStyle}>
        <button class="program-chip is-container" type="button" data-select-container="${item.id}">${safeText(t("ifChip"))}</button>
        ${renderConditionSelect(item)}
        ${removeButton}
      </div>
      ${(item.children || []).map((child) => renderProgramItem(child, depth + 1)).join("")}
    `;
  }

  if (item.type === "if_else_condition") {
    const thenSelected = item.id === runtime.selectedContainerId ? " is-selected" : "";
    const elseSelected = `${item.id}:else` === runtime.selectedContainerId ? " is-selected" : "";
    return `
      <div class="program-item${thenSelected || elseSelected}"${depthStyle}>
        <button class="program-chip is-container${thenSelected}" type="button" data-select-container="${item.id}">${safeText(t("ifElseChip"))}</button>
        <button class="program-chip is-container${elseSelected}" type="button" data-select-container="${item.id}:else">${safeText(t("elseTarget"))}</button>
        ${renderConditionSelect(item)}
        ${removeButton}
      </div>
      ${(item.children || []).map((child) => renderProgramItem(child, depth + 1)).join("")}
      ${(item.elseChildren || []).map((child) => renderProgramItem(child, depth + 1)).join("")}
    `;
  }

  return `
    <div class="program-item"${depthStyle}>
      <span class="program-chip">${safeText(blockLabel(item.type))}</span>
      ${removeButton}
    </div>
  `;
}

export function renderProgramBuilder() {
  const { branch } = targetParts(runtime.selectedContainerId);
  const selectedItem = runtime.selectedContainerId === "root" ? null : findProgramItem(runtime.selectedContainerId);
  if (runtime.selectedContainerId !== "root" && !selectedItem) {
    runtime.selectedContainerId = "root";
  }
  els.quickTarget.textContent = getTargetLabel();
  const isNestedTarget = runtime.selectedContainerId !== "root";
  els.parentTargetButton.hidden = !isNestedTarget;
  els.rootTargetButton.hidden = !isNestedTarget;
  const canSwitchBranch = selectedItem?.type === "if_else_condition";
  els.branchTargetButton.hidden = !canSwitchBranch;
  if (canSwitchBranch) {
    els.branchTargetButton.textContent = branch === "else" ? t("ifTarget") : t("elseTarget");
  }
}

export function loadDemoProgram() {
  if (!runtime.workspace || runtime.isRunning) {
    return;
  }

  const level = LEVELS[runtime.currentLevelIndex];
  runtime.programStructure = level.solution.map(cloneProgramItem);
  runtime.selectedContainerId = "root";
  syncWorkspaceFromProgram();
  resetState();
  setResult(t("demoLoaded"), "neutral");
}
