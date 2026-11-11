import { LEVELS } from "../data/index.js";
import { createStartBlock } from "./quick-blocks.js";
import { defineBlocks, toolboxFor } from "./block-definitions.js";
import { els } from "./dom.js";
import { getBlockLimit } from "./game-state.js";
import { renderProgramBuilder } from "./program-builder.js";
import { runtime } from "./runtime.js";
import { syncProgramFromWorkspace } from "./program-xml.js";
import { t } from "./i18n.js";
import { INK } from "./block-colours.js";

export function initBlockly() {
  defineBlocks();

  const theme = Blockly.Theme.defineTheme("blockyEasy", {
    base: Blockly.Themes.Classic,
    // Warm paper + ink palette from the ARZ AI Kids landing page.
    componentStyles: {
      workspaceBackgroundColour: "#FFFCF6",
      toolboxBackgroundColour: "#FFFFFF",
      toolboxForegroundColour: INK,
      flyoutBackgroundColour: "#F3EEE3",
      flyoutForegroundColour: INK,
      flyoutOpacity: 1,
      scrollbarColour: "#C9C2B6",
      insertionMarkerColour: INK,
      insertionMarkerOpacity: 0.3,
      cursorColour: INK,
    },
    fontStyle: { family: '"Huninn", "Noto Sans TC", sans-serif', weight: "bold", size: 13 },
  });

  runtime.workspace = Blockly.inject("blocklyDiv", {
    toolbox: toolboxFor(LEVELS[runtime.currentLevelIndex]),
    trashcan: true,
    scrollbars: true,
    sounds: false,
    renderer: "zelos",
    theme,
    grid: {
      spacing: 24,
      length: 3,
      colour: "#EDE5D6",
      snap: true,
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 0.92,
      maxScale: 1.25,
      minScale: 0.65,
      scaleSpeed: 1.1,
    },
  });

  runtime.workspace.addChangeListener(() => {
    if (!runtime.syncingWorkspace) {
      syncProgramFromWorkspace();
    }
    updateBlockCount();
  });
  createStartBlock();
  renderProgramBuilder();
  updateBlockCount();

  window.addEventListener("resize", () => {
    Blockly.svgResize(runtime.workspace);
  });

  // Blockly measures label widths at render time; if the Huninn web font arrives later,
  // force every field to re-measure so text never overflows its block.
  document.fonts?.load('bold 13px "Huninn"').then(() => {
    runtime.workspace.getAllBlocks(false).forEach((block) => {
      block.inputList.forEach((input) => input.fieldRow.forEach((field) => field.forceRerender()));
    });
  }).catch(() => {});
}

export function countLessonBlocks() {
  if (!runtime.workspace) {
    return 0;
  }
  return runtime.workspace.getAllBlocks(false).filter((block) => block.type !== "start").length;
}

export function updateBlockCount() {
  const count = countLessonBlocks();
  const limit = getBlockLimit();
  els.blockCount.textContent = t("blockCount", { count, limit });
  els.blockCount.classList.toggle("is-over-limit", count > limit);
}
