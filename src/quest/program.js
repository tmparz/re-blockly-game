// Program model shared by the browser and the Node validator.
// Missions write programs in a compact DSL; Blockly JSON is converted to the same node tree.

const LEAVES = new Set(["move", "left", "right", "pick", "say"]);

export const BLOCK_TYPE = {
  move: "q_move",
  left: "q_left",
  right: "q_right",
  pick: "q_pick",
  say: "q_say",
  repeat: "q_repeat",
  until: "q_until",
  untilCount: "q_until_count",
  if: "q_if",
  ifElse: "q_ifelse",
  def: "q_def",
  call: "q_call",
  set: "q_set",
  change: "q_change",
};
const OP_OF_TYPE = Object.fromEntries(Object.entries(BLOCK_TYPE).map(([op, type]) => [type, op]));

function parseNode(item) {
  if (typeof item === "string") {
    if (!LEAVES.has(item)) throw new Error(`Unknown step "${item}".`);
    return { op: item };
  }
  if ("repeat" in item) return { op: "repeat", n: item.repeat, do: parseList(item.do) };
  if ("until" in item) return { op: "until", do: parseList(item.do) };
  if ("untilCount" in item) return { op: "untilCount", n: item.untilCount, do: parseList(item.do) };
  if ("if" in item) {
    const node = { op: "else" in item ? "ifElse" : "if", cond: item.if, do: parseList(item.do) };
    if ("else" in item) node.else = parseList(item.else);
    return node;
  }
  if ("call" in item) return { op: "call", name: item.call };
  if ("set" in item) return { op: "set", n: item.set };
  if ("change" in item) return { op: "change", n: item.change };
  throw new Error(`Unknown step ${JSON.stringify(item)}.`);
}

function parseList(list = []) {
  return list.map(parseNode);
}

export function parseProgram(dsl = {}) {
  const defs = {};
  for (const [name, body] of Object.entries(dsl.defs ?? {})) defs[name] = parseList(body);
  return { main: parseList(dsl.main), defs, extraStarts: 0 };
}

// ---- Blockly serialization -> node tree ----

function chainFrom(block) {
  const nodes = [];
  while (block) {
    if (block.enabled !== false) nodes.push(nodeFrom(block));
    block = block.next?.block;
  }
  return nodes;
}

function nodeFrom(block) {
  const op = OP_OF_TYPE[block.type] ?? "unknown";
  const fields = block.fields ?? {};
  const inner = (name) => chainFrom(block.inputs?.[name]?.block);
  const node = { op, id: block.id };
  if (op === "repeat" || op === "untilCount" || op === "set" || op === "change") {
    node.n = Number(fields.TIMES ?? fields.N);
  }
  if (op === "if" || op === "ifElse") node.cond = fields.COND;
  if (op === "call") node.name = fields.NAME;
  if (["repeat", "until", "untilCount", "if", "ifElse"].includes(op)) node.do = inner("DO");
  if (op === "ifElse") node.else = inner("ELSE");
  return node;
}

export function programFromState(state) {
  const program = { main: null, defs: {}, extraStarts: 0 };
  for (const top of state?.blocks?.blocks ?? []) {
    if (top.type === "q_start") {
      if (program.main) program.extraStarts += 1;
      else program.main = chainFrom(top.next?.block);
    } else if (top.type === "q_def") {
      const name = top.fields?.NAME;
      if (!(name in program.defs)) program.defs[name] = chainFrom(top.inputs?.DO?.block);
    }
  }
  return program;
}

// ---- node tree -> Blockly serialization (starter code and demo solutions) ----

function blockFrom(node) {
  const block = { type: BLOCK_TYPE[node.op] };
  if (node.op === "repeat") block.fields = { TIMES: String(node.n) };
  if (["untilCount", "set", "change"].includes(node.op)) block.fields = { N: String(node.n) };
  if (node.op === "if" || node.op === "ifElse") block.fields = { COND: node.cond };
  if (node.op === "call") block.fields = { NAME: node.name };
  const inputs = {};
  const body = chainBlocks(node.do ?? []);
  if (body) inputs.DO = { block: body };
  const other = chainBlocks(node.else ?? []);
  if (other) inputs.ELSE = { block: other };
  if (Object.keys(inputs).length) block.inputs = inputs;
  return block;
}

function chainBlocks(nodes) {
  let head = null;
  for (let index = nodes.length - 1; index >= 0; index -= 1) {
    const block = blockFrom(nodes[index]);
    if (head) block.next = { block: head };
    head = block;
  }
  return head;
}

export function stateFromDsl(dsl = {}) {
  const program = parseProgram(dsl);
  const start = { type: "q_start", x: 24, y: 24, deletable: false };
  const main = chainBlocks(program.main);
  if (main) start.next = { block: main };
  const blocks = [start];
  let y = 90 + countList(program.main) * 44;
  for (const [name, body] of Object.entries(program.defs)) {
    const def = { type: "q_def", x: 24, y, fields: { NAME: name } };
    const inner = chainBlocks(body);
    if (inner) def.inputs = { DO: { block: inner } };
    blocks.push(def);
    y += 90 + countList(body) * 44;
  }
  return { blocks: { languageVersion: 0, blocks } };
}

// ---- measuring programs ----

function countList(nodes) {
  return nodes.reduce((sum, node) => sum + 1 + countList(node.do ?? []) + countList(node.else ?? []), 0);
}

export function countBlocks(program) {
  const defs = Object.values(program.defs);
  return countList(program.main ?? []) + defs.length + defs.reduce((sum, body) => sum + countList(body), 0);
}

export function usage(program) {
  const counts = { def: Object.keys(program.defs).length };
  const visit = (nodes) => nodes.forEach((node) => {
    counts[node.op] = (counts[node.op] ?? 0) + 1;
    visit(node.do ?? []);
    visit(node.else ?? []);
  });
  visit(program.main ?? []);
  Object.values(program.defs).forEach(visit);
  return counts;
}
