// Level Maker: tap the board to paint a level, then share it as a link.
// Each maker mission sets how many maps to draw and which goals to check (mission.maker).
import { parseMap } from "./engine.js";
import { usage } from "./program.js";
import { askConfirm } from "./ui.js";

const SIZES = [[6, 4], [7, 5], [8, 6], [10, 6]];
const TOOLS = [["floor", "⬜", "."], ["wall", "🧱", "#"], ["gem", "💎", "*"], ["goal", "🏁", "G"], ["start", "🤖", ">"]];
const TURN = { ">": "v", v: "<", "<": "^", "^": ">" };
const isStart = (ch) => ch in TURN;
const count = (rows, pattern) => (rows.join("").match(pattern) ?? []).length;
const tally = (rows) => ({ starts: count(rows, /[<>^v]/g), goals: count(rows, /G/g), gems: count(rows, /\*/g) });

function blankRows([w, h]) {
  return Array.from({ length: h }, (_, y) => (y === Math.floor(h / 2) ? `>${"#".repeat(w - 1)}` : "#".repeat(w)));
}

function resize(rows, [w, h]) {
  const grid = Array.from({ length: h }, (_, y) => (rows[y] ?? "").slice(0, w).padEnd(w, "#"));
  return grid.join("").match(/[<>^v]/) ? grid : blankRows([w, h]);
}

const blankMaps = (n) => Array.from({ length: n }, () => blankRows(SIZES[1]));

function validMaps(saved, n) {
  try {
    if (!Array.isArray(saved) || saved.length !== n) return null;
    saved.forEach((rows) => parseMap(rows));
    return saved;
  } catch {
    return null;
  }
}

export function createMaker({ boardEl, toolsEl, goalsEl, t, mapIndex, onMapChange }) {
  let mission = null;
  let maps = blankMaps(1);
  let tool = "floor";
  let solvedBlocks = null;
  let lastUsage = {};

  const used = (op) => lastUsage[op] ?? 0;
  const GOALS = {
    map: () => maps.every((rows) => tally(rows).starts === 1 && tally(rows).goals === 1),
    gems: () => maps.every((rows) => tally(rows).gems >= 2),
    differ: () => maps.every((rows) => tally(rows).gems >= 1) && new Set(maps.map((rows) => tally(rows).gems)).size === maps.length,
    fn: () => used("def") >= 1 && used("call") >= 2,
    counter: () => used("set") >= 1 && used("change") >= 1 && used("say") >= 1,
    solved: () => solvedBlocks != null,
  };

  function renderGoals() {
    if (!mission) return;
    goalsEl.innerHTML = mission.maker.goals
      .map((key) => `<li data-done="${GOALS[key]()}">${t(`mk_goal_${key}`)}</li>`).join("");
    toolsEl.querySelector("[data-act=share]").dataset.ready = String(solvedBlocks != null);
  }

  function changed(next) {
    maps = next;
    solvedBlocks = null;
    onMapChange(maps);
    renderGoals();
  }

  const current = () => Math.min(mapIndex(), maps.length - 1);
  const replaceCurrent = (rows) => changed(maps.map((old, i) => (i === current() ? rows : old)));

  function paint(x, y) {
    const grid = maps[current()].map((row) => [...row]);
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
    replaceCurrent(grid.map((row) => row.join("")));
  }

  async function share() {
    if (solvedBlocks == null) return t("mk_shareFirst");
    const play = encodeURIComponent(maps.map((rows) => rows.join("/")).join("|"));
    const url = `${location.origin}${location.pathname}?unit=${mission.unit}&play=${play}&best=${solvedBlocks}`;
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
    if (!button) return;
    if (button.dataset.tool) {
      tool = button.dataset.tool;
      renderTools();
    }
    const act = button.dataset.act;
    const rows = maps[current()];
    if (act === "size") {
      const index = SIZES.findIndex(([w, h]) => w === rows[0].length && h === rows.length);
      replaceCurrent(resize(rows, SIZES[(index + 1) % SIZES.length]));
    }
    if (act === "clear" && (await askConfirm(t("mk_confirmClear")))) replaceCurrent(blankRows([rows[0].length, rows.length]));
    if (act === "share") toolsEl.dispatchEvent(new CustomEvent("maker-message", { detail: await share(), bubbles: true }));
  });

  boardEl.addEventListener("click", (event) => {
    const cell = event.target.closest(".cell");
    if (!mission || !cell) return;
    const width = maps[current()][0].length;
    const index = [...boardEl.querySelectorAll(".cell")].indexOf(cell);
    paint(index % width, Math.floor(index / width));
  });

  function show(on) {
    toolsEl.hidden = !on;
    goalsEl.hidden = !on;
    boardEl.classList.toggle("editing", on);
    document.body.classList.toggle("maker-mode", on);
  }

  return {
    // Opens a maker mission with the student's saved maps (or blank ones). Returns the maps to play on.
    open(next, saved) {
      mission = next;
      maps = validMaps(saved, next.maker.maps) ?? blankMaps(next.maker.maps);
      solvedBlocks = null;
      show(true);
      renderGoals();
      requestAnimationFrame(() => document.querySelector(".mission-dot[aria-pressed=true]")?.scrollIntoView({ block: "nearest", inline: "nearest" }));
      return maps;
    },
    close() {
      mission = null;
      show(false);
    },
    setMaps: changed,
    reset() {
      tool = "floor";
      renderTools();
      changed(blankMaps(mission.maker.maps));
    },
    update(program) {
      lastUsage = usage(program);
      solvedBlocks = null;
      renderGoals();
    },
    // What stops the level from being playable yet, as { reason, failedIndex } (or null).
    problem() {
      for (const [failedIndex, rows] of maps.entries()) {
        const c = tally(rows);
        if (c.starts !== 1) return { reason: "mk_noStart", failedIndex };
        if (c.goals !== 1) return { reason: "mk_noGoal", failedIndex };
        if (mission.maker.goals.includes("gems") && c.gems < 2) return { reason: "mk_needGems", failedIndex };
      }
      if (mission.maker.goals.includes("differ") && !GOALS.differ()) return { reason: "mk_needDiffer" };
      return null;
    },
    markSolved(blocks) {
      solvedBlocks = blocks;
      renderGoals();
    },
  };
}
