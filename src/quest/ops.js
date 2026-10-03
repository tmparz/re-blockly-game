// Part 3 blocks, described as data so parsing, Blockly conversion and counting all share one table.
// In mission code they are written as { op: "ifCmp", var: "gems", cmp: "gt", value: 3, do: [...] }.
// `fields` maps each Blockly field name to the node property it fills.
export const EXT_OPS = {
  setVar: { type: "q_var_set", fields: { VAR: "var", VALUE: "value" } },
  changeVar: { type: "q_var_change", fields: { VAR: "var", VALUE: "value" } },
  sayVar: { type: "q_var_say", fields: { VAR: "var" } },
  ifCmp: { type: "q_if_cmp", fields: { VAR: "var", CMP: "cmp", VALUE: "value" }, body: true },
  ifElseCmp: { type: "q_ifelse_cmp", fields: { VAR: "var", CMP: "cmp", VALUE: "value" }, body: true, else: true },
  untilCmp: { type: "q_until_cmp", fields: { VAR: "var", CMP: "cmp", VALUE: "value" }, body: true },
  whileSense: { type: "q_while", fields: { COND: "cond" }, body: true },
  ifLogic: { type: "q_if_logic", fields: { A: "a", LOGIC: "logic", B: "b" }, body: true },
  ifElseLogic: { type: "q_ifelse_logic", fields: { A: "a", LOGIC: "logic", B: "b" }, body: true, else: true },
  ifNot: { type: "q_if_not", fields: { COND: "cond" }, body: true },
  forEach: { type: "q_for_each", fields: {}, body: true },
  addList: { type: "q_list_add", fields: { VALUE: "value" } },
  sayList: { type: "q_list_say", fields: {} },
  report: { type: "q_report", fields: { VALUE: "value" } },
  setCall: { type: "q_set_call", fields: { VAR: "var", NAME: "name", N: "n" } },
};

export const EXT_OP_OF_TYPE = Object.fromEntries(Object.entries(EXT_OPS).map(([op, spec]) => [spec.type, op]));

// Dropdown values are strings; whole numbers become numbers, names ("gems", "item", "input") stay text.
export const token = (value) => (typeof value === "string" && /^-?\d+$/.test(value) ? Number(value) : value);
