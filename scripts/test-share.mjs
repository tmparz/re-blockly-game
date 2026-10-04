// Validates Story Lab share codes: encode → decode gives back the same project, credit chains stay short,
// real-sized projects fit in one QR code, broken links are rejected, and remixes must credit the author.
import { ALL_STORY_TASKS, MY_STORY, checkGoals, goalsFor } from "../src/story/challenges.js";
import { MY_PRODUCT, PRODUCT_TASKS } from "../src/story/product.js";
import { GAME_TASKS, MY_GAME } from "../src/story/game.js";
import { MAX_AUTHORS, QR_LIMIT, SHARE_PREFIX, creditChain, decodeShare, encodeShare, slim } from "../src/story/share.js";
import { say, script, start } from "../src/story/task-kit.js";

const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const PAGE = "https://tmparz.github.io/re-blockly-game/story.html";

// Blockly's own save() adds 20-character ids and fractional positions; imitate that for realistic sizes.
let counter = 0;
function likeBlockly(value) {
  if (Array.isArray(value)) return value.map(likeBlockly);
  if (!value || typeof value !== "object") return value;
  const out = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, likeBlockly(item)]));
  if (typeof out.type === "string") out.id = `a${String(counter++).padStart(4, "0")}!Qz#9mK$pL2vX8wR`.slice(0, 20);
  if (typeof out.x === "number") Object.assign(out, { x: out.x + 0.4371, y: out.y + 0.2913 });
  return out;
}

let largest = 0;
for (const task of [...ALL_STORY_TASKS, ...PRODUCT_TASKS, ...GAME_TASKS]) {
  const code = likeBlockly(task.example);
  const authors = ["小明", "Mia", "3 號"];
  const packed = await encodeShare({ task: task.id, authors, code });
  const back = await decodeShare(packed);
  check(back && back.task === task.id, `${task.id}: task id lost in round trip`);
  check(back && same(back.authors, authors), `${task.id}: authors lost in round trip`);
  check(back && same(back.code, slim(code)), `${task.id}: code changed in round trip`);
  check(back && same(checkGoals(task, back.code), checkGoals(task, task.example)), `${task.id}: goals differ after round trip`);
  check(!JSON.stringify(back?.code).includes('"id"'), `${task.id}: block ids should be stripped`);
  check(/^[A-Za-z0-9_-]+$/.test(packed), `${task.id}: share code is not URL-safe`);
  largest = Math.max(largest, `${PAGE}${SHARE_PREFIX}${packed}`.length);
}
check(largest <= QR_LIMIT, `largest example link is ${largest} characters, over the QR limit ${QR_LIMIT}`);

// A big student project: every Game Studio and Product Studio script at once.
const big = { blocks: { languageVersion: 0, blocks: [...MY_GAME.example.blocks.blocks, ...MY_PRODUCT.example.blocks.blocks, ...GAME_TASKS.at(-2).example.blocks.blocks] } };
const bigLink = `${PAGE}${SHARE_PREFIX}${await encodeShare({ task: "my-game", authors: ["小明"], code: likeBlockly(big) })}`;
check(bigLink.length <= QR_LIMIT, `a ${big.blocks.blocks.length}-script project makes a ${bigLink.length}-character link, over ${QR_LIMIT}`);

// Credit chain: newest first, at most 3 generations, re-sharing your own remix adds nothing.
check(same(creditChain("小明"), ["小明"]), "first share should credit only the author");
check(same(creditChain(" Mia ", ["小明"]), ["Mia", "小明"]), "remix should put the new author first");
check(same(creditChain("D", ["C", "B", "A"]), ["D", "C", "B"]), `chain should keep ${MAX_AUTHORS} generations`);
check(same(creditChain("小明", ["小明", "A"]), ["小明", "A"]), "re-sharing your own remix should not repeat your name");
check(creditChain("a very long name that keeps going")[0].length <= 16, "names should be trimmed");

// Broken links never throw.
for (const bad of ["", "!!!", "abc", await encodeShare({ task: 5, authors: [], code: {} })]) {
  check((await decodeShare(bad)) === null, `"${String(bad).slice(0, 12)}" should be rejected`);
}

// Remix credit goal: only shown for remixes, and met when a character says the original author's name.
for (const capstone of [MY_STORY, MY_PRODUCT, MY_GAME]) {
  const ctx = { remixOf: ["小明", "Mia"] };
  check(goalsFor(capstone).length === goalsFor(capstone, ctx).length - 1, `${capstone.id}: credit goal should appear only for remixes`);
  const plain = checkGoals(capstone, capstone.example, ctx);
  check(plain.at(-1) === false && plain.slice(0, -1).every(Boolean), `${capstone.id}: example without credit should miss only the credit goal`);
  const credited = { blocks: { blocks: [...capstone.example.blocks.blocks, script(start, say("cat", "改編自 小明 的作品"))] } };
  check(checkGoals(capstone, credited, ctx).every(Boolean), `${capstone.id}: saying the author's name should meet the credit goal`);
  const wrong = { blocks: { blocks: [...capstone.example.blocks.blocks, script(start, say("cat", "改編自 Mia"))] } };
  check(checkGoals(capstone, wrong, ctx).at(-1) === false, `${capstone.id}: credit must name the newest author`);
}

if (errors.length) {
  console.error(errors.map((line) => `✗ ${line}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Share codes passed: round trips for all ${ALL_STORY_TASKS.length + PRODUCT_TASKS.length + GAME_TASKS.length} Story Lab tasks, longest link ${largest} chars, big project ${bigLink.length} chars (QR limit ${QR_LIMIT}), credit chains and remix goal.`);
}
