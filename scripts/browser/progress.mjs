// Class progress in the browser: a student fails once and then passes a mission, makes a progress code,
// and the teacher's iPad (a fresh context) opens the link and sees the student in the table and the CSV.
import { readFile } from "node:fs/promises";

export async function checkProgress({ makeContext, base, errors }) {
  const fail = (message) => errors.push(`progress: ${message}`);
  const student = await makeContext();
  const page = await student.newPage();
  await page.goto(`${base}/quest.html?unit=logic&m=2`);
  await page.waitForTimeout(300);
  await page.click("#runButton"); // the starter is empty, so this run fails and counts as a try
  await page.waitForFunction(() => document.querySelector("#result").dataset.tone === "fail");
  await page.click("#answerButton");
  await page.click('.confirm-overlay [data-ok="1"]');
  await page.click("#runButton");
  await page.waitForFunction(() => document.querySelector("#result").dataset.tone === "success", null, { timeout: 30000 });
  await page.click("#progressButton");
  await page.fill(".progress-dialog input[type=text]", "Tester 9");
  await page.click(".progress-dialog .btn-run");
  await page.waitForFunction(() => document.querySelector(".progress-dialog .share-row input[readonly]")?.value.includes("#p="));
  const link = (await page.inputValue(".progress-dialog .share-row input[readonly]")).replace(/^https?:\/\/[^/]+/, base);
  if (!link.includes("/teacher.html#p=")) fail(`link should open teacher.html, got ${link.slice(0, 60)}`);
  await student.close();

  const teacher = await makeContext();
  const desk = await teacher.newPage();
  await desk.goto(link);
  await desk.waitForFunction(() => document.querySelector("#classTable td.name")?.textContent === "Tester 9", null, { timeout: 5000 })
    .catch(() => fail("scanned student should appear in the table"));
  if ((await desk.url()).includes("#p=")) fail("progress code should be removed from the address bar");
  const row = await desk.$$eval("#classTable tbody tr td", (cells) => cells.map((c) => c.textContent));
  if (!row.some((text) => text.startsWith("⭐ 3/"))) fail(`logic unit should show 3 stars: ${row.join(" | ")}`);
  // Pasting the same code again replaces the row instead of adding a second one.
  await desk.fill("#pasteBox", link);
  await desk.click("#addButton");
  if ((await desk.$$("#classTable td.name")).length !== 1) fail("the same student should stay one row");
  const [download] = await Promise.all([desk.waitForEvent("download"), desk.click("#csvButton")]);
  const csv = await readFile(await download.path(), "utf8");
  if (!csv.includes("Tester 9") || !csv.includes("3/")) fail("CSV should list the student and their stars");
  await teacher.close();
}
