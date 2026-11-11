import { parseXml, safeText } from "./xml.js";
import { t, blockLabel, conditionOptions, repeatCountOptions } from "./i18n.js";
import { BLOCK_COLOURS, CATEGORY_COLOURS } from "./block-colours.js";

export function defineBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      type: "start",
      message0: t("startBlock"),
      nextStatement: null,
      colour: BLOCK_COLOURS.start,
      tooltip: t("startTooltip"),
    },
    {
      type: "move_forward",
      message0: blockLabel("move_forward"),
      previousStatement: null,
      nextStatement: null,
      colour: BLOCK_COLOURS.move_forward,
      tooltip: t("moveTooltip"),
    },
    {
      type: "turn_left",
      message0: blockLabel("turn_left"),
      previousStatement: null,
      nextStatement: null,
      colour: BLOCK_COLOURS.turn_left,
      tooltip: t("turnLeftTooltip"),
    },
    {
      type: "turn_right",
      message0: blockLabel("turn_right"),
      previousStatement: null,
      nextStatement: null,
      colour: BLOCK_COLOURS.turn_right,
      tooltip: t("turnRightTooltip"),
    },
    {
      type: "collect_gem",
      message0: blockLabel("collect_gem"),
      previousStatement: null,
      nextStatement: null,
      colour: BLOCK_COLOURS.collect_gem,
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
      colour: BLOCK_COLOURS.repeat_times,
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
      colour: BLOCK_COLOURS.while_loop,
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
      colour: BLOCK_COLOURS.if_condition,
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
      colour: BLOCK_COLOURS.if_else_condition,
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
    ? `<category name="${safeText(t("loopCategory"))}" colour="${CATEGORY_COLOURS.loop}">${loopInner}</category>`
    : "";
  const conditionBlocks = level.blocks.includes("if_condition")
    ? `<block type="if_condition"></block>`
    : "";
  const ifElseBlocks = level.blocks.includes("if_else_condition")
    ? `<block type="if_else_condition"></block>`
    : "";
  const conditionCategory = conditionBlocks || ifElseBlocks
    ? `<category name="${safeText(t("conditionCategory"))}" colour="${CATEGORY_COLOURS.condition}">${conditionBlocks}${ifElseBlocks}</category>`
    : "";

  return parseXml(`
    <xml xmlns="https://developers.google.com/blockly/xml">
      <category name="${safeText(t("actionCategory"))}" colour="${CATEGORY_COLOURS.action}">
        ${actionBlocks}
      </category>
      ${loopBlocks}
      ${conditionCategory}
    </xml>
  `);
}
