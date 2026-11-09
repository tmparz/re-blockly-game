// Lessons 11–20 (same shape as lessons-1.js). Answers come from running the real engine on the mission's own maps.
const call = (name) => ({ call: name });
const swap = (step) => (step === "left" ? "right" : step === "right" ? "left" : step);
const numbers = (list, unit) => list.map((k) => `${k} ${unit}`);

export const LESSONS_2 = {
  "fg-7": {
    predict: (h) => {
      const options = [3, 4, 5];
      return {
        q: "每一階樓梯都有一顆寶石。「💎 階梯撿寶」要放進「重複」裡做幾次？",
        options: numbers(options, "次"),
        answer: h.firstPass(options.map((k) => ({ main: [{ repeat: k, do: [call("gemStep")] }, "move"], defs: h.sol.defs }))),
        why: "樓梯有 4 階、4 顆寶石，所以重複 4 次；少一次會漏寶石，多一次會想撿不存在的寶石。",
      };
    },
    play: [
      { kind: "stepper", title: "重複階梯撿寶", unit: "次", min: 1, max: 6, start: () => 1,
        build: (h) => (k) => ({ main: [{ repeat: k, do: [call("gemStep")] }, "move"], defs: h.sol.defs }) },
      { kind: "counter", name: "gemStep" },
    ],
    flap: "把函式放進迴圈裡：「階梯撿寶」只管一階，「重複 4 次」負責叫它 4 次。",
  },
  "fn-4": {
    predict: (h) => {
      const options = [3, 6, 9];
      return {
        q: "「💎 寶石列」裡有「重複 3 次（前進、撿起）」，主程式再重複寶石列 3 次。一共撿起幾顆寶石？",
        options: numbers(options, "顆"),
        answer: options.indexOf(h.run(h.sol).stats.picked.size),
        why: "3 次 × 每次 3 顆 = 9 顆：迴圈裡叫函式，函式裡又有迴圈。",
      };
    },
    play: { kind: "tree", count: ["row"] },
    flap: "把迴圈放進函式裡：寶石列裡的「重複 3 次」撿完一排，主程式再把寶石列重複 3 次，3 × 3 = 9 顆。",
  },
  "fg-8": {
    predict: (h) => ({
      q: "「⤴️ 上口袋」= 左轉、前進、撿起、右轉、右轉、前進、左轉。「⤵️ 下口袋」要怎麼寫？",
      options: ["跟上口袋一模一樣", "把上口袋的左轉、右轉對調"],
      answer: h.firstPass([h.sol.defs.pocketUp, h.sol.defs.pocketUp.map(swap)]
        .map((down) => ({ main: h.sol.main, defs: { pocketUp: h.sol.defs.pocketUp, pocketDown: down } }))),
      why: "上口袋要先左轉才朝上；下口袋在路的下面，要先右轉才朝下，所以左右剛好相反。",
    }),
    play: { kind: "mirror", names: ["pocketUp", "pocketDown"] },
    flap: "兩個函式，各做一種工作：上口袋撿上面的、下口袋撿下面的；主程式只要決定什麼時候叫哪一個。",
  },
  "fn-6": {
    predict: (h) => {
      const deepest = Math.max(...h.run(h.sol).frames.map((frame) => frame.depth));
      return {
        q: "主程式叫「🚪 進房間」，進房間裡面又叫「🔄 向後轉」。Robo 在向後轉裡面轉身時，是第幾層？",
        options: ["第 1 層", "第 2 層", "第 3 層"],
        answer: deepest - 1,
        why: "主程式是第 0 層，進房間是第 1 層，向後轉在進房間裡面，是第 2 層。",
      };
    },
    play: [{ kind: "tree", count: ["room", "turnAround"] }, { kind: "counter", name: "turnAround" }],
    flap: "函式裡可以呼叫別的函式：主程式 → 進房間（第 1 層）→ 向後轉（第 2 層）。向後轉做完，就回到進房間繼續往下做。",
  },
  "fg-11": {
    predict: (h) => {
      const options = [2, 4, 8];
      return {
        q: "主程式叫 2 次「⛰️ 爬山頭」，每座山頭要上 2 階。「↗️ 上一階」一共會被做幾次？",
        options: numbers(options, "次"),
        answer: options.indexOf(h.entries(h.run(h.sol), "up")),
        why: "2 座山頭 × 每座 2 階 = 4 次。",
      };
    },
    play: [{ kind: "tree", count: ["peak", "up", "down"] }, { kind: "counter", name: "up" }],
    flap: "把大問題拆成小函式：爬山頭 = 上一階 ×2 ＋ 撿起 ＋ 下一階 ×2，主程式只要叫 2 次爬山頭。",
  },
  "fn-10": {
    predict: (h) => {
      const options = [h.sol.main.length, h.blockCount(h.sol), h.run(h.sol).frames.length];
      return {
        q: `主程式只有 ${h.sol.main.length} 步。Robo 全程一共要做幾個動作（前進、轉彎、撿起）？`,
        options: numbers(options, "個"),
        answer: 2,
        why: "主程式的每一步「🏰 城塔」是 10 個動作、「🚪 進房間」是 7 個動作，加起來是 47 個。",
      };
    },
    play: { kind: "recipe" },
    // The single-page lesson 16 was checked by hand: these numbers must stay true.
    verify: (results, m) => {
      const [result] = results;
      const problems = [];
      const want = (ok, text) => { if (!ok) problems.push(`第 16 關數據不符：${text}`); };
      want(result.map.w === 9 && result.map.h === 4, "地圖應該是 9×4");
      want(m.functions.join("+") === "tower+room", "函式應該是 tower＋room");
      want(m.solution.main.length === 11, "主程式應該是 11 步");
      want(result.frames.length === 47, "全程應該是 47 個動作");
      want(result.map.gems.size === 5 && result.stats.picked.size === 5, "應該有 5 顆寶石並全部撿起");
      want(result.map.goal?.x === 8 && result.map.goal?.y === 2, "終點應該在 (8,2)");
      return problems;
    },
    flap: "像寫食譜一樣規劃主程式：先寫好「城塔」和「進房間」兩張小食譜，主程式 11 步就把 47 個動作排好了。",
  },
  "fg-9": {
    predict: (h) => {
      const options = [1, 2, 3];
      return {
        q: "第 3 張地圖的路上有幾個欄架？主程式「重複直到 🏁」會讓「🏅 跨欄」做幾次？",
        options: numbers(options, "次"),
        answer: options.indexOf(h.entries(h.run(h.sol, 2), "hurdle")),
        why: "第 3 張地圖有 3 個欄架，跨欄做 3 次就到旗子；第 1 張只要 1 次。主程式不用改。",
      };
    },
    play: [{ kind: "maps", name: "hurdle" }, { kind: "counter", name: "hurdle" }],
    flap: "不知道要做幾次時，讓函式一直重複到終點：「重複直到 🏁」每跨一次就檢查到了沒，欄架 1 個、2 個、3 個都走得完。",
  },
  "fn-7": {
    predict: (h) => {
      const options = [3, 4, 5];
      return {
        q: "「🛤️ 走廊」：重複 4 次（前進、如果站在寶石上就撿起）。在第 2 張地圖，Robo 會撿起幾顆寶石？",
        options: numbers(options, "顆"),
        answer: options.indexOf(h.run(h.sol, 1).stats.picked.size),
        why: "第 2 張地圖有 4 顆寶石；「如果」讓 Robo 只在有寶石的格子撿，所以全部撿到、也不會撿空。",
      };
    },
    play: { kind: "trio" },
    flap: "函式裡放「如果」，每張地圖都能用：有寶石才撿，寶石換位置也不怕，同一個走廊函式三張地圖都通過。",
  },
  "fg-10": {
    predict: (h) => {
      const result = h.run(h.sol, 0);
      const index = result.frames.findIndex((frame) => frame.kind === "turn");
      const before = index > 0 ? result.frames[index - 1].rot : result.map.start.dir;
      return {
        q: "第 1 張地圖：Robo 走到前面沒有路的地方，「🧭 聰明走」會讓它左轉還是右轉？",
        options: ["左轉 ↺", "右轉 ↻"],
        answer: result.frames[index].rot < before ? 0 : 1,
        why: "前面沒路，再看左邊：左邊也沒路，所以照規則「否則 → 右轉」。",
      };
    },
    play: { kind: "rule" },
    flap: "函式可以裝「規則」：前面有路就走，不然看左邊，再不然就右轉。一條規則，每個迷宮都走得完。",
  },
  "fg-12": {
    predict: (h) => {
      const options = [0, 1, 2];
      return {
        q: "第 3 張地圖：「🤖 聰明一步」遇到前面沒路就「🪨 翻石頭」。Robo 一共要翻幾次石頭？",
        options: numbers(options, "次"),
        answer: options.indexOf(h.entries(h.run(h.sol, 2), "rock")),
        why: "第 3 張地圖只有 1 顆石頭；其他時候前面有路，聰明一步就直接前進。",
      };
    },
    play: [{ kind: "uses" }, { kind: "maps", name: "rock" }],
    flap: "全部學到的一起用：重複直到 🏁 ＋ 函式裡的「如果／否則」＋ 函式呼叫函式（聰明一步叫翻石頭）。",
  },
};
