// Lesson activities, part B (lessons 11–20): layers, recipes, mirrors and many maps.
import { createBoard } from "../quest/board.js";
import { fnLabel } from "./missions.js";
import { blockId, callsIn, entries, run, runAll, staticCalls, staticSteps } from "./run.js";
import { blockKind, blockLabel, esc } from "./program-view.js";

const chip = (item) => `<span class="mini ${blockKind(item)}">${esc(blockLabel(item))}</span>`;

// Live counter: how many times a function has started so far in the run being played.
export function counter(el, ctx, cfg) {
  const draw = (count, total) => {
    el.innerHTML = `<p class="counter">🔁 ${esc(fnLabel(cfg.name))} 已經做了 <strong>${count}</strong> 次${total == null ? "" : `（這次一共 ${total} 次）`}</p>`;
  };
  ctx.player.on("frame", (frame, state) => {
    const seen = state.result.frames.slice(0, state.at).filter((f) => f.id === blockId(cfg.name, 0)).length;
    draw(seen, entries(state.result, cfg.name));
  });
  draw(0);
}

// Nesting dolls: the solution with every function opened inside the block that calls it.
export function tree(el, ctx, cfg) {
  const dsl = ctx.mission.solution;
  const html = (items, depth) => `<ul class="tree">${items.map((item) => {
    if (typeof item === "string") return `<li>${chip(item)}</li>`;
    if ("call" in item) {
      return `<li class="t-fn d${Math.min(depth + 1, 3)}"><span class="t-label">${esc(fnLabel(item.call))} <small>第 ${depth + 1} 層</small></span>${html(dsl.defs[item.call] ?? [], depth + 1)}</li>`;
    }
    return `<li class="t-box">${chip(item)}${html(item.do ?? [], depth)}${item.else ? `<p class="else-tag">否則</p>${html(item.else, depth)}` : ""}</li>`;
  }).join("")}</ul>`;
  const counts = (cfg.count ?? []).map((name) => `<span class="mini fn">${esc(fnLabel(name))} 被呼叫 ${staticCalls(dsl, name)} 次</span>`).join(" ");
  el.innerHTML = `<div class="tree-box"><p class="t-root">▶ 主程式（第 0 層）</p>${html(dsl.main, 0)}</div>
    ${counts ? `<p class="mini-row">${counts}</p>` : ""}`;
}

// The main program as a numbered recipe: how many actions each step makes, and the total the engine really ran.
export function recipe(el, ctx) {
  const dsl = ctx.mission.solution;
  const ran = run(ctx.mission, dsl).frames.length;
  const rows = dsl.main.map((item, i) => `<li><span class="num">${i + 1}</span>${chip(item)}<span class="cost">${staticSteps(dsl, item)} 個動作</span></li>`);
  const total = dsl.main.reduce((sum, item) => sum + staticSteps(dsl, item), 0);
  el.innerHTML = `<ol class="recipe">${rows.join("")}</ol>
    <p class="note">主程式 <strong>${dsl.main.length}</strong> 步，加起來 <strong>${total}</strong> 個動作；真實引擎實際跑了 <strong>${ran}</strong> 個動作。</p>`;
}

// Two functions next to each other; the blocks that differ are marked.
export function mirror(el, ctx, cfg) {
  const [a, b] = cfg.names.map((name) => ctx.mission.solution.defs[name]);
  const col = (name, list, other) => `<div class="side"><h4>${esc(fnLabel(name))}</h4><ol class="blocks">${list.map((item, i) =>
    `<li class="blk ${blockKind(item)} ${JSON.stringify(item) === JSON.stringify(other[i]) ? "" : "diff"}"><span class="blk-row">${esc(blockLabel(item))}</span></li>`).join("")}</ol></div>`;
  el.innerHTML = `<div class="compare">${col(cfg.names[0], a, b)}${col(cfg.names[1], b, a)}</div>
    <p class="note">⭐ 有星框的是不一樣的方塊：左轉和右轉剛好對調，其他都一樣。</p>`;
}

// One program, every map: a row of results, plus how many times a function ran on each map.
export function maps(el, ctx, cfg) {
  const draw = (label, dsl) => {
    const results = runAll(ctx.mission, dsl);
    el.querySelector(".map-results").innerHTML = `<p><strong>${esc(label)}</strong></p>` + results.map((result, i) => `
      <button type="button" class="map-chip" data-map="${i}" data-ok="${result.ok}">🗺️ 地圖 ${i + 1} ${result.ok ? "✅" : "❌"}
      <small>${cfg.name ? `${esc(fnLabel(cfg.name))} 做了 ${entries(result, cfg.name)} 次・` : ""}${esc(result.text)}</small></button>`).join("");
  };
  el.innerHTML = `<div class="row"><button type="button" class="btn btn-run" data-who="mine">🧱 用我拼的程式跑全部地圖</button>
    <button type="button" class="btn btn-warm" data-who="answer">👀 用解答跑全部地圖</button></div><div class="map-results"></div>`;
  el.addEventListener("click", (event) => {
    const who = event.target.closest("[data-who]")?.dataset.who;
    if (who === "mine") draw("我拼的程式", ctx.editor.get());
    if (who === "answer") draw("這一關的解答", ctx.mission.solution);
    const pick = event.target.closest(".map-chip");
    if (pick) ctx.player.setMap(Number(pick.dataset.map));
  });
}

// Three small boards that play the same program at the same time.
export function trio(el, ctx) {
  const mission = ctx.mission;
  el.innerHTML = `<div class="trio">${mission.maps.map((_, i) => `<div class="trio-cell"><p>地圖 ${i + 1}</p>
    <div class="board-box small"><div class="board"></div></div><p class="trio-note"></p></div>`).join("")}</div>
    <div class="row"><button type="button" class="btn btn-run" data-who="mine">🧱 我拼的程式：三張一起跑</button>
    <button type="button" class="btn btn-warm" data-who="answer">👀 解答：三張一起跑</button></div>`;
  const boards = [...el.querySelectorAll(".board")].map((node, i) => {
    const board = createBoard(node);
    board.draw(mission.maps[i]);
    return board;
  });
  let timer = null;
  el.addEventListener("click", (event) => {
    const who = event.target.closest("[data-who]")?.dataset.who;
    if (!who) return;
    clearInterval(timer);
    const dsl = who === "mine" ? ctx.editor.get() : mission.solution;
    const results = mission.maps.map((_, i) => run(mission, dsl, i));
    const notes = el.querySelectorAll(".trio-note");
    boards.forEach((board) => board.reset());
    notes.forEach((note) => { note.textContent = ""; });
    let at = 0;
    timer = setInterval(() => {
      results.forEach((result, i) => { if (result.frames[at]) boards[i].apply(result.frames[at]); });
      at += 1;
      if (results.every((result) => at >= result.frames.length)) {
        clearInterval(timer);
        results.forEach((result, i) => { notes[i].textContent = `${result.ok ? "✅" : "❌"} 撿了 ${result.stats?.picked.size ?? 0} 顆・${result.text}`; });
      }
    }, 380);
  });
  ctx.cleanup.push(() => clearInterval(timer));
}

// The rule at work: every action Robo took on each map, as arrows. Same rule, different paths.
export function rule(el, ctx) {
  const icon = (frame, before) => {
    if (frame.kind === "move") return "⬆️";
    if (frame.kind === "pick") return "💎";
    if (frame.kind === "turn") return frame.rot < before ? "↺" : "↻";
    return "💥";
  };
  const rows = runAll(ctx.mission, ctx.mission.solution).map((result, i) => {
    let before = result.map.start.dir;
    const marks = result.frames.map((frame) => {
      const mark = icon(frame, before);
      before = frame.rot;
      return `<span class="act-mark">${mark}</span>`;
    });
    return `<button type="button" class="rule-row" data-map="${i}"><strong>地圖 ${i + 1}</strong><span>${marks.join("")}</span></button>`;
  });
  el.innerHTML = `<p class="note">同一條規則，在每個迷宮裡做出不一樣的動作（⬆️ 前進、↺ 左轉、↻ 右轉）。點一張地圖到下面看它走。</p>${rows.join("")}`;
  el.addEventListener("click", (event) => {
    const row = event.target.closest(".rule-row");
    if (!row) return;
    ctx.player.setMap(Number(row.dataset.map));
    ctx.player.load(ctx.mission.solution, "這一關的解答", { autoplay: true });
  });
}

// Everything this mission's solution uses, read from the program itself.
export function uses(el, ctx) {
  const dsl = ctx.mission.solution;
  const defs = Object.keys(dsl.defs ?? {});
  const all = [dsl.main, ...defs.map((name) => dsl.defs[name])];
  const has = (key) => JSON.stringify(all).includes(`"${key}"`);
  const nested = defs.filter((name) => callsIn(dsl.defs[name]).length);
  const badges = [
    [defs.length, `🧩 ${defs.length} 個函式：${defs.map(fnLabel).join("、")}`],
    [has("until"), "🔁 重複直到 🏁"],
    [has("if"), "🤔 如果／否則"],
    [nested.length, `🪆 函式呼叫函式：${nested.map((name) => `${fnLabel(name)} → ${callsIn(dsl.defs[name]).map(fnLabel).join("、")}`).join("；")}`],
  ];
  el.innerHTML = `<p class="note">這一關的解答把前面學過的全部用上了：</p>
    <div class="badges">${badges.filter(([on]) => on).map(([, text]) => `<span class="badge">${esc(text)}</span>`).join("")}</div>`;
}
