// "📊 My progress" dialog for Quest Lab and Story Lab: name or seat → a QR code the teacher scans.
// The QR code holds a teacher.html#p=… link, so the teacher's iPad camera opens the class table directly.
import { PROGRESS_PREFIX, buildProgress, encodeProgress } from "./code.js";
import { loadProgress } from "../quest/storage.js";
import { MAX_NAME, cleanName, fillSeats, loadName, saveName } from "../shared/student.js";
import { qrImage } from "../shared/qr.js";
import { lang } from "../quest/i18n.js";

const STORY_KEY = "blocky-story-v2";
const TEXT = {
  en: {
    title: "📊 My progress code", name: "Your name or seat number (shown in your teacher's table)", make: "Make my code",
    shareSeat: "Seat no.", seatNo: "No. {n}", needName: "Type your name or pick your seat number first.",
    scan: "Show this to your teacher to scan.", noQr: "No QR code (offline?). Copy the code and send it to your teacher.",
    copy: "Copy", copied: "Code copied!", summary: "⭐ {stars} stars · {story} Story challenges", close: "Close",
  },
  zh: {
    title: "📊 我的進度碼", name: "你的名字或座號（會顯示在老師的表格）", make: "產生進度碼",
    shareSeat: "座號", seatNo: "{n} 號", needName: "請先輸入名字，或選擇座號。",
    scan: "拿給老師掃描就可以了。", noQr: "沒有產生 QR code（可能沒有網路），請複製進度碼傳給老師。",
    copy: "複製", copied: "已複製進度碼！", summary: "⭐ {stars} 顆星 · 完成 {story} 個 Story 挑戰", close: "關閉",
  },
};
const t = (key, params = {}) => TEXT[lang === "zh" ? "zh" : "en"][key].replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ""));

function storyDone() {
  try { return JSON.parse(localStorage.getItem(STORY_KEY))?.done ?? {}; } catch { return {}; }
}

function el(tag, attrs = {}, text) {
  const node = Object.assign(document.createElement(tag), attrs);
  if (text !== undefined) node.textContent = text;
  return node;
}

function buildDialog() {
  const dialog = el("dialog", { className: "share-dialog progress-dialog" });
  const form = el("form", { method: "dialog" });
  const input = el("input", { type: "text", autocomplete: "off", maxLength: MAX_NAME, value: loadName() });
  input.setAttribute("aria-label", t("name"));
  const seat = el("select");
  seat.setAttribute("aria-label", t("shareSeat"));
  fillSeats(seat, input, t);
  const make = el("button", { type: "button", className: "btn btn-run" }, `📊 ${t("make")}`);
  const result = el("div", { className: "share-result", hidden: true });
  const qr = el("img", { className: "share-qr", alt: "QR code" });
  const summary = el("p", { className: "share-label" });
  const code = el("input", { type: "text", readOnly: true });
  code.setAttribute("aria-label", "Progress code");
  const copy = el("button", { type: "button", className: "btn btn-soft" }, `📋 ${t("copy")}`);
  const note = el("p", { className: "share-note" });
  note.setAttribute("aria-live", "polite");
  const codeRow = el("div", { className: "share-row" });
  codeRow.append(code, copy);
  result.append(qr, summary, codeRow);
  const nameRow = el("div", { className: "share-row" });
  nameRow.append(input, seat);
  form.append(el("h2", {}, t("title")), el("p", { className: "share-label" }, t("name")), nameRow, make, result, note,
    el("button", { className: "btn btn-soft share-close", value: "close" }, `✕ ${t("close")}`));
  dialog.append(form);
  document.body.append(dialog);

  make.addEventListener("click", async () => {
    const name = cleanName(input.value);
    if (!name) {
      note.textContent = t("needName");
      input.focus();
      return;
    }
    saveName(name);
    const { stars, tries } = loadProgress();
    const done = storyDone();
    const packed = await encodeProgress(buildProgress({ name, stars, tries, done }));
    const link = `${new URL("teacher.html", location.href).href}${PROGRESS_PREFIX}${packed}`;
    code.value = link;
    summary.textContent = t("summary", { stars: Object.values(stars).reduce((a, b) => a + b, 0), story: Object.values(done).filter(Boolean).length });
    result.hidden = false;
    const image = await qrImage(link);
    qr.hidden = !image;
    if (image) qr.src = image;
    note.textContent = t(image ? "scan" : "noQr");
  });
  copy.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(code.value); } catch { code.select(); document.execCommand?.("copy"); }
    note.textContent = t("copied");
  });
  return dialog;
}

export function bindProgressButton(button) {
  let dialog = null;
  button.title = t("title");
  button.setAttribute("aria-label", t("title"));
  button.addEventListener("click", () => {
    dialog ??= buildDialog();
    dialog.showModal();
  });
}
