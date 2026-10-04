// Teacher answer page: every Quest Lab mission's reference solution, drawn with the real blocks.
// One hidden Blockly workspace renders each solution in turn; each card keeps a static copy of the drawing,
// because the dropdown labels depend on the mission that is loaded at the moment.
import { UNITS, missionNumber, missionParam } from "../quest/missions/index.js";
import { choiceText, choicesOf, isPredict, rightChoice } from "../quest/predict.js";
import { stateFromDsl } from "../quest/program.js";
import { defineQuestBlocks, setFunctionNames } from "../quest/blocks.js";
import { setMissionContext } from "../quest/blocks-advanced.js";
import { lang, pick, setLang } from "../quest/i18n.js";

const $ = (selector) => document.querySelector(selector);
const SVG_NS = "http://www.w3.org/2000/svg";
const PAD = 8;
const L = (en, zh) => (lang === "zh" ? zh : en);
const TIERS = { easy: "🟢", medium: "🟡", hard: "🔴" };

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Copies what the workspace drew into a standalone <svg>; Blockly's page-wide CSS still styles it.
function snapshot(workspace) {
  const box = workspace.getBlocksBoundingBox();
  const width = box.right - box.left + PAD * 2;
  const height = box.bottom - box.top + PAD * 2;
  const svg = document.createElementNS(SVG_NS, "svg");
  // Renderer and theme classes (e.g. geras-renderer classic-theme) sit on the injection div; text styles need them.
  const theme = [...workspace.getInjectionDiv().classList].filter((name) => name !== "injectionDiv");
  svg.setAttribute("class", [workspace.getParentSvg().getAttribute("class"), ...theme].join(" "));
  svg.setAttribute("viewBox", `${box.left - PAD} ${box.top - PAD} ${width} ${height}`);
  svg.setAttribute("width", String(Math.ceil(width)));
  svg.setAttribute("height", String(Math.ceil(height)));
  svg.setAttribute("role", "img");
  const canvas = workspace.getCanvas().cloneNode(true);
  canvas.removeAttribute("transform");
  svg.append(canvas);
  return svg;
}

function missionCard(unit, mission, index) {
  const card = el("article", "mission");
  const title = el("h3");
  title.append(el("span", "n", String(missionNumber(unit, index) ?? "🔮")), `${TIERS[mission.tier] ?? ""} ${pick(mission.title)}`);
  card.append(title);
  if (mission.lesson) card.append(el("p", "lesson", `🎯 ${pick(mission.lesson)}`));
  card.append(el("p", "hint", `💡 ${pick(mission.hint)}`));
  const maps = mission.maps?.length ?? 1;
  if (isPredict(mission)) {
    const right = choiceText(rightChoice(mission));
    card.append(el("p", "meta", `${L("Choices", "選項")}：${choicesOf(mission).map(choiceText).join(" / ")} · ${L("Answer", "答案")}：${right}`));
  } else card.append(el("p", "meta", L(`${mission.best} blocks for ⭐⭐⭐ · limit ${mission.maxBlocks} · tested on ${maps} map${maps > 1 ? "s" : ""}`,
    `⭐⭐⭐ ${mission.best} 個方塊 · 上限 ${mission.maxBlocks} · 要通過 ${maps} 張地圖`)));
  const blocks = el("div", "blocks");
  card.append(blocks);
  const open = el("a", "open", L("Open this mission ➜", "打開這一關 ➜"));
  open.href = `quest.html?unit=${unit.id}&m=${missionParam(unit, index)}`;
  card.append(open);
  return { card, blocks };
}

function renderShell() {
  document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  document.title = L("Answers · Blocky Easy", "解答頁｜Blocky Easy");
  $("#pageHeading").textContent = L("Quest Lab answers", "Quest Lab 解答頁");
  $("#pageNote").textContent = L(
    "For teachers: each mission's reference solution (the ⭐⭐⭐ block count) and a one-line explanation. Other solutions are fine if they pass every map.",
    "給老師用：每一關的參考解法（⭐⭐⭐ 的方塊數）和一句說明。解法不只一種，學生的做法只要通過所有地圖就算對。");
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
    button.addEventListener("click", () => setLang(button.dataset.lang));
  });
  const jobs = [];
  for (const unit of UNITS) {
    const link = el("a", "", `${unit.icon} ${pick(unit.short)}`);
    link.href = `#${unit.id}`;
    $("#unitNav").append(link);
    const section = el("section", "unit");
    section.id = unit.id;
    const heading = el("h2", "", `${unit.icon} ${pick(unit.title)} `);
    heading.append(el("small", "", `${L("Part", "第")} ${unit.part}${L("", " 階段")} · ${pick(unit.concept)} · ${unit.missions.length} ${L("missions", "關")}`));
    const grid = el("div", "missions");
    section.append(heading, grid);
    unit.missions.forEach((mission, index) => {
      const { card, blocks } = missionCard(unit, mission, index);
      grid.append(card);
      jobs.push({ mission, blocks });
    });
    $("#units").append(section);
  }
  return jobs;
}

async function drawAll(jobs) {
  defineQuestBlocks();
  const workspace = Blockly.inject("renderDiv", { readOnly: true, media: "https://unpkg.com/blockly/media/" });
  for (const [done, { mission, blocks }] of jobs.entries()) {
    setFunctionNames(mission.functions);
    setMissionContext(mission);
    workspace.clear();
    Blockly.serialization.workspaces.load(stateFromDsl(mission.solution), workspace);
    blocks.append(snapshot(workspace));
    if (done % 8 === 7) {
      $("#status").textContent = L(`Drawing blocks… ${done + 1} / ${jobs.length}`, `正在畫積木…… ${done + 1} / ${jobs.length}`);
      await new Promise((resolve) => setTimeout(resolve));
    }
  }
  $("#status").textContent = L(`${jobs.length} missions.`, `共 ${jobs.length} 關。`);
}

const jobs = renderShell();
if (typeof Blockly === "undefined") {
  $("#status").textContent = L("Blockly could not load. Check the internet connection and refresh.", "Blockly 沒有載入，請確認網路後重新整理。");
} else {
  drawAll(jobs);
}
