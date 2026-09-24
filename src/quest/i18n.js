// English is the default (US classroom); 中文 is available for teachers and families.
const LANG_KEY = "blocky-quest-lang";

function readLang() {
  try {
    return localStorage.getItem(LANG_KEY) === "zh" ? "zh" : "en";
  } catch {
    return "en";
  }
}

export const lang = readLang();

export function setLang(next) {
  try {
    localStorage.setItem(LANG_KEY, next);
  } catch {
    // Storage can be blocked; the page still works in English.
  }
  location.reload();
}

export const pick = (value) => (value && typeof value === "object" ? value[lang] ?? value.en : value);

const UI = {
  en: {
    pageTitle: "Quest Lab · Blocky Easy",
    navLevels: "100 Levels",
    navStory: "Story Lab",
    navCourse: "Course Plan",
    stars: "Stars",
    mission: "Mission {n}",
    hint: "Need a hint?",
    blocksUsed: "{count} blocks",
    limit: "Max {max} blocks · ⭐⭐⭐ at {best}",
    maps: "Test maps",
    map: "Map ",
    run: "Run",
    reset: "Reset",
    restart: "Start over",
    answer: "Answer",
    speed: "Speed",
    next: "Next",
    workspace: "Code",
    counter: "counter",
    ready: "Press Run to test your code.",
    running: "Running…",
    confirmRestart: "Start this mission over? Your blocks will be replaced.",
    confirmAnswer: "Load the answer? Your blocks will be replaced.",
    answerLoaded: "Answer loaded. Press Run to watch it, then try it on your own!",
    success3: "Mission complete! ⭐⭐⭐",
    success2: "Mission complete! ⭐⭐ Can you do it with {best} blocks?",
    allMaps: "It works on all {n} maps!",
    failedOnMap: "Map {n}: ",
    noStart: "Put your blocks under “▶ when Run”.",
    tooManyBlocks: "Too many blocks ({count}). Use {max} or fewer.",
    require: "Use the “{block}” block at least {n} times.",
    wall: "Bonk! Robo bumped into a wall.",
    noGem: "There is no gem here to pick up.",
    notGoal: "Robo stopped before reaching the flag 🏁.",
    missedGems: "Robo missed some gems 💎.",
    exactGems: "Robo needs exactly {n} gems.",
    noSay: "Robo forgot to say the answer 💬.",
    wrongSay: "Robo said {said}, but the right answer is {want}.",
    tooManySteps: "Robo is stuck in a loop that never ends! We stopped it.",
    recursion: "A function keeps calling itself forever.",
    missingDef: "Robo called a function that has no definition.",
    unknownBlock: "Robo does not know one of these blocks.",
    loadWarning: "Blockly could not load. Check the internet connection and refresh.",
    qa_toMain: "Tap a block to add it to the end of the program",
    qa_after: "Adding after",
    qa_inside: "Adding inside",
    qa_insideElse: "Adding inside “else” of",
    qa_intoElse: "↪ else",
    qa_out: "Out",
    qa_main: "Main",
    qa_remove: "Delete",
  },
  zh: {
    pageTitle: "Quest Lab 任務實驗室｜Blocky Easy",
    navLevels: "100 關",
    navStory: "Story Lab",
    navCourse: "課程規劃",
    stars: "星星",
    mission: "任務 {n}",
    hint: "需要提示嗎？",
    blocksUsed: "{count} 個方塊",
    limit: "最多 {max} 個方塊 · {best} 個以內得 ⭐⭐⭐",
    maps: "測試地圖",
    map: "地圖 ",
    run: "執行",
    reset: "回起點",
    restart: "重新開始",
    answer: "解答",
    speed: "速度",
    next: "下一個任務",
    workspace: "程式",
    counter: "計數器",
    ready: "按「執行」測試你的程式。",
    running: "執行中…",
    confirmRestart: "要重新開始這個任務嗎？目前的方塊會被取代。",
    confirmAnswer: "要載入解答嗎？目前的方塊會被取代。",
    answerLoaded: "已載入解答。按執行看看，再自己試一次！",
    success3: "任務完成！⭐⭐⭐",
    success2: "任務完成！⭐⭐ 能不能只用 {best} 個方塊？",
    allMaps: "全部 {n} 張地圖都通過了！",
    failedOnMap: "地圖 {n}：",
    noStart: "把方塊接在「▶ 按下執行時」下面。",
    tooManyBlocks: "方塊太多了（{count} 個），請用 {max} 個以內。",
    require: "至少要使用「{block}」方塊 {n} 次。",
    wall: "碰！Robo 撞到牆了。",
    noGem: "這裡沒有寶石可以撿。",
    notGoal: "Robo 還沒走到旗子 🏁 就停了。",
    missedGems: "Robo 漏撿了一些寶石 💎。",
    exactGems: "Robo 需要剛好 {n} 顆寶石。",
    noSay: "Robo 忘記說出答案了 💬。",
    wrongSay: "Robo 說 {said}，但正確答案是 {want}。",
    tooManySteps: "Robo 卡在停不下來的迴圈裡！我們先幫它停下來。",
    recursion: "有個函式一直呼叫自己，停不下來。",
    missingDef: "Robo 呼叫了一個還沒定義的函式。",
    unknownBlock: "Robo 看不懂其中一個方塊。",
    loadWarning: "Blockly 沒有載入，請確認網路連線後重新整理。",
    qa_toMain: "點方塊，就會接到程式最後面",
    qa_after: "接在後面：",
    qa_inside: "放進裡面：",
    qa_insideElse: "放進「否則」裡：",
    qa_intoElse: "↪ 否則",
    qa_out: "跳出",
    qa_main: "主程式",
    qa_remove: "刪除",
  },
};

export function t(name, params = {}) {
  const text = UI[lang][name] ?? UI.en[name] ?? name;
  return text.replace(/\{(\w+)\}/g, (_, token) => String(params[token] ?? ""));
}
