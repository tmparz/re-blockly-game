import { LEVELS } from "../data/index.js";
import { createStartBlock } from "./quick-blocks.js";
import { defineBlocks, toolboxFor } from "./block-definitions.js";
import { els } from "./dom.js";
import { getBlockLimit } from "./game-state.js";
import { renderProgramBuilder } from "./program-builder.js";
import { runtime } from "./runtime.js";
import { syncProgramFromWorkspace } from "./program-xml.js";
import { t } from "./i18n.js";

export function initBlockly() {
  defineBlocks();

  const theme = Blockly.Theme.defineTheme("blockyEasy", {
    base: Blockly.Themes.Classic,
    componentStyles: {
      workspaceBackgroundColour: "#101828",
      toolboxBackgroundColour: "#0f172a",
      toolboxForegroundColour: "#f8fbff",
      flyoutBackgroundColour: "#172033",
      flyoutForegroundColour: "#f8fbff",
      flyoutOpacity: 1,
      scrollbarColour: "#39a3ff",
      insertionMarkerColour: "#22c55e",
      insertionMarkerOpacity: 0.45,
      cursorColour: "#22c55e",
    },
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
      colour: "#2e3a4f",
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
