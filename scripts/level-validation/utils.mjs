export function keyOf(point) {
  return `${point.x},${point.y}`;
}

export function countBlocks(sequence = []) {
  return sequence.reduce(
    (total, item) => total + 1 + countBlocks(item.children || []) + countBlocks(item.elseChildren || []),
    0,
  );
}

export function collectTypes(sequence = [], types = []) {
  for (const item of sequence) {
    types.push(item.type);
    collectTypes(item.children || [], types);
    collectTypes(item.elseChildren || [], types);
  }
  return types;
}

export function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}
