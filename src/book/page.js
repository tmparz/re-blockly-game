// One book page = one Quest Lab mission: 🔮 predict → ▶ run (activity + build it yourself) → 🔍 lift the flap → 🚀 course.
import { LESSON_COUNT, TIER_TEXT, courseHref, zh } from "./missions.js";
import { blockCount, entries, firstPass, run, selfCheck } from "./run.js";
import { esc } from "./program-view.js";
import { createEditor } from "./editor.js";
import { createPlayer } from "./player.js";
import * as widgetsA from "./widgets-a.js";
import * as widgetsB from "./widgets-b.js";
import { LESSONS_1 } from "./lessons-1.js";
import { LESSONS_2 } from "./lessons-2.js";

const WIDGETS = { ...widgetsA, ...widgetsB };
export const CONFIGS = { ...LESSONS_1, ...LESSONS_2 };

// What a lesson's predict/play settings can use: the mission's own data and the real engine.
export function helpers(mission) {
  return {
    m: mission,
    sol: mission.solution,
    starter: { main: [], defs: {}, ...mission.starter },
    run: (dsl, mapIndex = 0) => run(mission, dsl, mapIndex),
    firstPass: (dsls) => firstPass(mission, dsls),
    withMain: (main) => ({ main, defs: mission.solution.defs }),
    entries,
    blockCount,
  };
}

const RESOLVE = ["items", "sides", "start", "build"];
const resolve = (cfg, h) => Object.fromEntries(Object.entries(cfg).map(([key, value]) =>
  [key, RESOLVE.includes(key) && typeof value === "function" ? value(h) : value]));

// The self-check for one page: the engine checks the solution, and the predict question must have an answer.
export function checkLesson(lesson) {
  const config = CONFIGS[lesson.mission.id];
  if (!config) return { ok: false, problems: [`找不到「${lesson.mission.id}」這一頁的設定`], results: [] };
  const check = selfCheck(lesson, config);
  let predict = null;
  try {
    predict = config.predict(helpers(lesson.mission));
    if (!(predict.answer >= 0 && predict.answer < predict.options.length)) check.problems.push("先猜題的答案算不出來");
  } catch (error) {
    check.problems.push(`先猜題出錯（${error.message}）`);
  }
  check.ok = !check.problems.length;
  return { ...check, predict, config };
}

function checkHtml(check) {
  if (!check.ok) return `❌ 自我檢查 FAIL：${check.problems.map(esc).join("；")}`;
  const gems = check.results.reduce((sum, r) => sum + r.stats.picked.size, 0);
  const all = check.results.reduce((sum, r) => sum + r.map.gems.size, 0);
  const goals = check.results.map((r) => `(${r.map.goal.x},${r.map.goal.y})`).join("、");
  const maps = check.results.length > 1 ? `${check.results.length} 張地圖都通過` : "通過";
  return `✅ 自我檢查 PASS：真實引擎跑這一關的解答，${maps}、寶石 ${gems}／${all} 全部撿到、停在旗子 🏁 ${goals}`;
}

export function renderLesson(container, lesson, { onProgress = () => {} } = {}) {
  const { mission, n } = lesson;
  const check = checkLesson(lesson);
  const { predict, config = {} } = check;
  const many = mission.maps.length > 1;
  container.innerHTML = `
  <article class="lesson-page" data-tier="${esc(mission.tier)}">
    <header class="card lesson-head">
      <p class="kicker">📖 第 ${n} 關 / ${LESSON_COUNT}・${esc(TIER_TEXT[mission.tier] ?? "")}・🧩 函式工廠</p>
      <h1>${esc(zh(mission.title))}</h1>
      <p class="aim">🎯 ${esc(zh(mission.lesson))}</p>
      <p class="story">${esc(zh(mission.story))}</p>
      <details class="hint"><summary>💡 提示</summary><p>${esc(zh(mission.hint))}</p></details>
      <p class="check" data-ok="${check.ok}">${checkHtml(check)}</p>
    </header>
    <section class="card step predict">
      <h2><span class="step-no">1</span>🔮 先猜猜看</h2>
      ${predict ? `<p class="q">${esc(predict.q)}</p>
        <div class="options">${predict.options.map((label, i) => `<button type="button" class="option" data-i="${i}">${esc(label)}</button>`).join("")}</div>
        <p class="feedback" aria-live="polite" hidden></p>` : `<p class="feedback" data-tone="fail">這一題沒辦法出題。</p>`}
    </section>
    <section class="card step play">
      <h2><span class="step-no">2</span>▶ 再執行</h2>
      <p class="step-help">先玩上面的小實驗，再到下面自己拼。${many ? "這一關有好幾張地圖，可以切換，也可以全部一起檢查。" : ""}按「⏭ 一步一步」可以慢慢看 Robo 現在在哪一層。</p>
      <div class="widgets"></div>
      <div class="lab"><div class="editor"></div><div class="player"></div></div>
    </section>
    <section class="card step flap">
      <h2><span class="step-no">3</span>🔍 翻蓋看為什麼</h2>
      <button type="button" class="flap-lid" aria-expanded="false">👆 掀開蓋子</button>
      <div class="flap-body" hidden><p class="flap-text">${esc(config.flap ?? "")}</p></div>
    </section>
    <a class="go-course" href="${courseHref(lesson)}">🚀 進入正式課程：第 ${n} 關</a>
  </article>`;

  const $ = (selector) => container.querySelector(selector);
  const listeners = [];
  const player = createPlayer($(".player"), lesson);
  const editor = createEditor($(".editor"), lesson, {
    lock: config.lock,
    onRun: (dsl, label) => player.load(dsl, label, { autoplay: true }),
    onChange: (dsl) => listeners.forEach((fn) => fn(dsl)),
  });
  const ctx = { lesson, mission, player, editor, onEditorChange: (fn) => listeners.push(fn), cleanup: [] };
  player.load(editor.get(), "起始程式");
  player.on("finish", () => onProgress(n, "run"));

  const plays = [config.play ?? []].flat();
  plays.forEach((cfg) => {
    const box = document.createElement("div");
    box.className = `widget widget-${cfg.kind}`;
    $(".widgets").append(box);
    try {
      WIDGETS[cfg.kind](box, ctx, resolve(cfg, helpers(mission)));
    } catch (error) {
      box.innerHTML = `<p class="feedback" data-tone="fail">這個小實驗載入失敗（${esc(error.message)}），可以直接用下面的「自己拼拼看」。</p>`;
    }
  });

  container.querySelector(".options")?.addEventListener("click", (event) => {
    const button = event.target.closest(".option");
    if (!button) return;
    const chosen = Number(button.dataset.i);
    const right = chosen === predict.answer;
    container.querySelectorAll(".option").forEach((option, i) => {
      option.disabled = true;
      if (i === predict.answer) option.dataset.mark = "right";
      else if (i === chosen) option.dataset.mark = "wrong";
    });
    const feedback = $(".feedback");
    feedback.hidden = false;
    feedback.dataset.tone = right ? "success" : "fail";
    feedback.textContent = `${right ? "🎉 猜對了！" : `🤔 差一點，答案是「${predict.options[predict.answer]}」。`}${predict.why ?? ""} 到下面跑跑看就知道。`;
    onProgress(n, "predict");
  });

  $(".flap-lid").addEventListener("click", (event) => {
    const open = $(".flap-body").hidden;
    $(".flap-body").hidden = !open;
    event.currentTarget.setAttribute("aria-expanded", String(open));
    event.currentTarget.textContent = open ? "👇 蓋起來" : "👆 掀開蓋子";
    if (open) onProgress(n, "flap");
  });

  return {
    destroy() {
      player.stop();
      ctx.cleanup.forEach((fn) => fn());
    },
  };
}
