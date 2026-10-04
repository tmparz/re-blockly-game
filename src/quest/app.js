import { UNITS } from "./missions/index.js";
import { evaluate } from "./engine.js";
import { countBlocks, programFromState, stateFromDsl } from "./program.js";
import { defineQuestBlocks, quickItems, setFunctionNames } from "./blocks.js";
import { setMissionContext, varLabel } from "./blocks-advanced.js";
import { askConfirm, describeFailure } from "./ui.js";
import { createRunner } from "./runner.js";
import { createTrace } from "./trace.js";
import { createQuickAdd } from "./quick-add.js";
import { createBoard } from "./board.js";
import { lang, pick, setLang, t } from "./i18n.js";
import { loadProgress, saveProgress } from "./storage.js";

const $ = (selector) => document.querySelector(selector);
const progress = loadProgress();
const board = createBoard($("#board"));
const view = { unit: 0, mission: 0, map: 0, results: null };
let workspace = null;
let loading = false;
let quickAdd = null;
let runner = null;

const currentUnit = () => UNITS[view.unit];
const currentMission = () => currentUnit().missions[view.mission];
// What the board shows under the map: the counter (Part 2), named variables and the list (Part 3).
const boardOptions = (mission, index) => ({
  badges: mission.vars ?? (mission.blocks.includes("set") || mission.blocks.includes("say") ? ["counter"] : []),
  list: mission.lists || mission.blocks.includes("addList") ? mission.lists?.[index] ?? [] : null,
  label: varLabel,
  start: Array.isArray(mission.varStart) ? mission.varStart[index] : mission.varStart ?? {},
});

function setResult(text, tone = "") {
  $("#result").textContent = text;
  $("#result").dataset.tone = tone;
}

function renderStaticText() {
  document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  document.title = t("pageTitle");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === lang));
  });
}

function renderTotals() {
  const total = UNITS.flatMap((unit) => unit.missions).reduce((sum, m) => sum + (progress.stars[m.id] ?? 0), 0);
  const max = UNITS.reduce((sum, unit) => sum + unit.missions.length * 3, 0);
  $("#totalStars").textContent = `${total} / ${max}`;
}

// The tabs show one course part at a time; the dark button switches between Part 2 and Part 3.
function renderUnitTabs() {
  $("#unitTabs").innerHTML = "";
  const part = currentUnit().part;
  const other = part === 2 ? 3 : 2;
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "unit-tab part-switch";
  toggle.textContent = t(`part${part}`);
  toggle.title = t("switchPart", { name: t(`part${other}`) });
  toggle.addEventListener("click", () => selectMission(UNITS.findIndex((unit) => unit.part === other), 0));
  $("#unitTabs").append(toggle);
  UNITS.forEach((unit, index) => {
    if (unit.part !== part) return;
    const stars = unit.missions.reduce((sum, m) => sum + (progress.stars[m.id] ?? 0), 0);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "unit-tab";
    button.setAttribute("aria-pressed", String(index === view.unit));
    button.innerHTML = `<span class="unit-icon">${unit.icon}</span><span><strong class="full"></strong><strong class="short"></strong><small></small></span>`;
    button.querySelector(".full").textContent = pick(unit.title);
    button.querySelector(".short").textContent = pick(unit.short);
    button.querySelector("small").textContent = `${pick(unit.concept)} · ⭐ ${stars}/${unit.missions.length * 3}`;
    button.addEventListener("click", () => selectMission(index, 0));
    $("#unitTabs").append(button);
  });
}

function renderMissionDots() {
  $("#missionDots").innerHTML = "";
  currentUnit().missions.forEach((mission, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mission-dot";
    button.dataset.stars = progress.stars[mission.id] ?? 0;
    button.setAttribute("aria-pressed", String(index === view.mission));
    button.setAttribute("aria-label", `${t("mission", { n: index + 1 })}: ${pick(mission.title)}`);
    button.textContent = index + 1;
    button.addEventListener("click", () => selectMission(view.unit, index));
    $("#missionDots").append(button);
  });
}

function renderMapTabs() {
  const mission = currentMission();
  $("#mapTabs").hidden = mission.maps.length < 2;
  $("#mapTabs").innerHTML = "";
  mission.maps.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "map-tab";
    const outcome = view.results?.[index];
    button.dataset.outcome = outcome ? (outcome.ok ? "pass" : "fail") : "";
    button.innerHTML = `<span class="full">${t("map")}</span>${index + 1}${outcome ? (outcome.ok ? " ✓" : " ✗") : ""}`;
    button.setAttribute("aria-pressed", String(index === view.map));
    button.addEventListener("click", () => showMap(index));
    $("#mapTabs").append(button);
  });
}

function showMap(index) {
  runner?.cancel();
  view.map = index;
  board.draw(currentMission().maps[index], boardOptions(currentMission(), index));
  renderMapTabs();
}

function updateBlockCount() {
  const program = programFromState(Blockly.serialization.workspaces.save(workspace));
  const mission = currentMission();
  const count = program.main ? countBlocks(program) : 0;
  $("#blockCount").textContent = t("blocksUsed", { count });
  $("#blockCount").dataset.over = String(count > mission.maxBlocks);
}

function loadState(state) {
  loading = true;
  workspace.clear();
  Blockly.serialization.workspaces.load(state, workspace);
  workspace.cleanUp();
  workspace.scroll(24, 24);
  loading = false;
  quickAdd.reset();
  updateBlockCount();
}

function selectMission(unitIndex, missionIndex) {
  view.unit = unitIndex;
  view.mission = missionIndex;
  view.results = null;
  const mission = currentMission();
  progress.last = { unit: currentUnit().id, mission: missionIndex };
  saveProgress(progress);
  history.replaceState(null, "", `?unit=${currentUnit().id}&m=${missionIndex + 1}`);

  const tier = mission.tier ? ` · ${t(`tier_${mission.tier}`)}` : "";
  $("#missionKicker").textContent = `${currentUnit().icon} ${pick(currentUnit().title)} · ${t("mission", { n: missionIndex + 1 })}${tier}`;
  $("#missionTitle").textContent = pick(mission.title);
  $("#missionStory").textContent = pick(mission.story);
  $("#missionLesson").hidden = !mission.lesson;
  $("#missionLesson").textContent = mission.lesson ? `🎯 ${pick(mission.lesson)}` : "";
  $("#missionHint").textContent = pick(mission.hint);
  $("#hintBox").open = false;
  $("#limitChip").textContent = t("limit", { max: mission.maxBlocks, best: mission.best });
  $("#nextButton").hidden = true;
  setResult(t("ready"));

  setFunctionNames(mission.functions);
  setMissionContext(mission);
  quickAdd.setItems(quickItems(mission));
  loadState(progress.code[mission.id] ?? stateFromDsl(mission.starter));
  renderUnitTabs();
  renderMissionDots();
  showMap(0);
}

// After the last frame (or right away when nothing could run): show the result and award stars.
function finishRun(evaluation, index) {
  const mission = currentMission();
  view.results = evaluation.maps.length ? evaluation.maps : null;
  if (index !== null) renderMapTabs();
  if (!evaluation.ok) {
    if (index !== null) workspace.highlightBlock(evaluation.maps[index].id ?? null);
    setResult(describeFailure(evaluation, mission), "fail");
    return;
  }
  const earned = Math.max(evaluation.stars, progress.stars[mission.id] ?? 0);
  progress.stars[mission.id] = earned;
  saveProgress(progress);
  const message = evaluation.stars === 3 ? t("success3") : t("success2", { best: mission.best });
  const maps = mission.maps.length > 1 ? ` ${t("allMaps", { n: mission.maps.length })}` : "";
  setResult(message + maps, "success");
  $("#nextButton").hidden = !nextTarget();
  renderTotals();
  renderUnitTabs();
  renderMissionDots();
}

function nextTarget() {
  if (view.mission + 1 < currentUnit().missions.length) return [view.unit, view.mission + 1];
  if (view.unit + 1 < UNITS.length) return [view.unit + 1, 0];
  return null;
}

function bindControls() {
  $("#runButton").addEventListener("click", () => runner.run());
  $("#stepButton").addEventListener("click", () => runner.step());
  $("#traceToggle").addEventListener("click", () => {
    const open = $(".mission-panel").classList.toggle("tracing");
    $("#traceToggle").setAttribute("aria-pressed", String(open));
  });
  $("#resetButton").addEventListener("click", () => showMap(view.map));
  $("#restartButton").addEventListener("click", async () => {
    if (!(await askConfirm(t("confirmRestart")))) return;
    loadState(stateFromDsl(currentMission().starter));
    showMap(view.map);
  });
  $("#answerButton").addEventListener("click", async () => {
    if (!(await askConfirm(t("confirmAnswer")))) return;
    loadState(stateFromDsl(currentMission().solution));
    showMap(view.map);
    setResult(t("answerLoaded"));
  });
  $("#nextButton").addEventListener("click", () => {
    const target = nextTarget();
    if (target) selectMission(...target);
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLang(button.dataset.lang));
  });
}

function initialSelection() {
  const params = new URLSearchParams(location.search);
  const rawUnit = params.get("unit") ?? progress.last?.unit;
  const unitId = rawUnit === "fngym" ? "functions" : rawUnit; // Function Gym was merged into Function Factory.
  const unitIndex = Math.max(0, UNITS.findIndex((unit) => unit.id === unitId));
  const fromUrl = Number(params.get("m")) - 1;
  const fromLast = progress.last?.unit === UNITS[unitIndex].id ? progress.last.mission : 0;
  const missionIndex = Number.isInteger(fromUrl) && fromUrl >= 0 ? fromUrl : fromLast;
  return [unitIndex, Math.min(missionIndex, UNITS[unitIndex].missions.length - 1)];
}

function boot() {
  renderStaticText();
  renderTotals();
  if (typeof Blockly === "undefined") {
    $("#loadWarning").hidden = false;
    return;
  }
  defineQuestBlocks();
  workspace = Blockly.inject("blocklyDiv", {
    media: "https://unpkg.com/blockly/media/",
    trashcan: true,
    maxInstances: { q_start: 1 },
    zoom: { controls: true, wheel: false, startScale: innerWidth < 600 ? 0.9 : 1.1, maxScale: 1.8, minScale: 0.5 },
    move: { scrollbars: true, drag: true, wheel: true },
  });
  workspace.addChangeListener((event) => {
    if (event.isUiEvent) return;
    runner?.cancel(); // the code changed, so an old run or step no longer matches it
    if (loading) return;
    progress.code[currentMission().id] = Blockly.serialization.workspaces.save(workspace);
    saveProgress(progress);
    updateBlockCount();
  });
  quickAdd = createQuickAdd({
    workspace,
    root: $("#quickAdd"),
    rootType: "q_start",
    text: Object.fromEntries(["toMain", "after", "inside", "insideElse", "intoElse", "out", "main", "remove"]
      .map((name) => [name, t(`qa_${name}`)])),
  });
  new ResizeObserver(() => Blockly.svgResize(workspace)).observe($("#blocklyDiv"));
  runner = createRunner({
    workspace,
    board,
    trace: createTrace($("#traceTable")),
    evaluateNow: () => evaluate(programFromState(Blockly.serialization.workspaces.save(workspace)), currentMission()),
    mission: currentMission,
    mapIndex: () => view.map,
    showMap,
    columns: (mission, index) => {
      const options = boardOptions(mission, index);
      return { vars: options.badges, list: Boolean(options.list), label: varLabel };
    },
    finish: finishRun,
    status: setResult,
    delay: () => 900 - Number($("#speed").value),
  });
  bindControls();
  selectMission(...initialSelection());
}

boot();
