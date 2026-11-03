// The shared top bar. A page adds <header class="site-bar" data-site-nav="student|teacher" data-current="…">
// and loads this module. Student pages show the learning areas and a language switch; teacher pages
// (written in Chinese for the teacher) show the teacher tools.
import { lang, pick, setLang } from "./lang.js";

const STUDENT = [
  ["map", "./", "🗺️", { en: "Learning Map", zh: "學習地圖" }],
  ["levels", "levels.html", "🟢", { en: "100 Levels", zh: "100 關" }],
  ["games", "blockly-games.html", "🐦", { en: "Blockly Games", zh: "Blockly Games" }],
  ["quest", "quest.html", "🧩", { en: "Quest Lab", zh: "Quest Lab 任務" }],
  ["story", "story.html", "🎬", { en: "Story Lab", zh: "Story Lab 故事" }],
];
const TEACHER = [
  ["guide", "teacher-guide.html", "📘", "老師使用說明"],
  ["course", "course.html", "🛠️", "第二階段課程"],
  ["advanced", "course-advanced.html", "💡", "第三階段課程"],
  ["progress", "teacher.html", "📊", "全班進度"],
  ["unplugged", "unplugged.html", "🖨️", "不插電活動卡"],
  ["answers", "answers.html", "🔑", "解答"],
];

const link = ([id, href, icon, label], current) =>
  `<a href="${href}"${id === current ? ' aria-current="page"' : ""}><span aria-hidden="true">${icon}</span><span class="label">${pick(label)}</span></a>`;

export function renderSiteNav(header) {
  const teacher = header.dataset.siteNav === "teacher";
  const current = header.dataset.current;
  const brand = `<a class="site-brand" href="./" aria-label="Blocky Easy"><span class="mark" aria-hidden="true">🧩</span><span>Blocky Easy</span></a>`;
  if (teacher) {
    header.innerHTML = `${brand}<nav class="site-links" aria-label="Teacher tools">${TEACHER.map((item) => link(item, current)).join("")}</nav>
      <div class="site-tools"><a class="site-teacher" href="./"><span aria-hidden="true">🗺️</span><span class="label">學生地圖</span></a></div>`;
    return;
  }
  header.innerHTML = `${brand}<nav class="site-links" aria-label="Learning areas">${STUDENT.map((item) => link(item, current)).join("")}</nav>
    <div class="site-tools">
      <a class="site-teacher" href="teacher-guide.html"><span aria-hidden="true">👩‍🏫</span><span class="label">${pick({ en: "Teachers", zh: "老師" })}</span></a>
      <div class="lang-switch" role="group" aria-label="Language">
        <button type="button" data-set-lang="en" aria-pressed="${lang === "en"}">EN</button>
        <button type="button" data-set-lang="zh" aria-pressed="${lang === "zh"}">中文</button>
      </div>
    </div>`;
  header.querySelectorAll("[data-set-lang]").forEach((button) => {
    button.addEventListener("click", () => { if (button.dataset.setLang !== lang) setLang(button.dataset.setLang); });
  });
}

document.querySelectorAll("[data-site-nav]").forEach(renderSiteNav);
