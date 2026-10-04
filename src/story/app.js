import { ALL_STORY_TASKS, CHALLENGES, checkGoals, goalsFor } from "./challenges.js";
import { PRODUCT_STEPS, PRODUCT_TASKS } from "./product.js";
import { GAME_STEPS, GAME_TASKS } from "./game.js";
import { CATEGORIES, HUES, chipsFor, defineStoryBlocks } from "./blocks.js";
import { createStage } from "./stage.js";
import { createRuntime } from "./runtime.js";
import { play } from "./sound.js";
import { ACTORS } from "./actors.js";
import { lang, pick, setLang, t } from "./i18n.js";
import { createQuickAdd } from "../quest/quick-add.js";
import { createShareUI, remixLine, takeSharedLink } from "./share-ui.js";
import { renderNav } from "./nav.js";

const STORAGE_KEY = "blocky-story-v2";
const $ = (selector) => document.querySelector(selector);
// Two tracks: the event/story challenges, and Product Studio (build one app version by version).
const TRACKS = { story: ALL_STORY_TASKS, product: PRODUCT_TASKS, game: GAME_TASKS };
const CAPSTONES = { mine: "myStory", "my-product": "myProduct", "my-game": "myGame" };
// Kicker label and number of guided steps for each track.
const TRACK_INFO = {
  story: () => [t("challenges"), CHALLENGES.length],
  product: () => [`🛠️ ${t("productStudio")}`, PRODUCT_STEPS.length],
  game: () => [`🎮 ${t("gameStudio")}`, GAME_STEPS.length],
};
const view = { track: "story", index: 0, category: "events", goals: [] };
let progress = { done: {}, code: {}, last: null, remix: {} };
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

const tasks = () => TRACKS[view.track];
const task = () => tasks()[view.index];
// Credit chain of a project opened from a share code (newest author first); empty for the student's own work.
const goalContext = () => ({ remixOf: progress.remix[task().id] ?? [] });
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
  renderNav($("#taskNav"), { tracks: TRACKS, track: view.track, index: view.index, done: progress.done, capstones: CAPSTONES, onSelect: selectTask });
}

function renderGoals() {
  const current = task();
  view.goals = checkGoals(current, Blockly.serialization.workspaces.save(workspace), goalContext());
  const done = view.goals.filter(Boolean).length;
  $("#goalCount").textContent = t("allGoals", { done, total: view.goals.length });
  $("#goalList").innerHTML = "";
  goalsFor(current, goalContext()).forEach((g, i) => {
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
  try {
    Blockly.serialization.workspaces.load(state, workspace);
  } catch {
    // A damaged shared project: fall back to an empty "when Run" script instead of a broken page.
    workspace.clear();
    Blockly.serialization.workspaces.load(task().starter, workspace);
  }
  workspace.cleanUp();
  workspace.scroll(20, 20);
  loading = false;
  quickAdd.reset();
  renderGoals();
}

// A carried step starts from the student's own previous version, so the product keeps growing.
function startingCode(current) {
  if (progress.code[current.id]) return { code: progress.code[current.id] };
  const previous = tasks()[view.index - 1];
  if (current.carry && progress.code[previous.id]) return { code: progress.code[previous.id], carried: true };
  return { code: current.starter };
}

function selectTask(index, track = view.track) {
  runtime.stop();
  view.track = track;
  view.index = index;
  const current = task();
  progress.last = current.id;
  save();
  history.replaceState(null, "", `?c=${current.id}`);
  const [label, total] = TRACK_INFO[view.track]();
  const number = CAPSTONES[current.id] ? `✨ ${label}` : `${label} ${index + 1} / ${total}`;
  $("#taskKicker").textContent = number;
  $("#taskTitle").textContent = pick(current.title);
  $("#taskText").textContent = pick(current.task);
  $("#taskIdea").hidden = !current.idea;
  $("#taskIdea").textContent = current.idea ? `💡 ${pick(current.idea)}` : "";
  $("#remixCredit").textContent = remixLine(goalContext().remixOf, t);
  $("#remixCredit").hidden = !goalContext().remixOf.length;
  $("#goalsLabel").textContent = t(CAPSTONES[current.id] ? "rubric" : "goals");
  $("#nextButton").hidden = true;
  stage.reset();
  const { code, carried } = startingCode(current);
  loadState(code);
  renderTaskNav();
  setStatus(t(carried ? "carried" : "ready"));
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
  $("#nextButton").hidden = view.index >= tasks().length - 1;
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
    delete progress.remix[task().id];
    selectTaskCode(task().example);
    setStatus(t("exampleLoaded"));
  });
  $("#clearButton").addEventListener("click", () => {
    if (!confirm(t("confirmClear"))) return;
    runtime.stop();
    delete progress.remix[task().id];
    selectTaskCode({ blocks: { languageVersion: 0, blocks: [{ type: "story_start", x: 20, y: 20 }] } });
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

// Clearing or loading the example also drops a remix credit, so refresh the title area along with the blocks.
function selectTaskCode(code) {
  progress.code[task().id] = code;
  save();
  selectTask(view.index);
}

function locate(id) {
  for (const [track, list] of Object.entries(TRACKS)) {
    const index = list.findIndex((item) => item.id === id);
    if (index >= 0) return [index, track];
  }
  return null;
}

function initialTask() {
  const params = new URLSearchParams(location.search);
  const id = params.get("c") ?? (params.get("track") === "product" ? PRODUCT_TASKS[0].id : progress.last);
  return locate(id) ?? [0, "story"];
}

// A shared project opens in the same challenge it was made in, as a remix that credits its authors.
function openShared(shared) {
  if (!shared) return;
  const place = !shared.broken && locate(shared.task);
  if (!place) return setStatus(t("shareBroken"), "fail");
  const name = shared.authors[0] ?? "?";
  const id = TRACKS[place[1]][place[0]].id;
  if (progress.code[id] && !confirm(t("confirmOpenShare", { name }))) return;
  progress.code[id] = shared.code;
  progress.remix[id] = shared.authors;
  selectTask(...place);
  setStatus(t("shareOpened", { name }), "success");
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
  createShareUI({ t, current: () => ({ task: task().id, code: Blockly.serialization.workspaces.save(workspace), remixOf: goalContext().remixOf }) });
  const shared = takeSharedLink(); // reads the #share= hash before selectTask rewrites the address
  selectTask(...initialTask());
  shared.then(openShared);
  addEventListener("hashchange", () => takeSharedLink().then(openShared));
}

boot();
