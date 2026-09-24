import { ALL_STORY_TASKS, CHALLENGES, checkGoals } from "./challenges.js";
import { CATEGORIES, HUES, chipsFor, defineStoryBlocks } from "./blocks.js";
import { createStage } from "./stage.js";
import { createRuntime } from "./runtime.js";
import { play } from "./sound.js";
import { ACTORS } from "./actors.js";
import { lang, pick, setLang, t } from "./i18n.js";
import { createQuickAdd } from "../quest/quick-add.js";

const STORAGE_KEY = "blocky-story-v2";
const $ = (selector) => document.querySelector(selector);
const view = { index: 0, category: "events", goals: [] };
let progress = { done: {}, code: {}, last: null };
let workspace = null;
let quickAdd = null;
let runtime = null;
let loading = false;

try {
  progress = { ...progress, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
} catch {
  // First visit or blocked storage.
}
const save = () => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* storage blocked */ }
};

const task = () => ALL_STORY_TASKS[view.index];
const setStatus = (text, tone = "") => {
  $("#status").textContent = text;
  $("#status").dataset.tone = tone;
};
const stage = createStage($("#stage"));

function renderStaticText() {
  document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  document.title = t("pageTitle");
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
}

function renderTaskNav() {
  $("#taskNav").innerHTML = "";
  ALL_STORY_TASKS.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `task-dot${item.id === "mine" ? " mine" : ""}`;
    button.textContent = item.id === "mine" ? `✨ ${t("myStory")}` : String(index + 1);
    button.dataset.done = String(Boolean(progress.done[item.id]));
    button.setAttribute("aria-pressed", String(index === view.index));
    button.setAttribute("aria-label", pick(item.title));
    button.title = pick(item.title);
    button.addEventListener("click", () => selectTask(index));
    $("#taskNav").append(button);
  });
}

function renderGoals() {
  const current = task();
  view.goals = checkGoals(current, Blockly.serialization.workspaces.save(workspace));
  const done = view.goals.filter(Boolean).length;
  $("#goalCount").textContent = t("allGoals", { done, total: view.goals.length });
  $("#goalList").innerHTML = "";
  current.goals.forEach((g, i) => {
    const li = document.createElement("li");
    li.dataset.done = String(view.goals[i]);
    li.textContent = pick(g.text);
    $("#goalList").append(li);
  });
  $("#blockCount").textContent = t("blocks", { n: workspace.getAllBlocks(false).length });
}

function renderCategories() {
  $("#categoryTabs").innerHTML = "";
  for (const category of CATEGORIES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cat-tab";
    button.style.setProperty("--cat", Blockly.utils.colour.hueToHex(HUES[category]));
    button.textContent = t(`cat_${category}`);
    button.setAttribute("aria-pressed", String(category === view.category));
    button.addEventListener("click", () => {
      view.category = category;
      renderCategories();
      quickAdd.setItems(chipsFor(category), { keepTarget: true });
    });
    $("#categoryTabs").append(button);
  }
}

function loadState(state) {
  loading = true;
  workspace.clear();
  Blockly.serialization.workspaces.load(state, workspace);
  workspace.cleanUp();
  workspace.scroll(20, 20);
  loading = false;
  quickAdd.reset();
  renderGoals();
}

function selectTask(index) {
  runtime.stop();
  view.index = index;
  const current = task();
  progress.last = current.id;
  save();
  history.replaceState(null, "", `?c=${current.id}`);
  const number = current.id === "mine" ? "✨" : `${t("challenges")} ${index + 1} / ${CHALLENGES.length}`;
  $("#taskKicker").textContent = number;
  $("#taskTitle").textContent = pick(current.title);
  $("#taskText").textContent = pick(current.task);
  $("#goalsLabel").textContent = t(current.id === "mine" ? "rubric" : "goals");
  $("#nextButton").hidden = true;
  stage.reset();
  loadState(progress.code[current.id] ?? current.starter);
  renderTaskNav();
  setStatus(t("ready"));
}

function maybeComplete() {
  const current = task();
  if (!view.goals.length || !view.goals.every(Boolean)) return;
  const first = !progress.done[current.id];
  progress.done[current.id] = true;
  save();
  if (first) {
    stage.confetti();
    play("cheer");
  }
  setStatus(t("complete"), "success");
  $("#nextButton").hidden = view.index >= ALL_STORY_TASKS.length - 1;
  renderTaskNav();
}

async function run() {
  setStatus(t("playing"));
  await runtime.run();
  // Keep "Stopped." or a step-limit warning if one appeared while playing.
  if ($("#status").textContent === t("playing")) setStatus(t("ready"));
  maybeComplete();
}

function bindControls() {
  $("#runButton").addEventListener("click", run);
  $("#presentRun").addEventListener("click", run);
  const stop = () => { runtime.stop(); setStatus(t("stopped")); };
  $("#stopButton").addEventListener("click", stop);
  $("#presentStop").addEventListener("click", stop);
  $("#resetButton").addEventListener("click", () => { runtime.stop(); stage.reset(); setStatus(t("resetDone")); });
  $("#exampleButton").addEventListener("click", () => {
    if (!confirm(t("confirmExample"))) return;
    runtime.stop();
    stage.reset();
    loadState(task().example);
    setStatus(t("exampleLoaded"));
  });
  $("#clearButton").addEventListener("click", () => {
    if (!confirm(t("confirmClear"))) return;
    runtime.stop();
    loadState({ blocks: { languageVersion: 0, blocks: [{ type: "story_start", x: 20, y: 20 }] } });
    setStatus(t("cleared"));
  });
  $("#nextButton").addEventListener("click", () => selectTask(view.index + 1));
  $("#presentButton").addEventListener("click", () => {
    document.body.classList.add("presenting");
    document.documentElement.requestFullscreen?.().catch(() => {});
  });
  $("#presentExit").addEventListener("click", () => {
    document.body.classList.remove("presenting");
    if (document.fullscreenElement) document.exitFullscreen?.();
  });
  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
}

function initialIndex() {
  const id = new URLSearchParams(location.search).get("c") ?? progress.last;
  return Math.max(0, ALL_STORY_TASKS.findIndex((item) => item.id === id));
}

function boot() {
  renderStaticText();
  if (typeof Blockly === "undefined") {
    $("#loadWarning").hidden = false;
    return;
  }
  defineStoryBlocks();
  workspace = Blockly.inject("blocklyDiv", {
    media: "https://unpkg.com/blockly/media/",
    trashcan: true,
    zoom: { controls: true, wheel: false, startScale: innerWidth < 600 ? 0.85 : 1, maxScale: 1.8, minScale: 0.5 },
    move: { scrollbars: true, drag: true, wheel: true },
  });
  quickAdd = createQuickAdd({
    workspace,
    root: $("#quickAdd"),
    rootType: "story_start",
    text: Object.fromEntries(["toMain", "after", "inside", "insideElse", "intoElse", "out", "main", "remove"]
      .map((name) => [name, t(`qa_${name}`)])),
  });
  quickAdd.setItems(chipsFor(view.category));
  runtime = createRuntime({ workspace, stage, onStatus: (key) => setStatus(t(key), "fail") });
  stage.onActorClick(async (id) => {
    const { found, finished } = runtime.click(id);
    if (!found) {
      setStatus(t("noClick", { name: pick(ACTORS[id].name) }));
      return;
    }
    await finished;
    maybeComplete();
  });
  workspace.addChangeListener((event) => {
    if (event.isUiEvent || loading) return;
    progress.code[task().id] = Blockly.serialization.workspaces.save(workspace);
    save();
    renderGoals();
  });
  new ResizeObserver(() => Blockly.svgResize(workspace)).observe($("#blocklyDiv"));
  renderCategories();
  bindControls();
  selectTask(initialIndex());
}

boot();
