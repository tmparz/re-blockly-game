// Lesson activities, part A (lessons 1–10). Every activity builds programs from the mission's own
// starter/solution and hands them to the player, which runs them with the real engine.
import { fnLabel } from "./missions.js";
import { blockCount, callsIn, inline } from "./run.js";
import { blockKind, blockLabel, esc, programHtml } from "./program-view.js";

const chips = (items) => items.map((item) => `<span class="mini ${blockKind(item)}">${esc(blockLabel(item))}</span>`).join("");

// Two (or more) ready programs, side by side: tap one to watch it.
export function toggle(el, ctx, cfg) {
  el.innerHTML = `<div class="choice-row">${cfg.items.map((item, i) => `
    <button type="button" class="big-choice" data-i="${i}">
      <strong>${esc(item.label)}</strong><span class="mini-row">${chips(item.dsl.main.length ? item.dsl.main : [])}${item.dsl.main.length ? "" : "<em>▶ 下面空空的</em>"}</span>
      <small>${esc(item.note)}</small></button>`).join("")}</div>`;
  el.addEventListener("click", (event) => {
    const button = event.target.closest(".big-choice");
    if (!button) return;
    el.querySelectorAll(".big-choice").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    const item = cfg.items[Number(button.dataset.i)];
    ctx.player.load(item.dsl, item.label, { autoplay: true });
  });
}

// A big number to turn up and down; build(k) makes the program for that number.
export function stepper(el, ctx, cfg) {
  let k = cfg.start;
  const draw = () => {
    const dsl = cfg.build(k);
    el.innerHTML = `<div class="stepper">
      <p class="stepper-title">${esc(cfg.title)}</p>
      <div class="stepper-row">
        <button type="button" class="round" data-d="-1" aria-label="少一個" ${k <= cfg.min ? "disabled" : ""}>−</button>
        <output class="big-number">${k}</output><span class="unit">${esc(cfg.unit)}</span>
        <button type="button" class="round" data-d="1" aria-label="多一個" ${k >= cfg.max ? "disabled" : ""}>＋</button>
        <button type="button" class="btn btn-run" data-go>▶ 跑跑看</button>
      </div>
      <div class="prog-list compact">${programHtml(dsl, ctx.mission.functions)}</div></div>`;
  };
  el.addEventListener("click", (event) => {
    const step = event.target.closest("[data-d]");
    if (step) {
      k = Math.min(cfg.max, Math.max(cfg.min, k + Number(step.dataset.d)));
      draw();
    }
    if (event.target.closest("[data-go]")) ctx.player.load(cfg.build(k), `${cfg.title}：${k} ${cfg.unit}`, { autoplay: true });
  });
  draw();
}

// Recipe cards: tap the functions in order to build the main program.
export function cards(el, ctx, cfg) {
  const chosen = [];
  const dsl = () => ({ main: chosen.map((name) => ({ call: name })), defs: ctx.mission.solution.defs });
  const draw = () => {
    el.innerHTML = `<div class="cards">${cfg.names.map((name) => `
      <button type="button" class="recipe-card" data-name="${esc(name)}" ${chosen.length >= cfg.max ? "disabled" : ""}>
        <strong>${esc(fnLabel(name))}</strong>
        <span class="mini-row">${chips(ctx.mission.solution.defs[name])}</span></button>`).join("")}</div>
      <p class="slots">▶ 按下執行時：${chosen.length ? chips(chosen.map((name) => ({ call: name }))) : "<em>（點上面的食譜卡放進來）</em>"}</p>
      <div class="row"><button type="button" class="btn btn-run" data-go ${chosen.length ? "" : "disabled"}>▶ 跑跑看</button>
      <button type="button" class="btn btn-soft" data-clear>🧹 清空</button></div>`;
  };
  el.addEventListener("click", (event) => {
    const card = event.target.closest(".recipe-card");
    if (card && chosen.length < cfg.max) chosen.push(card.dataset.name);
    if (event.target.closest("[data-clear]")) chosen.length = 0;
    if (event.target.closest("[data-go]")) ctx.player.load(dsl(), "我挑的食譜卡", { autoplay: true });
    if (card || event.target.closest("[data-clear]")) draw();
  });
  draw();
}

// Two programs next to each other, with their block counts.
export function compare(el, ctx, cfg) {
  el.innerHTML = `<div class="compare">${cfg.sides.map((side, i) => `
    <div class="side">
      <h4>${esc(side.label)} <span class="chip">${blockCount(side.dsl)} 個方塊</span></h4>
      <div class="prog-list compact">${programHtml(side.dsl, ctx.mission.functions)}</div>
      <button type="button" class="btn btn-run" data-i="${i}">▶ 跑「${esc(side.label)}」</button></div>`).join("")}</div>
    ${cfg.note ? `<p class="note">${esc(cfg.note)}</p>` : ""}`;
  el.addEventListener("click", (event) => {
    const button = event.target.closest("[data-i]");
    if (button) ctx.player.load(cfg.sides[button.dataset.i].dsl, cfg.sides[button.dataset.i].label, { autoplay: true });
  });
}

// The solution's main program, coloured: purple = function, blue = normal block.
export function mix(el, ctx) {
  const main = ctx.mission.solution.main;
  const fns = main.filter((item) => typeof item === "object" && "call" in item).length;
  el.innerHTML = `<div class="mix">
    <p class="mini-row big">${chips(main)}</p>
    <p class="legend"><span class="mini fn">紫色＝函式</span> ${fns} 個　<span class="mini turn">一般方塊</span> ${main.length - fns} 個，排在同一條主程式裡。</p></div>`;
}

// Live checklist while children write both the function and the main program.
export function checklist(el, ctx, cfg) {
  const draw = (dsl) => {
    const body = dsl.defs?.[cfg.name] ?? [];
    const used = callsIn(dsl.main).filter((name) => name === cfg.name).length;
    const want = callsIn(ctx.mission.solution.main).filter((name) => name === cfg.name).length;
    const rows = [
      [body.length > 0, `① 「${fnLabel(cfg.name)}」裡面寫了步驟（現在 ${body.length} 個）`],
      [used > 0, `② 「▶ 按下執行時」下面呼叫了它（現在 ${used} 次，要 ${want} 次）`],
      [used === want, "③ 呼叫的次數剛好"],
    ];
    el.innerHTML = `<ul class="checklist">${rows.map(([ok, text]) => `<li data-ok="${ok}">${ok ? "✅" : "⬜"} ${esc(text)}</li>`).join("")}</ul>`;
  };
  ctx.onEditorChange(draw);
  draw(ctx.editor.get());
}

// Many calls, one function: every call points at the same define box.
export function callmap(el, ctx, cfg) {
  const draw = (dsl) => {
    const calls = dsl.main.filter((item) => typeof item === "object" && item.call === cfg.name).length;
    const body = dsl.defs?.[cfg.name] ?? [];
    el.innerHTML = `<div class="callmap">
      <div class="calls">${Array.from({ length: calls }, (_, i) => `<span class="mini fn">第 ${i + 1} 次 ${esc(fnLabel(cfg.name))}</span>`).join("<span class=arrow>↘</span>")}</div>
      <p class="arrow-big">⬇ 全部都跑同一個 ⬇</p>
      <div class="prog def">🧩 定義 ${esc(fnLabel(cfg.name))}：${body.length ? chips(body) : "<em>（裡面是空的，Robo 不知道要做什麼）</em>"}</div></div>`;
  };
  ctx.onEditorChange(draw);
  draw(ctx.editor.get());
}

// Hallway lengths between the rooms, read from the solution's main program.
export function gaps(el, ctx, cfg) {
  const parts = [];
  let walk = 0;
  ctx.mission.solution.main.forEach((item) => {
    if (item === "move") walk += 1;
    else if (typeof item === "object" && item.call === cfg.name) {
      parts.push(`<span class="gap">走 ${walk} 格</span>`, `<span class="mini fn">${esc(fnLabel(cfg.name))}</span>`);
      walk = 0;
    }
  });
  parts.push(`<span class="gap">走 ${walk} 格</span>`, "<span>🏁</span>");
  el.innerHTML = `<div class="gaps">${parts.join("<span class=arrow>→</span>")}</div>
    <p class="note">每一段走廊的長度都不一樣，所以沒辦法用同一個「重複」包起來；但每個房間進出的方法都一樣，這就交給函式。</p>`;
}

// Everything opened up (no functions) next to the version with functions.
export const unfold = (el, ctx) => compare(el, ctx, {
  sides: [
    { label: "全部攤開（沒有函式）", dsl: { main: inline(ctx.mission.solution), defs: {} } },
    { label: "用函式收起來", dsl: ctx.mission.solution },
  ],
  note: "兩個程式讓 Robo 走的路一模一樣，可是用函式的那一個短很多，也看得出「哪一段在重複」。",
});
