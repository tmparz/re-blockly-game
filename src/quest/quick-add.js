// Tap-to-add bar for iPads: tap a chip and the block snaps into place, no precise dragging needed.
// The "target" says where the next block goes: the end of the main program, inside a container,
// inside an else branch, or right after a chosen block. Tapping a block on the canvas moves the target.

const lastInChain = (block) => {
  while (block.getNextBlock()) block = block.getNextBlock();
  return block;
};
const endOfInput = (input) => {
  const first = input?.connection?.targetBlock();
  return first ? lastInChain(first).nextConnection : input?.connection ?? null;
};
const select = (block) => (Blockly.common?.setSelected ? Blockly.common.setSelected(block) : block.select());
const hasBody = (block) => Boolean(block.getInput("DO"));
const shortLabel = (block) => {
  const text = block.toString().replace(/\s\?/g, "").replace(/\s+/g, " ").trim();
  return text.length > 26 ? `${text.slice(0, 25)}…` : text;
};

export function createQuickAdd({ workspace, root, rootType, text }) {
  let target = null;
  let items = [];

  root.innerHTML = `
    <div class="qa-chips" role="toolbar"></div>
    <div class="qa-target">
      <span class="qa-label" aria-live="polite"></span>
      <button type="button" class="qa-btn" data-act="else" hidden>${text.intoElse}</button>
      <button type="button" class="qa-btn" data-act="out" hidden>⤴ ${text.out}</button>
      <button type="button" class="qa-btn" data-act="main" hidden>🏠 ${text.main}</button>
      <button type="button" class="qa-btn qa-delete" data-act="delete" hidden>🗑 ${text.remove}</button>
    </div>`;
  const chips = root.querySelector(".qa-chips");
  const label = root.querySelector(".qa-label");
  const button = (act) => root.querySelector(`[data-act="${act}"]`);

  const rootBlock = () => workspace.getTopBlocks(true).find((block) => block.type === rootType);
  const targetBlock = () => (target ? workspace.getBlockById(target.id) : null);

  function connectionForTarget() {
    const block = targetBlock();
    if (!block) {
      target = null;
      const start = rootBlock();
      return start ? lastInChain(start).nextConnection : null;
    }
    if (target.mode === "inside") return endOfInput(block.getInput("DO"));
    if (target.mode === "else") return endOfInput(block.getInput("ELSE"));
    return block.nextConnection;
  }

  function render() {
    const block = targetBlock();
    if (!block) label.textContent = `➕ ${text.toMain}`;
    else if (target.mode === "after") label.textContent = `➕ ${text.after} “${shortLabel(block)}”`;
    else if (target.mode === "else") label.textContent = `➕ ${text.insideElse} “${shortLabel(block)}”`;
    else label.textContent = `➕ ${text.inside} “${shortLabel(block)}”`;
    button("else").hidden = !(block?.getInput("ELSE") && target.mode === "inside");
    button("out").hidden = !block || (target.mode === "after" && !block.getSurroundParent());
    button("main").hidden = !block;
    button("delete").hidden = !block || !block.isDeletable();
  }

  function aim(block) {
    if (!block || block.type === rootType) target = null;
    else target = { id: block.id, mode: hasBody(block) ? "inside" : "after" };
    render();
  }

  function add(item) {
    const existing = item.unique && workspace.getTopBlocks(false).find((b) => b.type === item.type &&
      Object.entries(item.fields ?? {}).every(([name, value]) => b.getFieldValue(name) === value));
    if (existing) {
      select(existing);
      aim(existing);
      return;
    }
    const block = workspace.newBlock(item.type);
    Object.entries(item.fields ?? {}).forEach(([name, value]) => block.setFieldValue(value, name));
    block.initSvg();
    block.render();
    if (!block.previousConnection) {
      const bottom = workspace.getTopBlocks(false).filter((b) => b !== block)
        .reduce((max, b) => Math.max(max, b.getBoundingRectangle().bottom), 0);
      block.moveBy(24, bottom + 36);
    } else {
      const connection = connectionForTarget();
      if (connection) {
        const displaced = connection.targetBlock();
        connection.connect(block.previousConnection);
        if (displaced && block.nextConnection) block.nextConnection.connect(displaced.previousConnection);
      } else {
        block.moveBy(24, 24);
      }
    }
    select(block);
    aim(block);
    workspace.scrollBoundsIntoView?.(block.getBoundingRectangle());
  }

  root.addEventListener("click", (event) => {
    const act = event.target.closest("[data-act]")?.dataset.act;
    const block = targetBlock();
    if (act === "else" && block) target = { id: block.id, mode: "else" };
    if (act === "out" && block) {
      const parent = block.getSurroundParent();
      target = target.mode === "after" && parent ? { id: parent.id, mode: "after" } : { id: block.id, mode: "after" };
    }
    if (act === "main") target = null;
    if (act === "delete" && block?.isDeletable()) {
      const before = block.getPreviousBlock() ?? block.getSurroundParent();
      block.dispose(true, true);
      aim(before);
      return;
    }
    const chip = event.target.closest("[data-item]");
    if (chip) add(items[Number(chip.dataset.item)]);
    else render();
  });

  workspace.addChangeListener((event) => {
    if (event.type === Blockly.Events.SELECTED && event.newElementId) aim(workspace.getBlockById(event.newElementId));
    if (event.type === Blockly.Events.BLOCK_DELETE && target && !targetBlock()) {
      target = null;
      render();
    }
  });

  return {
    setItems(next) {
      items = next;
      target = null;
      chips.innerHTML = "";
      items.forEach((item, index) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "qa-chip";
        chip.dataset.item = index;
        chip.style.setProperty("--chip", item.colour);
        chip.textContent = item.label;
        chips.append(chip);
      });
      render();
    },
    reset() {
      target = null;
      render();
    },
  };
}
