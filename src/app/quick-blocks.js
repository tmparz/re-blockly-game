import { LEVELS } from "../data/index.js";
import { els } from "./dom.js";
import { nextProgramId, countProgramBlocks, getTargetSequence } from "./program-model.js";
import { parseXml, safeText } from "./xml.js";
import { playFailSound } from "./audio.js";
import { runtime } from "./runtime.js";
import { setStatus, setResult, getBlockLimit } from "./game-state.js";
import { syncWorkspaceFromProgram } from "./program-xml.js";
import { t, blockLabel } from "./i18n.js";

export function createStartBlock() {
  const xml = parseXml(`
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="start" x="28" y="28" deletable="false" movable="true"></block>
    </xml>
  `);
  Blockly.Xml.domToWorkspace(xml, runtime.workspace);
}

export function getStartBlock() {
  if (!runtime.workspace) {
    return null;
  }
  return runtime.workspace.getTopBlocks(true).find((block) => block.type === "start") || null;
}

export function appendBlockToProgram(type) {
  if (!runtime.workspace || runtime.isRunning) {
    return;
  }

  if (countProgramBlocks() + 1 > getBlockLimit()) {
    playFailSound();
    setStatus(t("tooManyBlocks"), "bad");
    setResult(t("tooManyBlocksAdd", { limit: getBlockLimit() }), "bad");
    return;
  }

  const item = { id: nextProgramId(), type };
  if (type === "repeat_times") {
    item.times = 2;
    item.children = [];
  }
  if (type === "while_loop") {
    item.condition = "FRONT_CLEAR";
    item.children = [];
  }
  if (type === "if_condition") {
    item.condition = type === "if_condition" ? "FRONT_BLOCKED" : undefined;
    item.children = [];
  }
  if (type === "if_else_condition") {
    item.condition = "FRONT_BLOCKED";
    item.children = [];
    item.elseChildren = [];
  }

  getTargetSequence().push(item);
  if (item.children) {
    runtime.selectedContainerId = item.id;
  }

  syncWorkspaceFromProgram();
  setResult(
    item.children
      ? t("addedContainer", { label: blockLabel(type) })
      : t("addedBlock", { label: blockLabel(type) }),
    "neutral",
  );
}

export function renderQuickBlocks() {
  const level = LEVELS[runtime.currentLevelIndex];
  els.quickBlocks.innerHTML = level.blocks
    .map((type) => `<button class="quick-block-button" type="button" data-block-type="${type}">${safeText(blockLabel(type))}</button>`)
    .join("");

  els.quickBlocks.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => appendBlockToProgram(button.dataset.blockType));
  });
}
