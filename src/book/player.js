// Plays a program on the real mission map: the engine makes the frames, the Quest Lab board draws them.
// Shows which layer Robo is in (▶ main › function › function inside it) and lights up the block it is running.
import { createBoard } from "../quest/board.js";
import { fnLabel } from "./missions.js";
import { callChain, ownerOf, run, runAll } from "./run.js";
import { esc, highlight, programHtml } from "./program-view.js";

const ownerName = (owner) => (owner === "main" ? "▶ 主程式" : fnLabel(owner));

export function createPlayer(root, lesson) {
  const mission = lesson.mission;
  const many = mission.maps.length > 1;
  root.innerHTML = `
    <div class="map-tabs" ${many ? "" : "hidden"}>${mission.maps.map((_, i) =>
      `<button type="button" class="map-tab" data-map="${i}" aria-pressed="${i === 0}">🗺️ 地圖 ${i + 1}</button>`).join("")}
      <button type="button" class="map-tab all" data-act="all">✅ 全部地圖一起檢查</button></div>
    <div class="board-box"><div class="board" role="img" aria-label="關卡地圖"></div></div>
    <p class="layer" aria-live="polite"></p>
    <p class="result" aria-live="polite"></p>
    <div class="play-controls">
      <button type="button" class="btn btn-run" data-act="play">▶ 播放</button>
      <button type="button" class="btn btn-step" data-act="step">⏭ 一步一步</button>
      <button type="button" class="btn btn-soft" data-act="reset">↺ 回到起點</button>
      <button type="button" class="btn btn-warm" data-act="answer">👀 看解答怎麼跑</button>
      <label class="speed"><span aria-hidden="true">🐢</span><input type="range" min="150" max="900" step="50" value="500" aria-label="速度" /><span aria-hidden="true">🐇</span></label>
    </div>
    <div class="running"><h4>Robo 正在跑：<span class="running-label"></span></h4><div class="prog-list"></div></div>`;
  const $ = (selector) => root.querySelector(selector);
  const board = createBoard($(".board"));
  const hooks = { frame: [], finish: [] };
  const state = { dsl: { main: [] }, label: "", mapIndex: 0, result: null, at: 0, timer: null };

  const speed = () => 1050 - Number($(".speed input").value);
  const stop = () => {
    clearInterval(state.timer);
    state.timer = null;
  };

  function layerHtml(frame) {
    if (!frame) return "第 0 層：▶ 主程式（還沒開始）";
    const chain = callChain(state.dsl, ownerOf(frame.id));
    const pills = chain.map((owner, depth) => `<span class="pill d${Math.min(depth, 3)}">${esc(ownerName(owner))}</span>`);
    return `<strong>第 ${frame.depth} 層</strong> ${pills.join(" › ")}`;
  }

  function setResult(text, tone = "") {
    $(".result").textContent = text;
    $(".result").dataset.tone = tone;
  }

  function rewind() {
    stop();
    state.at = 0;
    board.reset();
    highlight($(".running"), null);
    $(".layer").innerHTML = layerHtml(null);
    setResult("按「▶ 播放」或「⏭ 一步一步」看 Robo 怎麼走。");
  }

  function finish() {
    stop();
    const { result } = state;
    setResult(result.text, result.ok ? "success" : "fail");
    root.querySelector(`.map-tab[data-map="${state.mapIndex}"]`)?.setAttribute("data-outcome", result.ok ? "pass" : "fail");
    hooks.finish.forEach((fn) => fn(result, state));
  }

  function stepOnce() {
    const { frames } = state.result;
    if (state.at >= frames.length) {
      finish();
      return false;
    }
    const frame = frames[state.at];
    board.apply(frame);
    state.at += 1;
    highlight($(".running"), frame.id, callChain(state.dsl, ownerOf(frame.id)));
    $(".layer").innerHTML = layerHtml(frame);
    setResult(`第 ${state.at} / ${frames.length} 個動作`);
    hooks.frame.forEach((fn) => fn(frame, state));
    if (state.at >= frames.length) finish();
    return true;
  }

  function play() {
    if (state.at >= state.result.frames.length) rewind();
    stop();
    if (!state.result.frames.length) {
      finish();
      return;
    }
    state.timer = setInterval(() => { if (!stepOnce()) stop(); }, speed());
  }

  function compute() {
    state.result = run(mission, state.dsl, state.mapIndex);
    rewind();
  }

  function load(dsl, label, { autoplay = false } = {}) {
    state.dsl = structuredClone(dsl);
    state.label = label;
    $(".running-label").textContent = label;
    $(".running .prog-list").innerHTML = programHtml(state.dsl, mission.functions);
    root.querySelectorAll(".map-tab[data-map]").forEach((tab) => tab.removeAttribute("data-outcome"));
    compute();
    if (autoplay) play();
  }

  function setMap(index) {
    stop();
    state.mapIndex = index;
    root.querySelectorAll(".map-tab[data-map]").forEach((tab) => tab.setAttribute("aria-pressed", String(Number(tab.dataset.map) === index)));
    board.draw(mission.maps[index]);
    compute();
  }

  function checkAll() {
    stop();
    const results = runAll(mission, state.dsl);
    results.forEach((result, i) => root.querySelector(`.map-tab[data-map="${i}"]`)?.setAttribute("data-outcome", result.ok ? "pass" : "fail"));
    const lines = results.map((result, i) => `地圖 ${i + 1} ${result.ok ? "✅" : "❌"} ${result.ok ? "" : result.text}`);
    const all = results.every((result) => result.ok);
    setResult(`${all ? "🎉 同一個程式，每張地圖都通過！" : "還有地圖沒通過："}\n${lines.join("\n")}`, all ? "success" : "fail");
    return results;
  }

  root.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.map != null) setMap(Number(button.dataset.map));
    const act = button.dataset.act;
    if (act === "play") play();
    if (act === "step") {
      stop();
      if (state.at >= state.result.frames.length) rewind();
      if (!state.result.frames.length) finish();
      else stepOnce();
    }
    if (act === "reset") rewind();
    if (act === "answer") load(mission.solution, "這一關的解答", { autoplay: true });
    if (act === "all") checkAll();
  });

  board.draw(mission.maps[0]);
  return {
    load,
    setMap,
    checkAll,
    stop,
    on: (name, fn) => hooks[name].push(fn),
    get mapIndex() { return state.mapIndex; },
  };
}
