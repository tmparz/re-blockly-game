import { UNITS } from "./missions/index.js";
import { evaluate } from "./engine.js";
import { countBlocks, programFromState, stateFromDsl } from "./program.js";
import { BLOCK_LABELS, defineQuestBlocks, setFunctionNames, toolboxFor } from "./blocks.js";
import { createBoard } from "./board.js";
import { lang, pick, setLang, t } from "./i18n.js";
import { loadProgress, saveProgress } from "./storage.js";

const $ = (selector) => document.querySelector(selector);
const progress = loadProgress();
const board = createBoard($("#board"));
const view = { unit: 0, mission: 0, map: 0, runToken: 0, results: null };
let workspace = null;
let loading = false;

const currentUnit = () => UNITS[view.unit];
const currentMission = () => currentUnit().missions[view.mission];
const usesCounter = (mission) => mission.blocks.includes("set") || mission.blocks.includes("say");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

function renderUnitTabs() {
  $("#unitTabs").innerHTML = "";
  UNITS.forEach((unit, index) => {
    const stars = unit.missions.reduce((sum, m) => sum + (progress.stars[m.id] ?? 0), 0);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "unit-tab";
    button.setAttribute("aria-pressed", String(index === view.unit));
    button.innerHTML = `<span class="unit-icon">${unit.icon}</span><span><strong></strong><small></small></span>`;
    button.querySelector("strong").textContent = pick(unit.title);
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
  $("#mapTabs").innerHTML = `<span>${t("maps")}</span>`;
  mission.maps.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "map-tab";
    const outcome = view.results?.[index];
    button.dataset.outcome = outcome ? (outcome.ok ? "pass" : "fail") : "";
    button.textContent = `${t("map", { n: index + 1 })}${outcome ? (outcome.ok ? " ✓" : " ✗") : ""}`;
    button.setAttribute("aria-pressed", String(index === view.map));
    button.addEventListener("click", () => showMap(index));
    $("#mapTabs").append(button);
  });
}

function showMap(index) {
  view.runToken += 1;
  view.map = index;
  board.draw(currentMission().maps[index], { showCounter: usesCounter(currentMission()) });
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

  $("#missionKicker").textContent = `${currentUnit().icon} ${pick(currentUnit().title)} · ${t("mission", { n: missionIndex + 1 })}`;
  $("#missionTitle").textContent = pick(mission.title);
  $("#missionStory").textContent = pick(mission.story);
  $("#missionHint").textContent = pick(mission.hint);
  $("#hintBox").open = false;
  $("#limitChip").textContent = t("limit", { max: mission.maxBlocks, best: mission.best });
  $("#nextButton").hidden = true;
  setResult(t("ready"));

  setFunctionNames(mission.functions);
  workspace.updateToolbox(toolboxFor(mission));
  loadState(progress.code[mission.id] ?? stateFromDsl(mission.starter));
  renderUnitTabs();
  renderMissionDots();
  showMap(0);
}

function describeFailure(evaluation, mission) {
  if (evaluation.reason === "require") {
    return t("require", { block: BLOCK_LABELS[evaluation.op](), n: evaluation.n });
  }
  if (evaluation.reason === "tooManyBlocks") return t("tooManyBlocks", { count: evaluation.blocks, max: mission.maxBlocks });
  const failed = evaluation.maps[evaluation.failedIndex];
  const multi = mission.maps.length > 1 && evaluation.failedIndex != null;
  const prefix = multi ? t("failedOnMap", { n: evaluation.failedIndex + 1 }) : "";
  return prefix + t(evaluation.reason, { n: mission.win?.exactGems, want: failed?.want, said: failed?.said });
}

async function run() {
  const mission = currentMission();
  const program = programFromState(Blockly.serialization.workspaces.save(workspace));
  const evaluation = evaluate(program, mission);
  view.results = evaluation.maps.length ? evaluation.maps : null;
  if (!evaluation.maps.length) {
    setResult(describeFailure(evaluation, mission), "fail");
    return;
  }
  const index = evaluation.ok ? view.map : evaluation.failedIndex;
  showMap(index);
  const token = view.runToken;
  $("#runButton").disabled = true;
  setResult(t("running"));
  const delay = 900 - Number($("#speed").value);
  for (const frame of evaluation.maps[index].frames) {
    if (token !== view.runToken) break;
    workspace.highlightBlock(frame.id ?? null);
    board.apply(frame);
    await sleep(delay);
  }
  $("#runButton").disabled = false;
  workspace.highlightBlock(null);
  if (token !== view.runToken) return;
  if (!evaluation.ok) {
    workspace.highlightBlock(evaluation.maps[index].id ?? null);
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
  $("#runButton").addEventListener("click", run);
  $("#resetButton").addEventListener("click", () => showMap(view.map));
  $("#restartButton").addEventListener("click", () => {
    if (!confirm(t("confirmRestart"))) return;
    loadState(stateFromDsl(currentMission().starter));
    showMap(view.map);
  });
  $("#answerButton").addEventListener("click", () => {
    if (!confirm(t("confirmAnswer"))) return;
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
  const unitId = params.get("unit") ?? progress.last?.unit;
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
    toolbox: toolboxFor(UNITS[0].missions[0]),
    media: "https://unpkg.com/blockly/media/",
    trashcan: true,
    maxInstances: { q_start: 1 },
    zoom: { controls: true, wheel: false, startScale: innerWidth < 600 ? 0.9 : 1.25, maxScale: 1.8, minScale: 0.5 },
    move: { scrollbars: true, drag: true, wheel: true },
  });
  workspace.addChangeListener((event) => {
    if (event.isUiEvent || loading) return;
    progress.code[currentMission().id] = Blockly.serialization.workspaces.save(workspace);
    saveProgress(progress);
    updateBlockCount();
  });
  new ResizeObserver(() => Blockly.svgResize(workspace)).observe($("#blocklyDiv"));
  bindControls();
  selectMission(...initialSelection());
}

boot();
