// Draws a mission map and replays engine frames on it.
import { key, parseMap } from "./engine.js";

const ROBOT_SVG = `
<svg viewBox="0 0 100 100" aria-hidden="true">
  <line x1="50" y1="6" x2="50" y2="20" stroke="#304070" stroke-width="5" stroke-linecap="round"/>
  <circle cx="50" cy="7" r="6" fill="#ff6b6b"/>
  <rect x="18" y="20" width="64" height="60" rx="18" fill="#4f7cff" stroke="#304070" stroke-width="4"/>
  <circle cx="37" cy="40" r="10" fill="#fff"/><circle cx="63" cy="40" r="10" fill="#fff"/>
  <circle cx="37" cy="36" r="5" fill="#1b2340"/><circle cx="63" cy="36" r="5" fill="#1b2340"/>
  <path d="M38 62 Q50 70 62 62" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
  <rect x="10" y="74" width="20" height="16" rx="6" fill="#304070"/>
  <rect x="70" y="74" width="20" height="16" rx="6" fill="#304070"/>
</svg>`;

export function createBoard(element) {
  let map = null;
  let robot = null;
  let bubble = null;
  let counter = null;

  function place(x, y, rot) {
    robot.style.setProperty("--x", x);
    robot.style.setProperty("--y", y);
    robot.querySelector(".robot-body").style.transform = `rotate(${rot * 90}deg)`;
  }

  function draw(rows, { showCounter = false } = {}) {
    map = parseMap(rows);
    element.innerHTML = "";
    element.style.setProperty("--cols", map.w);
    element.style.setProperty("--rows", map.h);
    for (let y = 0; y < map.h; y += 1) {
      for (let x = 0; x < map.w; x += 1) {
        const cell = document.createElement("div");
        const ch = rows[y][x] ?? " ";
        cell.className = ch === "#" ? "cell wall" : ch === " " ? "cell void" : "cell floor";
        if (map.goal && map.goal.x === x && map.goal.y === y) cell.insertAdjacentHTML("beforeend", '<span class="goal">🏁</span>');
        if (map.gems.has(key(x, y))) {
          cell.insertAdjacentHTML("beforeend", `<span class="gem" data-gem="${key(x, y)}">💎</span>`);
        }
        element.append(cell);
      }
    }
    robot = document.createElement("div");
    robot.className = "robot";
    robot.innerHTML = `<div class="robot-body">${ROBOT_SVG}</div><div class="bubble" hidden></div>`;
    bubble = robot.querySelector(".bubble");
    element.append(robot);
    counter = document.createElement("div");
    counter.className = "counter-badge";
    counter.hidden = !showCounter;
    element.append(counter);
    reset();
  }

  function setCounter(value) {
    counter.textContent = `🔢 ${value}`;
  }

  function reset() {
    robot.classList.add("no-anim");
    place(map.start.x, map.start.y, map.start.dir);
    robot.getBoundingClientRect();
    robot.classList.remove("no-anim", "bump");
    bubble.hidden = true;
    element.querySelectorAll(".gem").forEach((gem) => gem.classList.remove("taken"));
    setCounter(0);
  }

  function apply(frame) {
    place(frame.x, frame.y, frame.rot);
    setCounter(frame.counter);
    if (frame.kind === "pick") element.querySelector(`[data-gem="${frame.gem}"]`)?.classList.add("taken");
    if (frame.kind === "say") {
      bubble.textContent = `💬 ${frame.value}`;
      bubble.hidden = false;
    }
    if (frame.kind === "bump") {
      robot.classList.remove("bump");
      robot.getBoundingClientRect();
      robot.classList.add("bump");
    }
  }

  return { draw, reset, apply };
}
