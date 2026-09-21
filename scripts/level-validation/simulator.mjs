import { deltas, dirs } from "./context.mjs";
import { keyOf } from "./utils.mjs";
import { missingPractice } from "../../src/data/lesson-rules.js";

export function traceLevel(level, solution = level.solution) {
  const stats = { actions: 0, steps: [], usedTypes: new Set(), repeatDepth: 0, whileDepth: 0, conditions: {}, visits: {}, executed: new Set() };
  const walls = new Set(level.walls.map(keyOf));
  const gemKeys = new Set(level.gems.map(keyOf));
  const state = {
    x: level.start.x,
    y: level.start.y,
    dir: level.start.dir,
    collected: new Set(),
  };

  const inside = (point) =>
    point.x >= 0 && point.y >= 0 && point.x < level.grid.cols && point.y < level.grid.rows;
  const pointAhead = () => {
    const delta = deltas[state.dir];
    return { x: state.x + delta.x, y: state.y + delta.y };
  };
  const pointForTurn = (turn) => {
    const dir = dirs[(dirs.indexOf(state.dir) + turn + dirs.length) % dirs.length];
    const delta = deltas[dir];
    return { x: state.x + delta.x, y: state.y + delta.y };
  };
  const hasWon = () =>
    state.x === level.goal.x &&
    state.y === level.goal.y &&
    level.gems.every((gem) => state.collected.has(keyOf(gem)));
  const lessonDone = () => hasWon() && !missingPractice(level, stats.usedTypes).length &&
    stats.repeatDepth >= (level.minRepeatDepth || 0) &&
    stats.whileDepth >= (level.minWhileDepth || 0);

  function check(condition, path) {
    const matched = conditionMatches(condition);
    const entry = stats.conditions[path] ||= { condition, true: 0, false: 0 };
    entry[String(matched)] += 1;
    return matched;
  }

  function conditionMatches(condition) {
    if (condition === "ON_GEM") {
      const here = keyOf(state);
      return gemKeys.has(here) && !state.collected.has(here);
    }
    if (condition === "NOT_DONE") {
      return !hasWon();
    }

    const blockedAt = (point) => !inside(point) || walls.has(keyOf(point));
    const blocked = blockedAt(pointAhead());
    if (condition === "FRONT_CLEAR") {
      return !blocked;
    }
    if (condition === "FRONT_BLOCKED") {
      return blocked;
    }
    if (condition === "LEFT_CLEAR") {
      return !blockedAt(pointForTurn(-1));
    }
    if (condition === "RIGHT_CLEAR") {
      return !blockedAt(pointForTurn(1));
    }
    return false;
  }

  function runAction(item, parents) {
    stats.actions += 1;
    stats.steps.push({ type: item.type });
    if (stats.actions > 10000) throw new Error("action budget exceeded");
    parents.forEach((type) => stats.usedTypes.add(type));
    stats.repeatDepth = Math.max(stats.repeatDepth, parents.filter((type) => type === "repeat_times").length);
    stats.whileDepth = Math.max(stats.whileDepth, parents.filter((type) => type === "while_loop").length);
    if (item.type === "move_forward") {
      const next = pointAhead();
      if (!inside(next) || walls.has(keyOf(next))) {
        throw new Error(`hit wall from ${keyOf(state)} to ${keyOf(next)}`);
      }
      state.x = next.x;
      state.y = next.y;
      stats.visits[keyOf(state)] = (stats.visits[keyOf(state)] || 0) + 1;
      return lessonDone();
    }

    if (item.type === "turn_left" || item.type === "turn_right") {
      const turn = item.type === "turn_right" ? 1 : -1;
      state.dir = dirs[(dirs.indexOf(state.dir) + turn + dirs.length) % dirs.length];
      return lessonDone();
    }

    if (item.type === "collect_gem") {
      const here = keyOf(state);
      if (!gemKeys.has(here)) {
        throw new Error(`no gem at ${here}`);
      }
      if (state.collected.has(here)) {
        throw new Error(`gem already collected at ${here}`);
      }
      state.collected.add(here);
      return lessonDone();
    }

    throw new Error(`unknown block "${item.type}"`);
  }

  function runSequence(sequence = [], parents = [], prefix = "") {
    for (const [position, item] of sequence.entries()) {
      const path = `${prefix}${position}`;
      stats.executed.add(path);
      const nested = [...parents, item.type];
      if (item.type === "repeat_times") {
        const times = Math.max(1, Math.min(12, Number(item.times) || 1));
        for (let i = 0; i < times; i += 1) {
          if (runSequence(item.children || [], times > 1 ? nested : parents, `${path}.do.`)) {
            return true;
          }
        }
      } else if (item.type === "while_loop") {
        let guard = 0;
        while (check(item.condition, path)) {
          guard += 1;
          if (guard > 200) {
            throw new Error(`runaway while "${item.condition}" at ${keyOf(state)}`);
          }
          if (runSequence(item.children || [], nested, `${path}.do.`)) {
            return true;
          }
        }
      } else if (item.type === "if_condition") {
        if (check(item.condition, path) && runSequence(item.children || [], nested, `${path}.do.`)) {
          return true;
        }
      } else if (item.type === "if_else_condition") {
        const matched = check(item.condition, path);
        const branch = matched ? item.children || [] : item.elseChildren || [];
        if (runSequence(branch, nested, `${path}.${matched ? "do" : "else"}.`)) {
          return true;
        }
      } else if (runAction(item, parents)) {
        return true;
      }

      if (lessonDone()) {
        return true;
      }
    }
    return false;
  }

  try {
    const completed = runSequence(solution) || lessonDone();
    if (!completed) {
      return { ok: false, stats, state, error: `ended at ${keyOf(state)} facing ${state.dir}, collected ${state.collected.size}/${level.gems.length}; missing practice: ${missingPractice(level, stats.usedTypes).join(", ")}; repeat depth ${stats.repeatDepth}; while depth ${stats.whileDepth}` };
    }
  } catch (error) {
    return { ok: false, stats, state, error: error.message };
  }

  return { ok: true, stats, state };
}

export function simulateLevel(level, index) {
  const result = traceLevel(level);
  return result.ok ? [] : [`${index + 1} ${level.id}: ${result.error}`];
}
