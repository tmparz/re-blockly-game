// Validates class progress codes: round trips, worst-case length fits a QR code, links and junk are handled,
// a changed mission list is detected, the stuck mission is found, and CSV cells are escaped.
import { ALL_MISSIONS, UNITS } from "../src/quest/missions/index.js";
import { CATALOG, PROGRESS_PREFIX, STORY_TRACKS, buildProgress, decodeProgress, encodeProgress, summarize, toCsv } from "../src/progress/code.js";
import { pack } from "../src/shared/pack.js";
import { QR_LIMIT } from "../src/shared/qr.js";

const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };
const PAGE = "https://tmparz.github.io/re-blockly-game/teacher.html";
const storyIds = Object.values(STORY_TRACKS).flat().map((task) => task.id);

// A real-looking student: some stars, some failed runs, some Story challenges.
const logic = UNITS.find((unit) => unit.id === "logic");
const stars = Object.fromEntries(ALL_MISSIONS.slice(0, 30).map((m, i) => [m.id, (i % 3) + 1]));
const tries = { [logic.missions[4].id]: 7, [logic.missions[6].id]: 2, [ALL_MISSIONS[0].id]: 4 };
const done = { [storyIds[0]]: true, [storyIds[3]]: true };
const payload = buildProgress({ name: " 7 號 ", stars, tries, done, date: new Date("2026-10-05T08:00:00Z") });
const code = await encodeProgress(payload);
const back = await decodeProgress(code);
check(back.record?.name === "7 號", "name should be trimmed and kept");
check(back.record?.date === "2026-10-05", "date should be kept");
check(back.record?.q === payload.q && back.record?.t === payload.t && back.record?.s === payload.s, "code should round-trip");
check((await decodeProgress(`${PAGE}${PROGRESS_PREFIX}${code}`)).record?.name === "7 號", "a full teacher link should decode too");
check(/^[A-Za-z0-9_-]+$/.test(code), "code should be URL-safe");

// Summary: stars per unit, stuck = not passed and most failed runs; passed missions are never "stuck".
const summary = summarize(back.record);
const logicSummary = summary.units.find((u) => u.id === "logic");
check(logicSummary.stuck?.tries === 7 && logicSummary.stuck?.label === 4, `logic should be stuck on mission 4 with 7 tries, got ${JSON.stringify(logicSummary.stuck)}`);
check(summary.units[0].stuck === null, "a passed mission with failed runs is not stuck");
check(summary.units.reduce((sum, u) => sum + u.stars, 0) === Object.values(stars).reduce((a, b) => a + b, 0), "stars should add up");
check(summary.story[0].done === 2 && summary.story[1].done === 0, "story challenges should add up per track");
check(summary.units.reduce((sum, u) => sum + u.max, 0) === ALL_MISSIONS.length * 3, "max stars should cover every mission");

// Worst case: every mission 3 stars and 35+ failed runs, every challenge done, longest name.
const all = (value) => Object.fromEntries(ALL_MISSIONS.map((m) => [m.id, value]));
const worst = await encodeProgress(buildProgress({ name: "x".repeat(40), stars: all(3), tries: all(99), done: Object.fromEntries(storyIds.map((id) => [id, true])) }));
const noisy = await encodeProgress(buildProgress({ name: "張小明", stars: Object.fromEntries(ALL_MISSIONS.map((m, i) => [m.id, (i * 7) % 4])),
  tries: Object.fromEntries(ALL_MISSIONS.map((m, i) => [m.id, (i * 13) % 36])) }));
const longest = Math.max(worst.length, noisy.length) + PAGE.length + PROGRESS_PREFIX.length;
check(longest <= 400, `progress link is ${longest} characters; keep it short so the QR code is easy to scan`);
check(longest <= QR_LIMIT, "progress link must fit one QR code");

// Junk, other versions and wrong lengths are rejected without throwing.
for (const bad of ["", "hello", "!!!", PAGE]) check((await decodeProgress(bad)).error === "broken", `"${bad}" should be broken`);
check((await decodeProgress(await pack({ ...payload, c: "old" }))).error === "otherVersion", "another mission list should be detected");
check((await decodeProgress(await pack({ ...payload, q: "33" }))).error === "broken", "wrong length should be broken");
check(typeof CATALOG === "string" && CATALOG.length >= 4, "catalogue id should exist");

// CSV: one header plus one row per student; commas and quotes in names are escaped.
const csv = toCsv([back.record, { ...back.record, name: 'Mia, "the best"' }]).split("\n");
check(csv.length === 3, "CSV should have a header and two rows");
check(csv[2].startsWith('"Mia, ""the best"""'), `CSV should escape names: ${csv[2].slice(0, 30)}`);
check(csv[0].split(",").length === csv[1].split(",").length, "CSV rows should match the header");

if (errors.length) {
  console.error(errors.map((line) => `✗ ${line}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Progress codes passed: round trip, longest link ${longest} chars, stuck mission found, other versions detected, CSV escaped.`);
}
