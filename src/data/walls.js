const keyOf = (point) => `${point.x},${point.y}`;

export function wallsOutsidePath(cols, rows, path) {
  const open = new Set(path.map(keyOf));
  const walls = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!open.has(`${x},${y}`)) {
        walls.push({ x, y });
      }
    }
  }
  return walls;
}
