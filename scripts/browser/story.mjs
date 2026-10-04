// Story Lab browser checks: every example loads with the right block count, meets its goals and plays;
// a share link opens as a remix on a fresh browser.
import { ALL_STORY_TASKS } from "../../src/story/challenges.js";
import { PRODUCT_TASKS } from "../../src/story/product.js";
import { GAME_TASKS } from "../../src/story/game.js";

const TASKS = [...ALL_STORY_TASKS, ...PRODUCT_TASKS, ...GAME_TASKS];
const countBlocks = (value) => (Array.isArray(value) ? value.reduce((sum, item) => sum + countBlocks(item), 0)
  : value && typeof value === "object" ? (typeof value.type === "string" ? 1 : 0) + Object.values(value).reduce((sum, item) => sum + countBlocks(item), 0) : 0);
const numberIn = (text) => Number(text.match(/\d+/)?.[0]);

export async function runStoryTasks({ context, base, errors }) {
  const page = await context.newPage();
  let passed = 0;
  for (const task of TASKS) {
    const url = `${base}/story.html?c=${task.id}`;
    const fail = (message) => errors.push(`${task.id} (${url}): ${message}`);
    try {
      await page.goto(url);
      await page.click("#exampleButton"); // the confirm() is accepted by the context
      const shown = numberIn(await page.textContent("#blockCount"));
      const want = countBlocks(task.example);
      if (shown !== want) { fail(`example shows ${shown} blocks, expected ${want}`); continue; }
      const goals = await page.$$eval("#goalList li", (items) => items.map((li) => li.dataset.done));
      if (!goals.length || goals.some((done) => done !== "true")) { fail(`example goals ${goals.join(",")}`); continue; }
      await page.click("#runButton");
      await page.waitForTimeout(1500); // about 30 s of story time with fast timers; forever loops keep going
      const tone = await page.getAttribute("#status", "data-tone");
      if (tone === "fail") { fail(`playing failed: ${await page.textContent("#status")}`); continue; }
      await page.click("#stopButton");
      passed += 1;
    } catch (error) {
      fail(error.message.split("\n")[0]);
    }
  }
  await page.close();
  return { passed, total: TASKS.length };
}

export async function checkShare({ makeContext, base, errors }) {
  const fail = (message) => errors.push(`share: ${message}`);
  const sender = await makeContext();
  const page = await sender.newPage();
  await page.goto(`${base}/story.html?c=my-game`);
  await page.click("#exampleButton");
  await page.click("#shareButton");
  await page.fill("#shareName", "Tester");
  await page.click("#shareMake");
  await page.waitForFunction(() => document.querySelector("#shareLink").value.includes("#share="));
  const link = (await page.inputValue("#shareLink")).replace(/^https?:\/\/[^/]+/, base);
  await sender.close();

  const receiver = await makeContext(); // a fresh context = another iPad with empty storage
  const other = await receiver.newPage();
  await other.goto(link);
  await other.waitForFunction(() => !document.querySelector("#remixCredit").hidden, null, { timeout: 5000 }).catch(() => {});
  const credit = await other.textContent("#remixCredit");
  if (!credit.includes("Tester")) fail(`remix credit is "${credit}"`);
  const goals = await other.$$eval("#goalList li", (items) => items.map((li) => li.dataset.done));
  if (goals.at(-1) !== "false" || goals.slice(0, -1).some((done) => done !== "true")) fail(`remix goals ${goals.join(",")}`);
  if ((await other.url()).includes("#share=")) fail("share code should be removed from the address bar");
  await receiver.close();
}
