// Trace table: one row per animation frame, with every variable, the list and (for recursion) the call depth.
// traceRows() is pure so tests can check it; createTrace() draws the table and follows the step being shown.
import { t } from "./i18n.js";
import { parseMap } from "./engine.js";

// The values before the first block runs, exactly as the engine starts them (rot: Robo's starting direction).
export function startState(mission, index) {
  const varStart = Array.isArray(mission.varStart) ? mission.varStart[index] : mission.varStart;
  const vars = { counter: 0, ...Object.fromEntries((mission.vars ?? []).map((name) => [name, 0])), ...varStart };
  return { vars, list: [...(mission.lists?.[index] ?? [])], rot: parseMap(mission.maps[index]).start.dir };
}

export function traceRows(frames, start) {
  const rows = [{ step: 0, kind: "start", vars: start.vars, list: start.list, depth: 0, input: null, changed: new Set() }];
  frames.forEach((frame, i) => {
    const before = rows.at(-1);
    const changed = new Set(Object.keys(frame.vars).filter((name) => frame.vars[name] !== before.vars[name]));
    if (frame.list.join() !== before.list.join()) changed.add("list");
    const turn = frame.kind === "turn" ? (frame.rot > (i ? frames[i - 1].rot : start.rot) ? "right" : "left") : null;
    rows.push({ step: i + 1, kind: frame.kind, turn, value: frame.value, vars: frame.vars, list: frame.list, depth: frame.depth ?? 0,
      input: frame.input ?? null, changed });
  });
  return rows;
}

// What happened in a row, in words: "⬆️ move", "💬 say 3", "👣 steps → 4"…
export function actionText(row, label) {
  if (row.kind === "start") return t("traceStart");
  if (row.kind === "turn") return t(row.turn === "left" ? "traceLeft" : "traceRight");
  if (row.kind === "say") return t("traceSay", { value: row.value });
  if (row.kind === "list") return t("traceList", { value: row.list.at(-1) });
  if (row.kind === "counter") {
    const names = [...row.changed].filter((name) => name !== "list");
    return names.length ? names.map((name) => `${label(name)} → ${row.vars[name]}`).join("、") : t("traceSet");
  }
  return t(`trace_${row.kind}`);
}

export function createTrace(root) {
  let rows = [];
  let columns = { vars: [], list: false, depth: false, label: (name) => name };

  function cell(tr, text, changed = false) {
    const td = document.createElement("td");
    td.textContent = text;
    if (changed) td.className = "changed";
    tr.append(td);
  }

  function header() {
    const tr = document.createElement("tr");
    const names = [t("traceStep"), t("traceAction"), ...columns.vars.map(columns.label)];
    if (columns.list) names.push("📦 []");
    if (columns.depth) names.push(t("traceDepth"), t("traceInput"));
    names.forEach((name) => {
      const th = document.createElement("th");
      th.textContent = name;
      tr.append(th);
    });
    return tr;
  }

  // Shows rows 0…upTo; later rows stay hidden so students can predict them first.
  function show(upTo) {
    const table = document.createElement("table");
    const head = document.createElement("thead");
    head.append(header());
    const body = document.createElement("tbody");
    rows.slice(0, upTo + 1).forEach((row) => {
      const tr = document.createElement("tr");
      if (row.step === upTo) tr.className = "current";
      cell(tr, String(row.step));
      cell(tr, actionText(row, columns.label));
      columns.vars.forEach((name) => cell(tr, String(row.vars[name] ?? 0), row.changed.has(name)));
      if (columns.list) cell(tr, `[${row.list.join(", ")}]`, row.changed.has("list"));
      if (columns.depth) {
        cell(tr, row.depth ? `🌀 ${row.depth}` : "–");
        cell(tr, row.input ?? "–", row.step > 0 && row.input !== rows[row.step - 1].input);
      }
      body.append(tr);
    });
    table.append(head, body);
    root.replaceChildren(table);
    body.lastElementChild?.scrollIntoView({ block: "nearest" });
  }

  return {
    // vars: the names shown on the board; recursion gets a depth column.
    load(frames, start, { vars, list, label }) {
      rows = traceRows(frames, start);
      columns = { vars, list, label, depth: rows.some((row) => row.depth >= 2) };
      show(0);
    },
    show,
    clear() {
      rows = [];
      root.replaceChildren();
    },
    row: (index) => rows[index],
    action: (index) => actionText(rows[index], columns.label),
    hasDepth: () => columns.depth,
    get length() { return rows.length; },
  };
}
