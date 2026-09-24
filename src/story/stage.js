// The stage: backdrop, characters, speech bubbles, score and celebrations. Every action returns a Promise.
import { ACTORS, ACTOR_IDS, FEELINGS } from "./actors.js";
import { sceneSvg, SCENE_NAMES } from "./scenes.js";
import { pick } from "./i18n.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const SPOTS = { left: 16, middle: 50, right: 84 };
const clamp = (x) => Math.max(7, Math.min(93, x));

export function createStage(root) {
  root.innerHTML = `
    <div class="scene"></div>
    <div class="scene-label"></div>
    <div class="score-badge" hidden></div>
    <div class="actors"></div>
    <div class="confetti" aria-hidden="true"></div>`;
  const sceneEl = root.querySelector(".scene");
  const labelEl = root.querySelector(".scene-label");
  const scoreEl = root.querySelector(".score-badge");
  const confettiEl = root.querySelector(".confetti");
  const state = {};
  const els = {};
  let score = null;
  let clickHandler = () => {};

  for (const id of ACTOR_IDS) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "actor";
    el.dataset.actor = id;
    el.innerHTML = `<div class="bubble"></div><div class="feel"></div>
      <div class="body"><span class="emoji">${ACTORS[id].emoji}</span></div><span class="name">${pick(ACTORS[id].name)}</span>`;
    el.setAttribute("aria-label", pick(ACTORS[id].name));
    el.addEventListener("click", () => {
      el.querySelector(".emoji").animate([{ transform: "scale(1)" }, { transform: "scale(.88)" }, { transform: "scale(1)" }], 180);
      clickHandler(id);
    });
    root.querySelector(".actors").append(el);
    els[id] = { root: el, body: el.querySelector(".body"), emoji: el.querySelector(".emoji"),
      bubble: el.querySelector(".bubble"), feel: el.querySelector(".feel") };
  }

  const applyBody = (id) => {
    const { facing, size } = state[id];
    els[id].body.style.transform = `scale(${facing * size}, ${size})`;
  };
  const place = (id, ms = 0) => {
    els[id].root.style.transitionDuration = `${ms}ms, .3s, .3s`;
    els[id].root.style.left = `${state[id].x}%`;
  };

  function setScene(id, animate = true) {
    const old = sceneEl.firstElementChild;
    sceneEl.insertAdjacentHTML("beforeend", sceneSvg(id));
    labelEl.textContent = pick(SCENE_NAMES[id]);
    if (!old) return sleep(0);
    if (!animate) {
      old.remove();
      return sleep(0);
    }
    return old.animate([{ opacity: 1 }, { opacity: 0 }], 450).finished.then(() => old.remove());
  }

  function reset() {
    for (const id of ACTOR_IDS) {
      state[id] = { x: ACTORS[id].x, facing: 1, size: 1, visible: ACTORS[id].visible, bubble: 0 };
      place(id);
      applyBody(id);
      els[id].root.classList.toggle("hidden", !state[id].visible);
      els[id].bubble.className = "bubble";
      els[id].feel.textContent = "";
    }
    score = null;
    scoreEl.hidden = true;
    sceneEl.innerHTML = "";
    setScene("home", false);
  }

  async function walkTo(id, x) {
    const target = clamp(x);
    const distance = Math.abs(target - state[id].x);
    if (target !== state[id].x) {
      state[id].facing = target > state[id].x ? 1 : -1;
      applyBody(id);
    }
    const ms = Math.max(250, distance * 32);
    state[id].x = target;
    place(id, ms);
    const hops = Math.max(1, Math.round(ms / 260));
    await els[id].emoji.animate([{ transform: "translateY(0)" }, { transform: "translateY(-10%)" }, { transform: "translateY(0)" }],
      { duration: ms / hops, iterations: hops }).finished;
  }

  function hideBubbles() {
    ACTOR_IDS.forEach((id) => { state[id].bubble += 1; els[id].bubble.className = "bubble"; });
  }

  reset();

  return {
    reset,
    hideBubbles,
    setScene,
    onActorClick(handler) { clickHandler = handler; },
    move: (id, dir, steps) => walkTo(id, state[id].x + (dir === "right" ? 1 : -1) * steps * 8),
    goto: (id, spot) => walkTo(id, spot === "random" ? 10 + Math.random() * 80 : SPOTS[spot]),
    jump: (id) => els[id].emoji.animate([{ transform: "translateY(0)" }, { transform: "translateY(-70%)", offset: 0.4 },
      { transform: "translateY(0)", easing: "ease-in" }], { duration: 550, easing: "ease-out" }).finished,
    spin: (id) => els[id].emoji.animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], 650).finished,
    async turn(id) {
      state[id].facing *= -1;
      applyBody(id);
      await sleep(300);
    },
    async say(id, text, seconds, kind = "say") {
      const ticket = ++state[id].bubble;
      const bubble = els[id].bubble;
      bubble.className = `bubble show ${kind}`;
      bubble.textContent = "";
      const chars = [...String(text)];
      const gap = Math.min(45, 600 / Math.max(1, chars.length));
      for (const ch of chars) {
        if (ticket !== state[id].bubble) return;
        bubble.textContent += ch;
        await sleep(gap);
      }
      await sleep(seconds * 1000);
      if (ticket === state[id].bubble) bubble.className = "bubble";
    },
    async feel(id, feeling) {
      els[id].feel.textContent = FEELINGS[feeling] ?? "";
      if (feeling !== "none") await els[id].feel.animate([{ transform: "scale(0)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }], 350).finished;
    },
    async size(id, value) {
      state[id].size = { big: 1.5, small: 0.6, normal: 1 }[value] ?? 1;
      applyBody(id);
      await sleep(350);
    },
    async visible(id, show) {
      state[id].visible = show;
      els[id].root.classList.toggle("hidden", !show);
      await sleep(300);
    },
    get score() { return score ?? 0; },
    async setScore(value) {
      score = value;
      scoreEl.hidden = false;
      scoreEl.textContent = `⭐ ${score}`;
      await scoreEl.animate([{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], 300).finished;
    },
    changeScore(delta) { return this.setScore((score ?? 0) + delta); },
    confetti() {
      const pieces = ["🎉", "⭐", "✨", "🎊", "💖", "🌟"];
      for (let i = 0; i < 36; i += 1) {
        const piece = document.createElement("span");
        piece.textContent = pieces[i % pieces.length];
        piece.style.left = `${Math.random() * 100}%`;
        confettiEl.append(piece);
        piece.animate([{ transform: "translateY(-10%) rotate(0)", opacity: 1 },
          { transform: `translateY(${Math.round(confettiEl.clientHeight * (1.1 + Math.random() * 0.2))}px) rotate(${Math.random() * 720}deg)`, opacity: 0.9 }],
        { duration: 1600 + Math.random() * 1200, delay: Math.random() * 400, easing: "ease-in" }).finished.then(() => piece.remove());
      }
    },
  };
}
