// Class progress codes: a student's stars, failed runs and Story Lab challenges packed into a short code
// (shown as a QR code that opens teacher.html#p=…). Nothing is sent to a server.
// Payload: { v, c: catalogue id, n: name, d: date, q: stars per mission, t: failed runs per mission, s: story done }.
import { ALL_MISSIONS, UNITS, missionNumber } from "../quest/missions/index.js";
import { ALL_STORY_TASKS } from "../story/challenges.js";
import { PRODUCT_TASKS } from "../story/product.js";
import { GAME_TASKS } from "../story/game.js";
import { pack, unpack } from "../shared/pack.js";
import { cleanName } from "../shared/student.js";

export const PROGRESS_PREFIX = "#p=";
export const STORY_TRACKS = { story: ALL_STORY_TASKS, product: PRODUCT_TASKS, game: GAME_TASKS };
const STORY_IDS = Object.values(STORY_TRACKS).flat().map((task) => task.id);
const MAX_TRIES = 35; // one base-36 digit per mission

// Codes list missions by position, so both sides must have the same mission list. The id changes when it does.
function hash(text) {
  let h = 0x811c9dc5;
  for (const ch of text) h = Math.imul(h ^ ch.codePointAt(0), 0x01000193) >>> 0;
  return h.toString(36);
}
export const CATALOG = hash([...ALL_MISSIONS.map((m) => m.id), "|", ...STORY_IDS].join(","));

export function buildProgress({ name, stars = {}, tries = {}, done = {}, date = new Date() }) {
  return {
    v: 1,
    c: CATALOG,
    n: cleanName(name),
    d: date.toISOString().slice(0, 10),
    q: ALL_MISSIONS.map((m) => Math.min(3, stars[m.id] ?? 0)).join(""),
    t: ALL_MISSIONS.map((m) => Math.min(MAX_TRIES, tries[m.id] ?? 0).toString(36)).join(""),
    s: STORY_IDS.map((id) => (done[id] ? 1 : 0)).join(""),
  };
}

export const encodeProgress = (payload) => pack(payload);

// A code, a full teacher.html#p=… link, or junk. Returns { record } or { error: "broken" | "otherVersion" }.
export async function decodeProgress(input) {
  const text = String(input ?? "").trim();
  const code = text.includes(PROGRESS_PREFIX) ? text.slice(text.indexOf(PROGRESS_PREFIX) + PROGRESS_PREFIX.length) : text;
  try {
    const data = await unpack(code);
    if (data?.v !== 1 || typeof data.q !== "string" || typeof data.t !== "string" || typeof data.s !== "string") return { error: "broken" };
    if (data.c !== CATALOG) return { error: "otherVersion", name: cleanName(data.n) };
    if (data.q.length !== ALL_MISSIONS.length || data.t.length !== ALL_MISSIONS.length || data.s.length !== STORY_IDS.length) return { error: "broken" };
    return { record: { name: cleanName(data.n) || "?", date: String(data.d ?? "").slice(0, 10), q: data.q, t: data.t, s: data.s } };
  } catch {
    return { error: "broken" };
  }
}

// One student's record → per Quest unit: stars, max, and the mission they are stuck on
// (not passed yet, most failed runs); per Story track: challenges done.
export function summarize(record) {
  let offset = 0;
  const units = UNITS.map((unit) => {
    const rows = unit.missions.map((mission, index) => ({
      label: missionNumber(unit, index) ?? "🔮",
      stars: Number(record.q[offset + index]),
      tries: parseInt(record.t[offset + index], 36),
    }));
    offset += unit.missions.length;
    const stuck = rows.filter((row) => !row.stars && row.tries).sort((a, b) => b.tries - a.tries)[0] ?? null;
    return { id: unit.id, stars: rows.reduce((sum, row) => sum + row.stars, 0), max: rows.length * 3, stuck };
  });
  let at = 0;
  const story = Object.entries(STORY_TRACKS).map(([id, tasks]) => {
    const done = [...record.s.slice(at, at + tasks.length)].filter((bit) => bit === "1").length;
    at += tasks.length;
    return { id, done, total: tasks.length };
  });
  return { units, story };
}

const csvCell = (value) => (/[",\n]/.test(String(value)) ? `"${String(value).replace(/"/g, '""')}"` : String(value));

// One row per student: name, date, then stars and stuck mission for each unit, then Story tracks.
export function toCsv(records, unitName = (unit) => unit.id) {
  const header = ["name", "date", ...UNITS.flatMap((unit) => [`${unitName(unit)} ⭐`, `${unitName(unit)} stuck`]),
    ...Object.keys(STORY_TRACKS).map((id) => `story ${id}`)];
  const rows = records.map((record) => {
    const { units, story } = summarize(record);
    return [record.name, record.date, ...units.flatMap((u) => [`${u.stars}/${u.max}`, u.stuck ? `${u.stuck.label} (${u.stuck.tries}×)` : ""]),
      ...story.map((s) => `${s.done}/${s.total}`)];
  });
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}
