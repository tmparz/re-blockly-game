import { parseXml, safeText } from "./xml.js";
import { t, blockLabel, conditionOptions, repeatCountOptions } from "./i18n.js";

export function defineBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      type: "start",
      message0: t("startBlock"),
      nextStatement: null,
      colour: 145,
      tooltip: t("startTooltip"),
    },
    {
      type: "move_forward",
      message0: blockLabel("move_forward"),
      previousStatement: null,
      nextStatement: null,
      colour: 205,
      tooltip: t("moveTooltip"),
    },
    {
      type: "turn_left",
      message0: blockLabel("turn_left"),
      previousStatement: null,
      nextStatement: null,
      colour: 260,
      tooltip: t("turnLeftTooltip"),
    },
    {
      type: "turn_right",
      message0: blockLabel("turn_right"),
      previousStatement: null,
      nextStatement: null,
      colour: 260,
      tooltip: t("turnRightTooltip"),
    },
    {
      type: "collect_gem",
      message0: blockLabel("collect_gem"),
      previousStatement: null,
      nextStatement: null,
      colour: 38,
      tooltip: t("collectTooltip"),
    },
    {
      type: "repeat_times",
      message0: t("repeatMessage"),
      args0: [
        {
          type: "field_dropdown",
          name: "TIMES",
          options: repeatCountOptions(),
        },
      ],
      message1: t("repeatDoMessage"),
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 42,
      tooltip: t("repeatTooltip"),
    },
    {
      type: "while_loop",
      message0: t("whileMessage"),
      args0: [
        {
          type: "field_dropdown",
          name: "COND",
          options: conditionOptions(),
        },
      ],
      message1: t("whileDoMessage"),
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 165,
      tooltip: t("whileTooltip"),
    },
    {
      type: "if_condition",
      message0: t("ifBlockMessage"),
      args0: [
        {
          type: "field_dropdown",
          name: "COND",
          options: conditionOptions(),
        },
      ],
      message1: t("ifDoMessage"),
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 12,
      tooltip: t("ifTooltip"),
    },
    {
      type: "if_else_condition",
      message0: t("ifBlockMessage"),
      args0: [
        {
          type: "field_dropdown",
          name: "COND",
          options: conditionOptions(),
        },
      ],
      message1: t("ifDoMessage"),
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      message2: t("elseDoMessage"),
      args2: [
        {
          type: "input_statement",
          name: "ELSE",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 12,
      tooltip: t("ifElseTooltip"),
    },
  ]);
}

export function toolboxFor(level) {
  const actionBlocks = level.blocks
    .filter((type) => type !== "repeat_times" && type !== "while_loop" && type !== "if_condition" && type !== "if_else_condition")
    .map((type) => `<block type="${type}"></block>`)
    .join("");
  const hasRepeat = level.blocks.includes("repeat_times");
  const hasWhile = level.blocks.includes("while_loop");
  const loopInner = [
    hasRepeat ? `<block type="repeat_times"><field name="TIMES">2</field></block>` : "",
    hasWhile ? `<block type="while_loop"></block>` : "",
  ].filter(Boolean).join("");
  const loopBlocks = loopInner
    ? `<category name="${safeText(t("loopCategory"))}" colour="#f4b63f">${loopInner}</category>`
    : "";
  const conditionBlocks = level.blocks.includes("if_condition")
    ? `<block type="if_condition"></block>`
    : "";
  const ifElseBlocks = level.blocks.includes("if_else_condition")
    ? `<block type="if_else_condition"></block>`
    : "";
  const conditionCategory = conditionBlocks || ifElseBlocks
    ? `<category name="${safeText(t("conditionCategory"))}" colour="#ef5962">${conditionBlocks}${ifElseBlocks}</category>`
    : "";

  return parseXml(`
    <xml xmlns="https://developers.google.com/blockly/xml">
      <category name="${safeText(t("actionCategory"))}" colour="#1d8fea">
        ${actionBlocks}
      </category>
      ${loopBlocks}
      ${conditionCategory}
    </xml>
  `);
}
