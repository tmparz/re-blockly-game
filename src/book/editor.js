// "Build it yourself": starts from the mission's starter code, then children tap blocks to change it.
import { blockCount } from "./run.js";
import { NEW_BLOCK, applyTool, blockKind, blockLabel, esc, listAt, programHtml } from "./program-view.js";

export function createEditor(root, lesson, { lock = [], onRun, onChange } = {}) {
  const mission = lesson.mission;
  const locked = new Set(lock);
  const fresh = () => {
    const dsl = structuredClone(mission.starter ?? {});
    dsl.main ??= [];
    dsl.defs ??= {};
    mission.functions.forEach((name) => { dsl.defs[name] ??= []; });
    return dsl;
  };
  const firstOpen = () => ["main", ...mission.functions].find((owner) => !locked.has(owner)) ?? "main";
  let dsl = fresh();
  let target = firstOpen();

  const palette = [
    ...mission.blocks.filter((type) => NEW_BLOCK[type]).map((type) => ({ make: NEW_BLOCK[type] })),
    ...(mission.blocks.includes("call") ? mission.functions.map((name) => ({ make: () => ({ call: name }) })) : []),
  ];

  function render() {
    const count = blockCount(dsl);
    const over = mission.maxBlocks != null && count > mission.maxBlocks;
    const lockNote = locked.has("main") ? `<p class="lock-note">🔒 這一關「▶ 按下執行時」不能動，只改函式裡面。</p>` : "";
    root.innerHTML = `
      <div class="editor-head">
        <h3>🧱 自己拼拼看 <small>（一開始是這一關的起始程式）</small></h3>
        <span class="chip" data-over="${over}">方塊 ${count} / ${mission.maxBlocks ?? "∞"}</span>
      </div>
      ${lockNote}
      <p class="palette-help">① 先按「＋ 放到這裡」選位置　② 再按下面的方塊加進去</p>
      <div class="palette">${palette.map((entry, index) => {
        const sample = entry.make();
        return `<button type="button" class="blk-btn ${blockKind(sample)}" data-act="add" data-index="${index}">${esc(blockLabel(sample))}</button>`;
      }).join("")}</div>
      <div class="prog-list editing">${programHtml(dsl, mission.functions, { editable: true, locked, target })}</div>
      <div class="editor-actions">
        <button type="button" class="btn btn-run" data-act="run">▶ 跑我的程式</button>
        <button type="button" class="btn btn-soft" data-act="reset">🧹 回到起始程式</button>
      </div>`;
  }

  function change() {
    render();
    onChange?.(dsl);
  }

  root.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-act]");
    if (!button) return;
    const { act } = button.dataset;
    if (act === "target") {
      target = button.dataset.list;
      render();
    } else if (act === "add") {
      listAt(dsl, target).push(palette[Number(button.dataset.index)].make());
      change();
    } else if (act === "run") {
      onRun?.(structuredClone(dsl), "我拼的程式");
    } else if (act === "reset") {
      dsl = fresh();
      target = firstOpen();
      change();
    } else {
      applyTool(dsl, act, button.dataset.id);
      // Deleting a block moves the blocks after it, so a place inside a block falls back to its outer list.
      if (act === "del" && target.includes("/")) target = target.split("/")[0];
      change();
    }
  });

  render();
  return { get: () => structuredClone(dsl) };
}
