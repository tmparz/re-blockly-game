// Pastel block palette shared with the ARZ AI Kids landing page demo
// (blue = forward, green = turn left, coral = turn right, yellow = reward).
// Used by Blockly block definitions, toolbox categories and the tap-to-add buttons (via CSS).
export const BLOCK_COLOURS = {
  start: "#D9CFF2",
  move_forward: "#A8D3E6",
  turn_left: "#B9DAA5",
  turn_right: "#F2A497",
  collect_gem: "#F6D27A",
  repeat_times: "#F9C88F",
  while_loop: "#9ED9C8",
  if_condition: "#F4B6C8",
  if_else_condition: "#F4B6C8",
};

export const CATEGORY_COLOURS = {
  action: BLOCK_COLOURS.move_forward,
  loop: BLOCK_COLOURS.repeat_times,
  condition: BLOCK_COLOURS.if_condition,
};

export const INK = "#3E3A39";
