// Browser tests for the Blockly screens (not part of `npm run check`; run with `npm run test:browser`).
// Starts the local server, opens Chrome through Playwright and checks every Quest Lab mission, every Story Lab
// task, sharing, and that the widest program fits the code area on iPad landscape and portrait.
// Uses the installed Chrome (BROWSER_CHANNEL=chrome by default; set BROWSER_CHANNEL=msedge or "" for Playwright's).
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";
import { checkLayout, runQuestMissions } from "./browser/quest.mjs";
import { checkShare, runStoryTasks } from "./browser/story.mjs";

const PORT = Number(process.env.TEST_PORT || 4199);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = "runs/browser";
const WORKERS = Number(process.env.WORKERS || 4);
const VIEWPORTS = { landscape: { width: 1024, height: 768 }, portrait: { width: 768, height: 1024 } };

// Animations wait with setTimeout; run them 20× faster so 112 missions finish in a few minutes.
const FAST_TIMERS = () => {
  const original = window.setTimeout;
  window.setTimeout = (fn, ms = 0, ...args) => original(fn, ms >= 100 ? ms / 20 : ms, ...args);
  try { if (!localStorage.getItem("blocky-quest-lang")) localStorage.setItem("blocky-quest-lang", "zh"); } catch { /* ignore */ }
};

async function startServer() {
  const server = spawn(process.execPath, ["server.mjs"], { env: { ...process.env, PORT: String(PORT) }, stdio: "ignore" });
  for (let i = 0; i < 50; i += 1) {
    try {
      if ((await fetch(`${BASE}/quest.html`)).ok) return server;
    } catch { /* not up yet */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  server.kill();
  throw new Error(`Server did not start on port ${PORT}`);
}

// A context per viewport; every page in it reports script errors into `errors`.
async function makeContext(browser, viewport, errors) {
  const context = await browser.newContext({ viewport, hasTouch: true, deviceScaleFactor: 1 });
  await context.addInitScript(FAST_TIMERS);
  context.on("page", (page) => {
    page.on("pageerror", (error) => errors.push(`${page.url()}: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error" && !/favicon|Failed to load resource/.test(message.text())) errors.push(`${page.url()}: ${message.text()}`);
    });
    page.on("dialog", (dialog) => dialog.accept());
  });
  return context;
}

const started = Date.now();
const errors = [];
await mkdir(OUT, { recursive: true });
const server = await startServer();
const channel = process.env.BROWSER_CHANNEL ?? "chrome";
const browser = await chromium.launch({ headless: process.env.HEADED !== "1", ...(channel ? { channel } : {}) });
const report = [];
try {
  const landscape = await makeContext(browser, VIEWPORTS.landscape, errors);
  const quest = await runQuestMissions({ context: landscape, base: BASE, workers: WORKERS, errors });
  report.push(`Quest Lab: ${quest.passed} / ${quest.total} missions complete with 💡 Answer → ▶ Run`);
  const story = await runStoryTasks({ context: landscape, base: BASE, errors });
  report.push(`Story Lab: ${story.passed} / ${story.total} examples load, meet every goal and play`);
  await checkShare({ browser, makeContext: () => makeContext(browser, VIEWPORTS.landscape, errors), base: BASE, errors });
  report.push("Sharing: share link opens as a remix on a fresh iPad");
  for (const [name, viewport] of Object.entries(VIEWPORTS)) {
    const context = name === "landscape" ? landscape : await makeContext(browser, viewport, errors);
    const layout = await checkLayout({ context, base: BASE, name, out: OUT, workers: WORKERS, errors });
    report.push(`Layout ${name} ${viewport.width}×${viewport.height}: widest program ${layout.widest}px in a ${layout.area}px code area (${layout.mission}); screenshot ${layout.shot}`);
  }
} finally {
  await browser.close();
  server.kill();
}

console.log(report.map((line) => `• ${line}`).join("\n"));
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n${errors.map((line) => `✗ ${line}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Browser tests passed in ${Math.round((Date.now() - started) / 1000)}s.`);
}
