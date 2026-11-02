// Level Maker: tap the board to paint a level, then share it as a link.
import { parseMap } from "./engine.js";
import { usage } from "./program.js";
import { askConfirm } from "./ui.js";

const SIZES = [[6, 4], [7, 5], [8, 6], [10, 6]];
const TOOLS = [["floor", "⬜", "."], ["wall", "🧱", "#"], ["gem", "💎", "*"], ["goal", "🏁", "G"], ["start", "🤖", ">"]];
const TURN = { ">": "v", v: "<", "<": "^", "^": ">" };
const isStart = (ch) => ch in TURN;

function blankRows([w, h]) {
  return Array.from({ length: h }, (_, y) => (y === Math.floor(h / 2) ? `>${"#".repeat(w - 1)}` : "#".repeat(w)));
}

function resize(rows, [w, h]) {
  const grid = Array.from({ length: h }, (_, y) => (rows[y] ?? "").slice(0, w).padEnd(w, "#"));
  return grid.join("").match(/[<>^v]/) ? grid : blankRows([w, h]);
}

export function createMaker({ boardEl, toolsEl, goalsEl, t, isBusy = () => false, onMapChange }) {
  let rows = blankRows(SIZES[1]);
  let tool = "floor";
  let active = false;
  let solvedBlocks = null;
  let lastUsage = {};

  function counts() {
    const text = rows.join("");
    return { starts: (text.match(/[<>^v]/g) ?? []).length, goals: (text.match(/G/g) ?? []).length, gems: (text.match(/\*/g) ?? []).length };
  }

  function renderGoals() {
    const c = counts();
    const goals = [
      ["mk_goalMap", c.starts === 1 && c.goals === 1],
      ["mk_goalGems", c.gems >= 2],
      ["mk_goalFn", (lastUsage.def ?? 0) >= 1 && (lastUsage.call ?? 0) >= 2],
      ["mk_goalSolved", solvedBlocks != null],
    ];
    goalsEl.innerHTML = goals.map(([key, done]) => `<li data-done="${done}">${t(key)}</li>`).join("");
    toolsEl.querySelector("[data-act=share]").dataset.ready = String(solvedBlocks != null);
  }

  function changed(next) {
    rows = next;
    solvedBlocks = null;
    onMapChange(rows);
    renderGoals();
  }

  function paint(x, y) {
    const grid = rows.map((row) => [...row]);
    const [, , ch] = TOOLS.find(([id]) => id === tool);
    const here = grid[y][x];
    if (tool === "start" && isStart(here)) {
      grid[y][x] = TURN[here];
    } else {
      if (tool === "start" || tool === "goal") {
        grid.forEach((row, ry) => row.forEach((cell, rx) => {
          if ((tool === "start" && isStart(cell)) || (tool === "goal" && cell === "G")) grid[ry][rx] = ".";
        }));
      }
      grid[y][x] = ch;
    }
    changed(grid.map((row) => row.join("")));
  }

  async function share() {
    if (solvedBlocks == null) return t("mk_shareFirst");
    const url = `${location.origin}${location.pathname}?unit=functions&play=${encodeURIComponent(rows.join("/"))}&best=${solvedBlocks}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: t("mk_shareTitle"), url });
        return t("mk_shared");
      }
      await navigator.clipboard.writeText(url);
      return t("mk_copied");
    } catch {
      return `${t("mk_linkIs")} ${url}`;
    }
  }

  toolsEl.innerHTML = `
    ${TOOLS.map(([id, icon]) => `<button type="button" class="mk-tool" data-tool="${id}" title="${t(`mk_${id}`)}">${icon}<span>${t(`mk_${id}`)}</span></button>`).join("")}
    <button type="button" class="mk-act" data-act="size" title="${t("mk_size")}" aria-label="${t("mk_size")}">📐</button>
    <button type="button" class="mk-act" data-act="clear">🧹</button>
    <button type="button" class="mk-act mk-share" data-act="share">📤 ${t("mk_share")}</button>`;

  const renderTools = () => toolsEl.querySelectorAll("[data-tool]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tool === tool)));
  renderTools();

  toolsEl.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button || isBusy()) return;
    if (button.dataset.tool) {
      tool = button.dataset.tool;
      renderTools();
    }
    const act = button.dataset.act;
    if (act === "size") {
      const index = SIZES.findIndex(([w, h]) => w === rows[0].length && h === rows.length);
      changed(resize(rows, SIZES[(index + 1) % SIZES.length]));
    }
    if (act === "clear" && (await askConfirm(t("mk_confirmClear")))) changed(blankRows([rows[0].length, rows.length]));
    if (act === "share") toolsEl.dispatchEvent(new CustomEvent("maker-message", { detail: await share(), bubbles: true }));
  });

  boardEl.addEventListener("click", (event) => {
    const cell = event.target.closest(".cell");
    if (!active || !cell || isBusy()) return;
    const index = [...boardEl.querySelectorAll(".cell")].indexOf(cell);
    paint(index % rows[0].length, Math.floor(index / rows[0].length));
  });

  return {
    get rows() { return rows; },
    load(saved) {
      try {
        if (saved?.length) parseMap(saved);
        if (saved?.length) rows = saved;
      } catch {
        // A broken saved map falls back to a blank one.
      }
    },
    setRows: changed,
    reset() {
      tool = "floor";
      renderTools();
      changed(blankRows(SIZES[1]));
    },
    activate(on) {
      active = on;
      toolsEl.hidden = !on;
      goalsEl.hidden = !on;
      boardEl.classList.toggle("editing", on);
      document.body.classList.toggle("maker-mode", on);
      if (on) {
        renderGoals();
        requestAnimationFrame(() => document.querySelector(".mission-dot[aria-pressed=true]")?.scrollIntoView({ block: "nearest", inline: "nearest" }));
      }
    },
    update(program) {
      lastUsage = usage(program);
      solvedBlocks = null;
      if (active) renderGoals();
    },
    problem() {
      const c = counts();
      if (c.starts !== 1) return "mk_noStart";
      if (c.goals !== 1) return "mk_noGoal";
      if (c.gems < 2) return "mk_needGems";
      return null;
    },
    markSolved(blocks) {
      solvedBlocks = blocks;
      renderGoals();
    },
  };
}
