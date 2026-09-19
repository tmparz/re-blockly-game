import { runtime } from "./runtime.js";
import { t } from "./i18n.js";

export function blockSequenceFrom(block, commands = [], parents = []) {
  let cursor = block;
  while (cursor) {
    if (commands.length > 120) {
      throw new Error(t("runaway"));
    }

    if (cursor.type === "move_forward") {
      commands.push({ type: "move", blockId: cursor.id, practiceTypes: parents });
    } else if (cursor.type === "turn_left") {
      commands.push({ type: "turn", value: -1, blockId: cursor.id, practiceTypes: parents });
    } else if (cursor.type === "turn_right") {
      commands.push({ type: "turn", value: 1, blockId: cursor.id, practiceTypes: parents });
    } else if (cursor.type === "collect_gem") {
      commands.push({ type: "collect", blockId: cursor.id, practiceTypes: parents });
    } else if (cursor.type === "if_condition") {
      commands.push({
        type: "if",
        condition: cursor.getFieldValue("COND"),
        children: blockSequenceFrom(cursor.getInputTargetBlock("DO"), [], [...parents, cursor.type]),
        blockId: cursor.id,
      });
    } else if (cursor.type === "if_else_condition") {
      commands.push({
        type: "if_else",
        condition: cursor.getFieldValue("COND"),
        children: blockSequenceFrom(cursor.getInputTargetBlock("DO"), [], [...parents, cursor.type]),
        elseChildren: blockSequenceFrom(cursor.getInputTargetBlock("ELSE"), [], [...parents, cursor.type]),
        blockId: cursor.id,
      });
    } else if (cursor.type === "repeat_times") {
      const times = Math.max(1, Math.min(12, Number(cursor.getFieldValue("TIMES")) || 1));
      commands.push({
        type: "repeat",
        times,
        children: blockSequenceFrom(cursor.getInputTargetBlock("DO"), [],
          times > 1 ? [...parents, cursor.type] : parents),
        blockId: cursor.id,
      });
    } else if (cursor.type === "while_loop") {
      commands.push({
        type: "while",
        condition: cursor.getFieldValue("COND"),
        children: blockSequenceFrom(cursor.getInputTargetBlock("DO"), [], [...parents, cursor.type]),
        blockId: cursor.id,
      });
    }

    cursor = cursor.getNextBlock();
  }
  return commands;
}

export function getCommands() {
  const starts = runtime.workspace.getTopBlocks(true).filter((block) => block.type === "start");
  const start = starts[0];
  if (!start) {
    throw new Error(t("noStart"));
  }
  return blockSequenceFrom(start.getNextBlock(), []);
}

export function countCommands(commands) {
  return commands.reduce((total, command) => {
    if (command.type === "while" || command.type === "repeat") {
      return total + 1 + countCommands(command.children || []);
    }
    if (command.type === "if") {
      return total + 1 + countCommands(command.children || []);
    }
    if (command.type === "if_else") {
      return total + 1 + countCommands(command.children || []) + countCommands(command.elseChildren || []);
    }
    return total + 1;
  }, 0);
}
