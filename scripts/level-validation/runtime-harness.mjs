// Exercise the real command compiler and runner in Node. Only browser rendering,
// timers and storage are substituted; movement, conditions and wins are real.
const elements = new Map();
function element() {
  return {
    dataset: {}, style: { setProperty() {} }, classList: { toggle() {}, add() {} },
    childNodes: [], value: "0", textContent: "", innerHTML: "",
    append() {}, setAttribute() {},
  };
}
globalThis.document = {
  querySelector(selector) {
    if (!elements.has(selector)) elements.set(selector, element());
    return elements.get(selector);
  },
  querySelectorAll: () => [], createElement: element, createTextNode: () => ({}),
};
globalThis.window = { setTimeout: (fn) => { fn(); return 0; } };
const saved = new Map();
globalThis.localStorage = {
  getItem: (key) => saved.get(key) ?? null,
  setItem: (key, value) => saved.set(key, String(value)),
  clear: () => saved.clear(),
};

const { LEVELS } = await import("../../src/data/index.js");
const { runtime } = await import("../../src/app/runtime.js");
const { cloneStart } = await import("../../src/app/game-state.js");
const { blockSequenceFrom } = await import("../../src/app/commands.js");
const { runCommandList } = await import("../../src/app/runner.js");
const { evaluateWin } = await import("../../src/app/game-rules.js");

export async function runRealProgram(level, solution = level.solution) {
  const blocks = [];
  function fakeSequence(sequence) {
    const nodes = sequence.map((item) => {
      const node = {
        id: `test-${blocks.length}`, type: item.type,
        getFieldValue: (name) => name === "TIMES" ? item.times : item.condition,
      };
      blocks.push(node);
      const children = fakeSequence(item.children || []);
      const other = fakeSequence(item.elseChildren || []);
      node.getInputTargetBlock = (name) => name === "DO" ? children : other;
      return node;
    });
    nodes.forEach((node, index) => { node.getNextBlock = () => nodes[index + 1] || null; });
    return nodes[0] || null;
  }
  const first = fakeSequence(solution);
  runtime.currentLevelIndex = LEVELS.indexOf(level);
  if (runtime.currentLevelIndex < 0) throw new Error("Use a level from LEVELS");
  runtime.state = cloneStart(level);
  runtime.workspace = { highlightBlock() {}, getAllBlocks: () => blocks };
  try {
    const commands = blockSequenceFrom(first);
    const result = await runCommandList(commands, 0) || evaluateWin();
    return { ...result, state: runtime.state, commands };
  } catch (error) {
    return { ok: false, message: error.message, state: runtime.state };
  }
}
