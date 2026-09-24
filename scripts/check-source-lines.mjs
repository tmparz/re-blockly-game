import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(".");
const maxLines = 300;
const extensions = new Set([".css", ".html", ".js", ".mjs"]);
const roots = [
  "app.js",
  "index.html",
  "styles.css",
  "story.html",
  "story.js",
  "server.mjs",
  "src",
  "styles",
  "scripts",
];

async function sourceFiles(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(path, entry.name);
      if (entry.isDirectory()) return sourceFiles(entryPath);
      return extensions.has(extname(entry.name)) ? [entryPath] : [];
    }),
  );
  return nested.flat();
}

const files = [];
for (const target of roots) {
  const path = resolve(root, target);
  if (extensions.has(extname(target))) files.push(path);
  else files.push(...(await sourceFiles(path)));
}

const oversized = [];
for (const file of files) {
  const lines = (await readFile(file, "utf8")).split(/\r?\n/).length;
  if (lines > maxLines) oversized.push({ file: relative(root, file), lines });
}

if (oversized.length) {
  console.error(`Source line limit exceeded (${maxLines}):`);
  oversized.forEach(({ file, lines }) => console.error(`- ${file}: ${lines} lines`));
  process.exitCode = 1;
} else {
  console.log(`Validated ${files.length} source files: each is ${maxLines} lines or fewer.`);
}
