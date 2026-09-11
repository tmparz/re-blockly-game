import { findProgramItem } from "./program-model.js";
import { getStartBlock } from "./quick-blocks.js";
import { parseXml, safeText } from "./xml.js";
import { renderProgramBuilder } from "./program-builder.js";
import { runtime } from "./runtime.js";
import { updateBlockCount } from "./blockly-workspace.js";

export function sequenceToXml(sequence) {
  if (!sequence.length) {
    return "";
  }

  const [current, ...rest] = sequence;
  const nextXml = rest.length ? `<next>${sequenceToXml(rest)}</next>` : "";

  if (current.type === "repeat_times") {
    return `
      <block type="repeat_times" id="${safeText(current.id)}">
        <field name="TIMES">${current.times || 1}</field>
        <statement name="DO">${sequenceToXml(current.children || [])}</statement>
        ${nextXml}
      </block>
    `;
  }

  if (current.type === "while_loop") {
    return `
      <block type="while_loop" id="${safeText(current.id)}">
        <field name="COND">${current.condition || "FRONT_CLEAR"}</field>
        <statement name="DO">${sequenceToXml(current.children || [])}</statement>
        ${nextXml}
      </block>
    `;
  }

  if (current.type === "if_condition") {
    return `
      <block type="if_condition" id="${safeText(current.id)}">
        <field name="COND">${current.condition || "FRONT_BLOCKED"}</field>
        <statement name="DO">${sequenceToXml(current.children || [])}</statement>
        ${nextXml}
      </block>
    `;
  }

  if (current.type === "if_else_condition") {
    return `
      <block type="if_else_condition" id="${safeText(current.id)}">
        <field name="COND">${current.condition || "FRONT_BLOCKED"}</field>
        <statement name="DO">${sequenceToXml(current.children || [])}</statement>
        <statement name="ELSE">${sequenceToXml(current.elseChildren || [])}</statement>
        ${nextXml}
      </block>
    `;
  }

  return `<block type="${current.type}" id="${safeText(current.id)}">${nextXml}</block>`;
}

export function programFromBlocks(block) {
  const sequence = [];
  let cursor = block;
  while (cursor) {
    const item = { id: cursor.id, type: cursor.type };
    if (cursor.type === "repeat_times") {
      item.times = Math.max(1, Math.min(12, Number(cursor.getFieldValue("TIMES")) || 1));
      item.children = programFromBlocks(cursor.getInputTargetBlock("DO"));
    } else if (cursor.type === "while_loop") {
      item.condition = cursor.getFieldValue("COND") || "FRONT_CLEAR";
      item.children = programFromBlocks(cursor.getInputTargetBlock("DO"));
    } else if (cursor.type === "if_condition") {
      item.condition = cursor.getFieldValue("COND") || "FRONT_BLOCKED";
      item.children = programFromBlocks(cursor.getInputTargetBlock("DO"));
    } else if (cursor.type === "if_else_condition") {
      item.condition = cursor.getFieldValue("COND") || "FRONT_BLOCKED";
      item.children = programFromBlocks(cursor.getInputTargetBlock("DO"));
      item.elseChildren = programFromBlocks(cursor.getInputTargetBlock("ELSE"));
    }
    sequence.push(item);
    cursor = cursor.getNextBlock();
  }
  return sequence;
}

export function syncProgramFromWorkspace() {
  if (!runtime.workspace || runtime.syncingWorkspace) {
    return;
  }
  const start = getStartBlock();
  runtime.programStructure = programFromBlocks(start?.getNextBlock() || null);
  if (runtime.selectedContainerId !== "root" && !findProgramItem(runtime.selectedContainerId)) {
    runtime.selectedContainerId = "root";
  }
  renderProgramBuilder();
}

export function syncWorkspaceFromProgram() {
  if (!runtime.workspace) {
    renderProgramBuilder();
    updateBlockCount();
    return;
  }

  runtime.syncingWorkspace = true;
  const xml = parseXml(`
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="start" x="28" y="28" deletable="false" movable="true">
        <next>${sequenceToXml(runtime.programStructure)}</next>
      </block>
    </xml>
  `);
  Blockly.Events.disable();
  try {
    runtime.workspace.clear();
    Blockly.Xml.domToWorkspace(xml, runtime.workspace);
    Blockly.svgResize(runtime.workspace);
  } finally {
    Blockly.Events.enable();
    runtime.syncingWorkspace = false;
  }
  renderProgramBuilder();
  updateBlockCount();
}
