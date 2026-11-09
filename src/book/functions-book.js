// The Function Factory interactive book: cover + contents, then one page per Quest Lab mission 1–20.
// Pages are #p1 … #p20, so a teacher can send a link straight to one lesson.
import { LESSONS, LESSON_COUNT, TIER_TEXT, zh } from "./missions.js";
import { checkLesson, renderLesson } from "./page.js";
import { esc } from "./program-view.js";

const STORE = "blocky-book-functions-v1";
const STEPS = ["predict", "run", "flap"];
const app = document.querySelector("#book");
const nav = document.querySelector("#bookNav");
let current = null;

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORE)) ?? {};
  } catch {
    return {};
  }
}
const progress = load();
const stepsOf = (n) => progress[n] ?? [];
const isDone = (n) => STEPS.every((step) => stepsOf(n).includes(step));

function mark(n, step) {
  if (stepsOf(n).includes(step)) return;
  progress[n] = [...stepsOf(n), step];
  try {
    localStorage.setItem(STORE, JSON.stringify(progress));
  } catch {
    // Private mode: progress just isn't kept.
  }
  drawNav(n);
}

const pageFromHash = () => {
  const n = Number(/^#p(\d+)$/.exec(location.hash)?.[1]);
  return Number.isInteger(n) && n >= 1 && n <= LESSONS.length ? n : 0;
};

function drawNav(n) {
  const done = LESSONS.filter((lesson) => isDone(lesson.n)).length;
  const pct = Math.round((done / LESSONS.length) * 100);
  const prev = n > 1 ? `#p${n - 1}` : n === 1 ? "#cover" : null;
  const next = n < LESSONS.length ? `#p${n + 1}` : null;
  const steps = n ? STEPS.map((step, i) => `<span class="dot" data-on="${stepsOf(n).includes(step)}">${["🔮", "▶", "🔍"][i]}</span>`).join("") : "";
  nav.innerHTML = `
    ${prev ? `<a class="nav-btn" href="${prev}">◀ 上一頁</a>` : `<span class="nav-btn" aria-disabled="true">◀ 上一頁</span>`}
    <a class="nav-btn toc" href="#cover">📚 目錄</a>
    <span class="nav-where">${n ? `第 ${n} 關 / ${LESSON_COUNT} ${steps}` : "封面"}</span>
    <span class="nav-progress" title="完成 先猜・執行・翻蓋 三步就算讀完"><span class="meter"><span style="width:${pct}%"></span></span>讀完 ${done} / ${LESSON_COUNT}</span>
    ${next ? `<a class="nav-btn next" href="${next}">${n ? "下一頁 ▶" : "開始讀第 1 關 ▶"}</a>` : `<span class="nav-btn" aria-disabled="true">下一頁 ▶</span>`}`;
}

function cover() {
  const checks = LESSONS.map((lesson) => ({ lesson, check: checkLesson(lesson) }));
  const passed = checks.filter(({ check }) => check.ok).length;
  const failed = checks.filter(({ check }) => !check.ok);
  app.innerHTML = `
    <section class="card cover">
      <p class="kicker">🧩 Quest Lab・函式工廠</p>
      <h1>📖 函式工廠互動說明書</h1>
      <p class="lead">一頁一關，對應 Quest Lab 函式工廠的第 1 到第 ${LESSON_COUNT} 關。每一頁都照這三步走，看懂了再去做正式關卡：</p>
      <ol class="how">
        <li><span class="step-no">1</span>🔮 <strong>先猜</strong>：選一個答案，再看對不對。</li>
        <li><span class="step-no">2</span>▶ <strong>再執行</strong>：在真正的關卡地圖上跑，一步一步看 Robo 在哪一層函式裡。</li>
        <li><span class="step-no">3</span>🔍 <strong>翻蓋</strong>：掀開蓋子，看這一關最重要的一句話。</li>
        <li><span class="step-no">🚀</span><strong>進入正式課程</strong>：按按鈕，到 Quest Lab 做同一關。</li>
      </ol>
      <p class="check" data-ok="${!failed.length}">${failed.length
        ? `❌ 自我檢查 FAIL：${failed.map(({ lesson, check }) => `第 ${lesson.n} 關（${check.problems.map(esc).join("；")}）`).join("、")}`
        : `✅ 自我檢查 PASS：${passed} / ${LESSON_COUNT} 關的解答都用真實引擎跑過，寶石收齊、停在旗子上。`}</p>
    </section>
    <ol class="toc-grid">${checks.map(({ lesson, check }) => `
      <li><a class="toc-card" href="#p${lesson.n}" data-tier="${esc(lesson.mission.tier)}" data-done="${isDone(lesson.n)}">
        <span class="toc-num">${lesson.n}</span>
        <span class="toc-body"><strong>${esc(zh(lesson.mission.title))}</strong>
          <small>🎯 ${esc(zh(lesson.mission.lesson))}</small>
          <small>${esc(TIER_TEXT[lesson.mission.tier] ?? "")}${check.ok ? "" : "・❌ 自我檢查沒過"}</small></span>
        <span class="toc-mark">${isDone(lesson.n) ? "✅" : stepsOf(lesson.n).length ? "📖" : ""}</span></a></li>`).join("")}</ol>`;
}

function show() {
  current?.destroy();
  current = null;
  const n = pageFromHash();
  if (n) current = renderLesson(app, LESSONS[n - 1], { onProgress: mark });
  else cover();
  drawNav(n);
  document.title = n ? `第 ${n} 關・函式工廠互動說明書` : "函式工廠互動說明書";
  window.scrollTo(0, 0);
}

addEventListener("hashchange", show);
show();
