import { copyFile, cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(".");
const dist = resolve(root, "dist");
const files = [
  "index.html",
  "styles.css",
  "app.js",
  "bird.html",
  "blockly-games.html",
  "teacher-guide.html",
  "story.html",
  "story.js",
  "quest.html",
  "course.html",
];
const directories = ["src", "styles", "bird-game", "blockly-games"];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await Promise.all([
  ...files.map((file) => copyFile(resolve(root, file), resolve(dist, file))),
  ...directories.map((directory) =>
    cp(resolve(root, directory), resolve(dist, directory), { recursive: true }),
  ),
]);

await writeFile(
  resolve(dist, "_headers"),
  [
    "/*",
    "  X-Content-Type-Options: nosniff",
    "  Referrer-Policy: strict-origin-when-cross-origin",
    "  Permissions-Policy: camera=(), microphone=(), geolocation=()",
    "",
  ].join("\n"),
);

console.log(`Built ${files.length} files and ${directories.length} directories into ${dist}`);
