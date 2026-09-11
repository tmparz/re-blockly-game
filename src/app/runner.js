import { LEVELS } from "../data/index.js";
import { delay, conditionMatches, executeCommand, evaluateWin } from "./game-rules.js";
import { els } from "./dom.js";
import { getCommands, countCommands } from "./commands.js";
import { prepareAudio, playSuccessSound, playFailSound } from "./audio.js";
import { renderBoard } from "./board-view.js";
import { renderLevels, updateNextLevelButtons } from "./level-view.js";
import { resetState, setStatus, setResult, getBlockLimit, isOverBlockLimit } from "./game-state.js";
import { runtime } from "./runtime.js";
import { t } from "./i18n.js";
import { writeProgress } from "./storage.js";

export function finishSuccess(result) {
  const level = LEVELS[runtime.currentLevelIndex];
  const best = Math.max(runtime.progress[level.id]?.stars || 0, result.stars);
  runtime.progress[level.id] = { stars: best, completedAt: new Date().toISOString() };
  writeProgress();
  renderLevels();
  playSuccessSound();
  setStatus(t("complete"), "good");
  setResult(result.message, "good");
}

export async function runCommandList(commands, commandTotal) {
  for (const command of commands) {
    if (runtime.workspace && command.blockId) {
      runtime.workspace.highlightBlock(command.blockId);
    }
    if (command.type === "highlight") {
      await delay(Math.min(100, Number(els.speedRange.value) || 50));
      continue;
    }

    if (command.type === "while") {
      let whileGuard = 0;
      while (conditionMatches(command.condition)) {
        whileGuard += 1;
        if (whileGuard > 200) {
          throw new Error(t("runaway"));
        }
        const nestedResult = await runCommandList(command.children || [], commandTotal);
        if (nestedResult) {
          return nestedResult;
        }
        await delay(Number(els.speedRange.value));
      }
      renderBoard();
    } else if (command.type === "if") {
      const matched = conditionMatches(command.condition);
      setStatus(matched ? t("conditionTrue") : t("conditionFalse"), "neutral");
      if (matched) {
        const nestedResult = await runCommandList(command.children || [], commandTotal);
        if (nestedResult) {
          return nestedResult;
        }
      }
      renderBoard();
    } else if (command.type === "if_else") {
      const matched = conditionMatches(command.condition);
      setStatus(matched ? t("conditionTrue") : t("conditionFalse"), "neutral");
      const branch = matched ? command.children || [] : command.elseChildren || [];
      const nestedResult = await runCommandList(branch, commandTotal);
      if (nestedResult) {
        return nestedResult;
      }
      renderBoard();
    } else {
      await executeCommand(command);
    }

    const stepResult = evaluateWin(commandTotal);
    if (stepResult.ok) {
      return stepResult;
    }
    await delay(Number(els.speedRange.value));
  }
  return null;
}

export async function runProgram() {
  if (runtime.isRunning || !runtime.workspace) {
    return;
  }

  const level = LEVELS[runtime.currentLevelIndex];
  await prepareAudio();
  let commands = [];
  try {
    if (isOverBlockLimit()) {
      throw new Error(t("cannotRunLimit", { limit: getBlockLimit() }));
    }
    commands = getCommands();
    if (commands.length === 0) {
      throw new Error(t("addBlocksFirst"));
    }
  } catch (error) {
    playFailSound();
    setStatus(t("cannotRun"), "bad");
    setResult(error.message, "bad");
    return;
  }

  runtime.isRunning = true;
  els.runButton.disabled = true;
  updateNextLevelButtons();
  resetState();
  setStatus(t("running"), "neutral");
  setResult(t("runningResult"), "neutral");

  try {
    const commandTotal = countCommands(commands);
    const earlyResult = await runCommandList(commands, commandTotal);
    if (earlyResult) {
      finishSuccess(earlyResult);
      return;
    }

    const result = evaluateWin(commandTotal);
    if (!result.ok) {
      playFailSound();
      setStatus(t("adjust"), "bad");
      setResult(result.message, "bad");
      return;
    }

    finishSuccess(result);
  } catch (error) {
    playFailSound();
    setStatus(t("adjust"), "bad");
    setResult(error.message, "bad");
  } finally {
    if (runtime.workspace) {
      runtime.workspace.highlightBlock(null);
    }
    runtime.isRunning = false;
    els.runButton.disabled = false;
    updateNextLevelButtons();
  }
}
