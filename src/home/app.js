// The learning map: one path from the 100 levels to Part 3, with the progress saved on this iPad.
import { UNITS } from "../quest/missions/index.js";
import { ALL_STORY_TASKS } from "../story/challenges.js";
import { PRODUCT_TASKS } from "../story/product.js";
import { GAME_TASKS } from "../story/game.js";
import { LEVELS } from "../data/index.js";
import { lang, pick } from "../shared/lang.js";

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? {};
  } catch {
    return {};
  }
};
const levels = read("blocky-easy-progress-v1");
const quest = read("blocky-quest-v1");
const story = read("blocky-story-v2");
const T = (en, zh) => (lang === "zh" ? zh : en);
const $ = (selector) => document.querySelector(selector);

const levelStars = LEVELS.reduce((sum, level) => sum + (levels[level.id]?.stars ?? 0), 0);
const unitStars = (unit) => unit.missions.filter((m) => !m.extra).reduce((sum, m) => sum + (quest.stars?.[m.id] ?? 0), 0);
const unitMax = (unit) => unit.missions.filter((m) => !m.extra).length * 3;
const storyDone = (tasks) => tasks.filter((task) => story.done?.[task.id]).length;
const questStars = UNITS.reduce((sum, unit) => sum + unitStars(unit), 0);

const questCard = (unit) => ({
  area: "quest", icon: unit.icon, title: pick(unit.title), sub: pick(unit.concept),
  done: unitStars(unit), total: unitMax(unit), unitLabel: "⭐", href: `quest.html?unit=${unit.id}`,
});
const storyCard = (icon, title, sub, tasks, href) => ({
  area: "story", icon, title, sub, done: storyDone(tasks), total: tasks.length, unitLabel: "✓", href,
});

const STAGES = [
  {
    id: "start", color: "levels", badge: "1",
    title: T("Start here: 100 Levels", "從這裡開始：100 關"),
    text: T("Move, turn, repeat and decide. Collect up to 300 stars.", "前進、轉彎、重複、判斷。最多可以拿 300 顆星。"),
    cards: [{ area: "levels", icon: "🟢", title: T("100 Levels", "100 關"), sub: T("Sequence · loops · while · if / else", "順序・迴圈・While・如果／否則"),
      done: levelStars, total: LEVELS.length * 3, unitLabel: "⭐", href: "levels.html" }],
  },
  {
    id: "games", color: "games", badge: "2",
    title: T("Blockly Games", "Blockly Games"),
    text: T("Angles with Bird, shapes with Turtle, songs with Music.", "用 Bird 練角度、用 Turtle 畫圖、用 Music 寫歌。"),
    cards: [
      { area: "games", icon: "🐦", title: "Bird", sub: T("Conditions and angles", "條件與角度"), href: "bird.html" },
      { area: "games", icon: "🐢", title: "Turtle", sub: T("Loops that draw", "用迴圈畫圖"), href: "blockly-games/turtle.html" },
      { area: "games", icon: "🎵", title: "Music", sub: T("Functions as a chorus", "用函式寫副歌"), href: "blockly-games/music.html" },
    ],
  },
  {
    id: "part2", color: "quest", badge: "3",
    title: T("Part 2 · Code Builders", "第二階段・Code Builders"),
    text: T("Fix bugs, build functions, count with variables, and make stories that react.", "修 bug、做函式、用變數數數，再做會互動的故事。"),
    cards: [
      ...UNITS.filter((unit) => unit.part === 2).map(questCard),
      storyCard("🎬", T("Story Lab: Stories", "Story Lab：故事"), T("Events, messages and your own story", "事件、廣播和你自己的故事"), ALL_STORY_TASKS, "story.html?track=story"),
    ],
  },
  {
    id: "part3", color: "story", badge: "4",
    title: T("Part 3 · Code Inventors", "第三階段・Code Inventors"),
    text: T("Inputs, logic, lists, algorithms and recursion. Then build a real app and a real game.", "參數、邏輯、串列、演算法和遞迴，再做出真正的 App 和遊戲。"),
    cards: [
      ...UNITS.filter((unit) => unit.part === 3).map(questCard),
      storyCard("🛠️", T("Product Studio", "產品工坊"), T("Build an app, version by version", "一版一版做出 App"), PRODUCT_TASKS, "story.html?track=product"),
      storyCard("🎮", T("Game Studio", "遊戲工作室"), T("Build a full game", "做出完整的遊戲"), GAME_TASKS, "story.html?track=game"),
    ],
  },
];

function cardHtml(card) {
  const pct = card.total ? Math.round((card.done / card.total) * 100) : 0;
  const started = card.done > 0;
  const progress = card.total == null ? "" : `
    <div class="meter" role="img" aria-label="${card.done} / ${card.total}"><span style="width:${pct}%"></span></div>
    <p class="meter-text">${card.unitLabel} ${card.done} / ${card.total}</p>`;
  const cta = card.total == null ? T("Play", "開始玩") : pct === 100 ? T("Review", "複習") : started ? T("Continue", "繼續") : T("Start", "開始");
  return `<a class="path-card" data-area="${card.area}" href="${card.href}">
    <span class="path-icon" aria-hidden="true">${card.icon}</span>
    <span class="path-body"><strong>${card.title}</strong><small>${card.sub}</small>${progress}</span>
    <span class="path-cta">${cta} ➜</span></a>`;
}

function render() {
  document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  $("#heroEyebrow").textContent = T("Learning map", "學習地圖");
  $("#heroTitle").textContent = T("Your coding adventure", "你的程式冒險");
  $("#heroText").textContent = T("Follow the path from 1 to 4. Your stars and finished challenges are saved on this iPad.",
    "照著 1 到 4 的路線往前走。你的星星和完成的挑戰都存在這台 iPad 上。");
  $("#heroStars").textContent = levelStars + questStars;
  $("#heroStarsLabel").textContent = T("stars so far", "顆星星");
  const last = quest.last?.unit ? `quest.html?unit=${quest.last.unit}` : levelStars ? "levels.html" : "levels.html";
  $("#continueLink").href = last;
  $("#continueLink").textContent = levelStars + questStars ? T("Continue where I left off ➜", "從上次的地方繼續 ➜") : T("Start with level 1 ➜", "從第 1 關開始 ➜");

  $("#path").innerHTML = STAGES.map((stage) => `
    <li class="stage" data-color="${stage.color}">
      <div class="stage-head"><span class="stage-badge">${stage.badge}</span><div><h2>${stage.title}</h2><p>${stage.text}</p></div></div>
      <div class="stage-cards">${stage.cards.map(cardHtml).join("")}</div>
    </li>`).join("");

  $("#teacherEyebrow").textContent = T("For teachers", "給老師");
  $("#teacherTitle").textContent = T("Plan, print and track the class", "規劃、列印、追蹤全班進度");
  $("#teacherText").textContent = T("Course plans, unplugged activity cards, answers and a class progress table. Teacher pages are in Chinese.",
    "課程規劃、不插電活動卡、解答，以及全班進度表。");
  $("#teacherLinks").innerHTML = [
    ["📘", "teacher-guide.html", T("Teacher guide", "老師使用說明")],
    ["🛠️", "course.html", T("Course plan · Part 2", "第二階段課程")],
    ["💡", "course-advanced.html", T("Course plan · Part 3", "第三階段課程")],
    ["📊", "teacher.html", T("Class progress", "全班進度")],
    ["🖨️", "unplugged.html", T("Unplugged cards", "不插電活動卡")],
    ["🔑", "answers.html", T("Answers", "解答")],
  ].map(([icon, href, label]) => `<a href="${href}"><span aria-hidden="true">${icon}</span>${label}</a>`).join("");
  $("#footerText").textContent = T("Blocky Easy · open source (Apache-2.0). Progress stays on this device; nothing is uploaded.",
    "Blocky Easy・開源（Apache-2.0）。進度只存在這台裝置，不會上傳。");
}

render();
