import { UNITS, missionIndex, missionNumber, missionParam } from "./missions/index.js";
import { evaluate } from "./engine.js";
import { countBlocks, programFromState, stateFromDsl } from "./program.js";
import { defineQuestBlocks, quickItems, setFunctionNames } from "./blocks.js";
import { setMissionContext, varLabel } from "./blocks-advanced.js";
import { askConfirm, describeFailure } from "./ui.js";
import { createRunner } from "./runner.js";
import { createTrace } from "./trace.js";
import { renderMapTabs, renderMissionDots, renderUnitTabs } from "./nav.js";
import { choiceText, isPredict, judge, lockState, rightChoice } from "./predict.js";
import { createPredictUI } from "./predict-ui.js";
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
const predictUI = createPredictUI({ bar: $("#predictBar"), quick: $("#quickAdd") });

const currentUnit = () => UNITS[view.unit];
const currentMission = () => currentUnit().missions[view.mission];
// What the board shows under the map: the counter (Part 2), named variables and the list (Part 3).
const boardOptions = (mission, index) => ({
  badges: mission.vars ?? (mission.blocks.includes("set") || mission.blocks.includes("say") ? ["counter"] : []),
  list: mission.lists || mission.blocks.includes("addList") ? mission.lists?.[index] ?? [] : null,
  label: varLabel,
  start: Array.isArray(mission.varStart) ? mission.varStart[index] : mission.varStart ?? {},
  marks: mission.ask?.marks,
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

const renderNav = () => {
  renderUnitTabs($("#unitTabs"), { units: UNITS, current: view.unit, stars: progress.stars, onSelect: selectMission });
  renderMissionDots($("#missionDots"), { unit: currentUnit(), current: view.mission, stars: progress.stars,
    onSelect: (index) => selectMission(view.unit, index) });
};
const renderMaps = () => renderMapTabs($("#mapTabs"), { count: currentMission().maps.length, current: view.map, results: view.results, onSelect: showMap });

// 🔮 A predict mission judges the chosen answer instead of checking a goal.
function evaluateNow() {
  const mission = currentMission();
  if (!isPredict(mission)) return evaluate(programFromState(Blockly.serialization.workspaces.save(workspace)), mission);
  if (predictUI.choice === null) return { ok: false, maps: [], reason: "pickFirst" };
  return judge(mission, predictUI.choice, predictUI.missed);
}

const startingState = (mission) => (isPredict(mission) ? lockState(stateFromDsl(mission.program))
  : progress.code[mission.id] ?? stateFromDsl(mission.starter));

function showMap(index) {
  runner?.cancel();
  view.map = index;
  board.draw(currentMission().maps[index], boardOptions(currentMission(), index));
  renderMaps();
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
  history.replaceState(null, "", `?unit=${currentUnit().id}&m=${missionParam(currentUnit(), missionIndex)}`);

  const tier = mission.tier ? ` · ${t(`tier_${mission.tier}`)}` : "";
  const number = missionNumber(currentUnit(), missionIndex);
  $("#missionKicker").textContent = `${currentUnit().icon} ${pick(currentUnit().title)} · ${number === null ? t("predictKicker") : t("mission", { n: number })}${tier}`;
  $("#missionTitle").textContent = pick(mission.title);
  $("#missionStory").textContent = pick(mission.story);
  $("#missionLesson").hidden = !mission.lesson;
  $("#missionLesson").textContent = mission.lesson ? `🎯 ${pick(mission.lesson)}` : "";
  $("#missionHint").textContent = pick(mission.hint);
  $("#hintBox").open = false;
  $("#limitChip").textContent = isPredict(mission) ? t("predictChip") : t("limit", { max: mission.maxBlocks, best: mission.best });
  $("#nextButton").hidden = true;
  setResult(t("ready"));

  setFunctionNames(mission.functions);
  setMissionContext(mission);
  quickAdd.setItems(quickItems(mission));
  if (isPredict(mission)) predictUI.show(mission);
  else predictUI.hide();
  loadState(startingState(mission));
  renderNav();
  showMap(0);
}

// After the last frame (or right away when nothing could run): show the result and award stars.
function finishRun(evaluation, index) {
  const mission = currentMission();
  view.results = evaluation.maps.length ? evaluation.maps : null;
  if (index !== null) renderMaps();
  if (!evaluation.ok) {
    if (index !== null) workspace.highlightBlock(evaluation.maps[index].id ?? null);
    setResult(describeFailure(evaluation, mission), "fail");
    // A wrong guess opens the trace table so students can find the step they pictured differently.
    if (evaluation.reason?.startsWith("wrongGuess")) {
      predictUI.markMiss();
      $(".mission-panel").classList.add("tracing");
      $("#traceToggle").setAttribute("aria-pressed", "true");
    }
    return;
  }
  const earned = Math.max(evaluation.stars, progress.stars[mission.id] ?? 0);
  progress.stars[mission.id] = earned;
  saveProgress(progress);
  const message = isPredict(mission) ? t(evaluation.stars === 3 ? "predictRight" : "predictRightLater")
    : evaluation.stars === 3 ? t("success3") : t("success2", { best: mission.best });
  const maps = mission.maps.length > 1 ? ` ${t("allMaps", { n: mission.maps.length })}` : "";
  setResult(message + maps, "success");
  $("#nextButton").hidden = !nextTarget();
  renderTotals();
  renderNav();
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
    if (isPredict(currentMission())) predictUI.show(currentMission());
    loadState(isPredict(currentMission()) ? startingState(currentMission()) : stateFromDsl(currentMission().starter));
    showMap(view.map);
  });
  $("#answerButton").addEventListener("click", async () => {
    if (!(await askConfirm(t("confirmAnswer")))) return;
    const mission = currentMission();
    showMap(view.map);
    if (isPredict(mission)) {
      predictUI.reveal(rightChoice(mission));
      setResult(t("predictAnswer", { answer: choiceText(rightChoice(mission)) }));
      return;
    }
    loadState(stateFromDsl(mission.solution));
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
  const fromUrl = missionIndex(UNITS[unitIndex], params.get("m"));
  const fromLast = progress.last?.unit === UNITS[unitIndex].id ? progress.last.mission : 0;
  const index = fromUrl >= 0 ? fromUrl : fromLast;
  return [unitIndex, Math.min(index, UNITS[unitIndex].missions.length - 1)];
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
    evaluateNow,
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
