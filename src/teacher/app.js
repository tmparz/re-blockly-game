// Teacher class table: collects progress codes (scanned teacher.html#p=… links or pasted codes) into this
// browser's storage and shows stars and the stuck mission per unit. Nothing leaves the device except a CSV export.
import { UNITS } from "../quest/missions/index.js";
import { PROGRESS_PREFIX, decodeProgress, summarize, toCsv } from "../progress/code.js";

const STORAGE_KEY = "blocky-teacher-class";
const STORY_NAMES = { story: "🎬 故事", product: "🛠️ 產品", game: "🎮 遊戲" };
const STORY_PART = { story: 2, product: 2, game: 3 };
const $ = (selector) => document.querySelector(selector);

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY))?.students ?? {}; } catch { return {}; }
}
let students = load();
const save = () => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ students })); } catch { flash("這個瀏覽器不能儲存資料（可能是無痕模式）。", "bad"); }
};
const sorted = () => Object.values(students).sort((a, b) => a.name.localeCompare(b.name, "zh-Hant", { numeric: true }));

function flash(text, tone = "") {
  $("#flash").textContent = text;
  $("#flash").dataset.tone = tone;
}

// Adds every code found in the text; the newest scan of a name replaces the older one.
async function addCodes(text) {
  const pieces = String(text).split(/\s+/).filter(Boolean);
  const added = [];
  const problems = [];
  for (const piece of pieces) {
    const { record, error, name } = await decodeProgress(piece);
    if (record) {
      students[record.name] = record;
      added.push(record.name);
    } else problems.push(error === "otherVersion" ? `${name || "?"} 的進度碼是舊版本，請他重新整理頁面再產生一次` : "有一個進度碼壞掉了");
  }
  if (added.length) save();
  flash([added.length ? `已加入：${added.join("、")}` : "", ...problems].filter(Boolean).join("；"), problems.length && !added.length ? "bad" : "");
  render();
}

function cell(tr, text, className) {
  const td = document.createElement("td");
  if (className) td.className = className;
  if (text instanceof Node) td.append(text);
  else td.textContent = text;
  tr.append(td);
  return td;
}

function starsCell(unit) {
  const box = document.createElement("span");
  const stars = Object.assign(document.createElement("span"), { className: "stars", textContent: `⭐ ${unit.stars}/${unit.max}` });
  stars.dataset.level = unit.stars === 0 ? "0" : unit.stars === unit.max ? "3" : "1";
  box.append(stars);
  if (unit.stuck) box.append(Object.assign(document.createElement("span"), { className: "stuck", textContent: `卡：${unit.stuck.label}（${unit.stuck.tries} 次）` }));
  return box;
}

function render() {
  const part = $("#partFilter").value;
  const show = (p) => part === "all" || String(p) === part;
  const units = UNITS.filter((unit) => show(unit.part));
  const tracks = Object.keys(STORY_NAMES).filter((id) => show(STORY_PART[id]));
  const table = $("#classTable");
  table.replaceChildren();
  const head = document.createElement("tr");
  ["學生", "更新"].forEach((name) => head.append(Object.assign(document.createElement("th"), { textContent: name })));
  units.forEach((unit) => {
    const th = Object.assign(document.createElement("th"), { textContent: `${unit.icon} ${unit.short.zh}` });
    th.append(Object.assign(document.createElement("small"), { textContent: unit.concept.zh }));
    head.append(th);
  });
  tracks.forEach((id) => head.append(Object.assign(document.createElement("th"), { textContent: STORY_NAMES[id] })));
  head.append(document.createElement("th"));
  const thead = document.createElement("thead");
  thead.append(head);
  const body = document.createElement("tbody");
  const list = sorted();
  list.forEach((record) => {
    const { units: summary, story } = summarize(record);
    const tr = document.createElement("tr");
    cell(tr, record.name, "name");
    cell(tr, record.date.slice(5), "date");
    units.forEach((unit) => cell(tr, starsCell(summary.find((u) => u.id === unit.id))));
    tracks.forEach((id) => { const s = story.find((x) => x.id === id); cell(tr, `${s.done}/${s.total}`); });
    const del = Object.assign(document.createElement("button"), { type: "button", className: "del", textContent: "🗑", title: `刪除 ${record.name}` });
    del.addEventListener("click", () => {
      if (!confirm(`要刪除 ${record.name} 的進度嗎？`)) return;
      delete students[record.name];
      save();
      render();
    });
    cell(tr, del);
    body.append(tr);
  });
  if (!list.length) {
    const tr = document.createElement("tr");
    const td = cell(tr, "還沒有學生的進度。請學生按「📊」產生 QR code，用這台 iPad 的相機掃描。", "empty");
    td.colSpan = units.length + tracks.length + 3;
    body.append(tr);
  }
  table.append(thead, body);
  $("#count").textContent = `共 ${list.length} 位學生`;
}

function downloadCsv() {
  const csv = `﻿${toCsv(sorted(), (unit) => unit.short.zh)}`; // BOM so Excel reads Chinese correctly
  const link = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })),
    download: `class-progress-${new Date().toISOString().slice(0, 10)}.csv`,
  });
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

// A scanned QR code opens teacher.html#p=…: add it, then clear the address so a refresh does not add it again.
async function takeHash() {
  if (!location.hash.startsWith(PROGRESS_PREFIX)) return;
  const code = location.hash;
  history.replaceState(null, "", location.pathname);
  await addCodes(code);
}

$("#addButton").addEventListener("click", async () => {
  await addCodes($("#pasteBox").value);
  $("#pasteBox").value = "";
});
$("#partFilter").addEventListener("change", render);
$("#csvButton").addEventListener("click", downloadCsv);
$("#clearButton").addEventListener("click", () => {
  if (!confirm("要清除這台 iPad 上全班的進度嗎？這個動作不能復原。")) return;
  students = {};
  save();
  render();
});
addEventListener("hashchange", takeHash);
render();
takeHash();
