import { LEVELS } from "../data/index.js";
import { els } from "./dom.js";
import { keyOf, samePoint } from "./game-state.js";
import { runtime } from "./runtime.js";

export function renderBoard() {
  const level = LEVELS[runtime.currentLevelIndex];
  const walls = new Set(level.walls.map(keyOf));
  const gems = new Map(level.gems.map((gem) => [keyOf(gem), gem]));

  els.board.style.setProperty("--cols", level.grid.cols);
  els.board.style.setProperty("--rows", level.grid.rows);
  els.board.innerHTML = "";

  for (let y = 0; y < level.grid.rows; y += 1) {
    for (let x = 0; x < level.grid.cols; x += 1) {
      const point = { x, y };
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = x;
      cell.dataset.y = y;

      if (walls.has(keyOf(point))) {
        cell.classList.add("is-wall");
      }

      if (samePoint(point, level.goal)) {
        const goal = document.createElement("span");
        goal.className = "goal";
        goal.setAttribute("aria-hidden", "true");
        cell.append(goal);
      }

      if (gems.has(keyOf(point))) {
        const gem = document.createElement("span");
        gem.className = `gem${runtime.state.collected.has(keyOf(point)) ? " is-collected" : ""}`;
        gem.setAttribute("aria-hidden", "true");
        cell.append(gem);
      }

      if (runtime.state.x === x && runtime.state.y === y) {
        const bot = document.createElement("span");
        bot.className = `bot dir-${runtime.state.dir.toLowerCase()}`;
        bot.setAttribute("aria-hidden", "true");
        cell.append(bot);
      }

      els.board.append(cell);
    }
  }
}
