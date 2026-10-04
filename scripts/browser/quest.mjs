// Quest Lab browser checks: every mission passes with its 💡 Answer, and answers fit the code area.
import { UNITS } from "../../src/quest/missions/index.js";

const MISSIONS = UNITS.flatMap((unit) => unit.missions.map((mission, index) => ({ unit: unit.id, m: index + 1, id: mission.id })));
const urlOf = (base, item) => `${base}/quest.html?unit=${item.unit}&m=${item.m}`;

// Runs `task` over `items` with a few pages at once.
export async function pool(context, items, workers, task) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(workers, items.length) }, async () => {
    const page = await context.newPage();
    while (next < items.length) await task(page, items[next++]);
    await page.close();
  }));
}

async function loadAnswer(page, base, item) {
  await page.goto(urlOf(base, item));
  await page.click("#answerButton");
  await page.click('.confirm-overlay [data-ok="1"]');
}

export async function runQuestMissions({ context, base, workers, errors }) {
  let passed = 0;
  await pool(context, MISSIONS, workers, async (page, item) => {
    try {
      await loadAnswer(page, base, item);
      await page.click("#runButton");
      await page.waitForFunction(() => ["success", "fail"].includes(document.querySelector("#result").dataset.tone), null, { timeout: 30000 });
      const { tone, text } = await page.$eval("#result", (el) => ({ tone: el.dataset.tone, text: el.textContent }));
      if (tone === "success") passed += 1;
      else errors.push(`${item.id} (${urlOf(base, item)}): answer did not pass — ${text}`);
    } catch (error) {
      errors.push(`${item.id} (${urlOf(base, item)}): ${error.message.split("\n")[0]}`);
    }
  });
  return { passed, total: MISSIONS.length };
}

// The whole answer program, at the workspace's zoom, must fit across the code area without scrolling sideways.
const MEASURE = () => {
  const ws = Blockly.getMainWorkspace();
  const area = document.querySelector("#blocklyDiv").clientWidth;
  const left = Math.min(...ws.getTopBlocks(false).map((b) => b.getRelativeToSurfaceXY().x));
  const right = Math.max(...ws.getTopBlocks(false).map((b) => b.getRelativeToSurfaceXY().x + b.getHeightWidth().width));
  return { area, widest: Math.round(right * ws.scale), start: Math.round(left * ws.scale) };
};

export async function checkLayout({ context, base, name, out, workers, errors }) {
  const sizes = [];
  await pool(context, MISSIONS, workers, async (page, item) => {
    try {
      await loadAnswer(page, base, item);
      const size = await page.evaluate(MEASURE);
      sizes.push({ ...size, item });
      if (size.widest > size.area) errors.push(`${name}: ${item.id} answer is ${size.widest}px wide, code area is ${size.area}px (${urlOf(base, item)})`);
    } catch (error) {
      errors.push(`${name}: ${item.id}: ${error.message.split("\n")[0]}`);
    }
  });
  const worst = sizes.sort((a, b) => b.widest - a.widest)[0];
  const page = await context.newPage();
  await loadAnswer(page, base, worst.item);
  const shot = `${out}/quest-${name}-${worst.item.id}.png`;
  await page.screenshot({ path: shot });
  await page.close();
  return { widest: worst.widest, area: worst.area, mission: worst.item.id, shot };
}
