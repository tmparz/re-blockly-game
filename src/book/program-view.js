// Draws a program as big, colourful block rows (the same words as the Quest Lab blocks) and edits it by tapping.
// No Blockly here: the book must work offline, without a CDN.
import { BLOCK_TEXT, COND_TEXT, fnLabel } from "./missions.js";
import { blockId, ownerOf } from "./run.js";

export const esc = (text) => String(text ?? "").replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
export const CONDS = Object.keys(COND_TEXT);

export function blockLabel(item) {
  if (typeof item === "string") return BLOCK_TEXT[item] ?? item;
  if ("call" in item) return fnLabel(item.call);
  if ("repeat" in item) return `${BLOCK_TEXT.repeat} ${item.repeat} 次`;
  if ("until" in item) return BLOCK_TEXT.until;
  if ("if" in item) return `${BLOCK_TEXT.if} ${COND_TEXT[item.if] ?? item.if}`;
  return "？";
}

export function blockKind(item) {
  if (typeof item === "string") return item === "pick" ? "gem" : item === "move" ? "move" : "turn";
  if ("call" in item) return "fn";
  if ("repeat" in item || "until" in item) return "loop";
  return "logic";
}

const canEdit = (opt, key) => Boolean(opt.editable) && !opt.locked?.has(ownerOf(key));

function toolsHtml(item, id) {
  const tools = [];
  if (typeof item === "object" && "repeat" in item) {
    tools.push(`<button type="button" class="tool" data-act="minus" data-id="${id}" aria-label="少一次">−</button>`);
    tools.push(`<button type="button" class="tool" data-act="plus" data-id="${id}" aria-label="多一次">＋</button>`);
  }
  if (typeof item === "object" && "if" in item) {
    tools.push(`<button type="button" class="tool" data-act="cond" data-id="${id}">換條件</button>`);
  }
  tools.push(`<button type="button" class="tool del" data-act="del" data-id="${id}" aria-label="拿掉這個方塊">✕</button>`);
  return `<span class="tools">${tools.join("")}</span>`;
}

function listHtml(items, key, opt) {
  const blocks = items.map((item, index) => blockHtml(item, key, index, opt)).join("");
  const empty = items.length ? "" : `<li class="empty">（空的）</li>`;
  const drop = canEdit(opt, key)
    ? `<button type="button" class="drop" data-act="target" data-list="${esc(key)}" aria-pressed="${opt.target === key}">＋ 放到這裡</button>`
    : "";
  return `<ol class="blocks">${blocks}${empty}</ol>${drop}`;
}

function blockHtml(item, key, index, opt) {
  const id = blockId(key, index);
  const tools = canEdit(opt, key) ? toolsHtml(item, id) : "";
  let inner = "";
  if (typeof item === "object" && item.do) {
    const other = item.else ? `<p class="else-tag">否則</p>${listHtml(item.else, `${key}/${index}/else`, opt)}` : "";
    inner = `<div class="inner">${listHtml(item.do, `${key}/${index}/do`, opt)}${other}</div>`;
  }
  return `<li class="blk ${blockKind(item)}" data-id="${esc(id)}"><span class="blk-row"><span class="blk-text">${esc(blockLabel(item))}</span>${tools}</span>${inner}</li>`;
}

// The main program first, then one purple "define" box per function (only functions the program has).
export function programHtml(dsl, names = [], opt = {}) {
  const defs = dsl.defs ?? {};
  const shown = names.filter((name) => name in defs);
  const main = `<section class="prog main" data-owner="main"><h4>▶ 按下執行時</h4>${listHtml(dsl.main ?? [], "main", opt)}</section>`;
  const boxes = shown.map((name) => `<section class="prog def" data-owner="${esc(name)}">
    <h4>🧩 定義 ${esc(fnLabel(name))}</h4>${listHtml(defs[name], name, opt)}</section>`).join("");
  return main + boxes;
}

// ---- editing a program by position ----

export function listAt(dsl, key) {
  const [owner, ...rest] = key.split("/");
  let list = owner === "main" ? dsl.main : (dsl.defs[owner] ??= []);
  for (let i = 0; i < rest.length; i += 2) list = list[Number(rest[i])][rest[i + 1]];
  return list;
}

export function itemAt(dsl, id) {
  const at = id.lastIndexOf("#");
  const list = listAt(dsl, id.slice(0, at));
  return { list, index: Number(id.slice(at + 1)) };
}

// New blocks from the palette, using the mission's own block list.
export const NEW_BLOCK = {
  move: () => "move",
  left: () => "left",
  right: () => "right",
  pick: () => "pick",
  repeat: () => ({ repeat: 2, do: [] }),
  until: () => ({ until: true, do: [] }),
  if: () => ({ if: "pathAhead", do: [] }),
  ifElse: () => ({ if: "pathAhead", do: [], else: [] }),
};

export function applyTool(dsl, act, id) {
  const { list, index } = itemAt(dsl, id);
  const item = list[index];
  if (act === "del") list.splice(index, 1);
  if (act === "minus" && item.repeat > 1) item.repeat -= 1;
  if (act === "plus" && item.repeat < 9) item.repeat += 1;
  if (act === "cond") item.if = CONDS[(CONDS.indexOf(item.if) + 1) % CONDS.length];
}

// Light up the block being run, and every function box on the way to it.
export function highlight(root, id, chain = []) {
  root.querySelectorAll(".now").forEach((el) => el.classList.remove("now"));
  root.querySelectorAll(".prog.active").forEach((el) => el.classList.remove("active"));
  if (!id) return;
  root.querySelector(`[data-id="${CSS.escape(id)}"]`)?.classList.add("now");
  chain.forEach((owner) => root.querySelector(`.prog[data-owner="${CSS.escape(owner)}"]`)?.classList.add("active"));
}
