import { deltas, dirs } from "./context.mjs";
import { keyOf } from "./utils.mjs";

export function simulateLevel(level, index) {
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

  function runAction(item) {
    if (item.type === "move_forward") {
      const next = pointAhead();
      if (!inside(next) || walls.has(keyOf(next))) {
        throw new Error(`hit wall from ${keyOf(state)} to ${keyOf(next)}`);
      }
      state.x = next.x;
      state.y = next.y;
      return hasWon();
    }

    if (item.type === "turn_left" || item.type === "turn_right") {
      const turn = item.type === "turn_right" ? 1 : -1;
      state.dir = dirs[(dirs.indexOf(state.dir) + turn + dirs.length) % dirs.length];
      return hasWon();
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
      return hasWon();
    }

    throw new Error(`unknown block "${item.type}"`);
  }

  function runSequence(sequence = []) {
    for (const item of sequence) {
      if (item.type === "repeat_times") {
        const times = Math.max(1, Math.min(12, Number(item.times) || 1));
        for (let i = 0; i < times; i += 1) {
          if (runSequence(item.children || [])) {
            return true;
          }
        }
      } else if (item.type === "while_loop") {
        let guard = 0;
        while (conditionMatches(item.condition)) {
          guard += 1;
          if (guard > 200) {
            throw new Error(`runaway while "${item.condition}" at ${keyOf(state)}`);
          }
          if (runSequence(item.children || [])) {
            return true;
          }
        }
      } else if (item.type === "if_condition") {
        if (conditionMatches(item.condition) && runSequence(item.children || [])) {
          return true;
        }
      } else if (item.type === "if_else_condition") {
        const branch = conditionMatches(item.condition) ? item.children || [] : item.elseChildren || [];
        if (runSequence(branch)) {
          return true;
        }
      } else if (runAction(item)) {
        return true;
      }

      if (hasWon()) {
        return true;
      }
    }
    return false;
  }

  try {
    const completed = runSequence(level.solution) || hasWon();
    if (!completed) {
      return [
        `${index + 1} ${level.id}: ended at ${keyOf(state)} facing ${state.dir}, collected ${state.collected.size}/${level.gems.length}`,
      ];
    }
  } catch (error) {
    return [`${index + 1} ${level.id}: ${error.message}`];
  }

  return [];
}
