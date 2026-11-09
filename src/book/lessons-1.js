// Lessons 1–10: what each page asks first (predict), what children play with (play), and the flap's one-line idea.
// Every answer is worked out by running the real engine on the mission's own maps; nothing is typed in by hand.
// play: one activity or a list of them (see widgets-a.js / widgets-b.js); lock: parts of the program children cannot change.
const times = (k, item) => Array.from({ length: k }, () => item);
const call = (name) => ({ call: name });

export const LESSONS_1 = {
  "fg-1": {
    predict: (h) => ({
      q: "「🐸 跳兩格」已經寫好了，可是「▶ 按下執行時」下面是空的。按執行，Robo 會怎樣？",
      options: ["一動也不動", "走 2 格到旗子"],
      answer: h.run(h.starter).stats.moves === 0 ? 0 : 1,
      why: "食譜只是寫好放在旁邊，沒有人「按下」它，所以 Robo 不會動。",
    }),
    play: { kind: "toggle", items: (h) => [
      { label: "食譜只寫好、放在旁邊", dsl: h.starter, note: "起始程式：跳兩格已經定義好" },
      { label: "把跳兩格放到 ▶ 下面", dsl: h.sol, note: "這一關的解答：呼叫一次跳兩格" },
    ] },
    flap: "函式就像食譜卡：寫好放在旁邊不會自己動。要把它放到「▶ 按下執行時」下面（這叫做「呼叫」），Robo 才會照著做。",
  },
  "fn-1": {
    predict: (h) => {
      const options = [2, 3, 4];
      return {
        q: "旗子在 6 格外，「🐸 跳兩格」一次走 2 格。主程式要呼叫跳兩格幾次？",
        options: options.map((k) => `${k} 次`),
        answer: h.firstPass(options.map((k) => h.withMain(times(k, call("hop"))))),
        why: "6 ÷ 2 = 3，跳兩格只寫一次，卻可以用 3 次。",
      };
    },
    play: { kind: "stepper", title: "呼叫跳兩格", unit: "次", min: 1, max: 5,
      start: (h) => h.starter.main.length, build: (h) => (k) => h.withMain(times(k, call("hop"))) },
    flap: "函式寫一次，就能用很多次：「跳兩格」只定義一次，主程式呼叫它 3 次，Robo 就走了 6 格。",
  },
  "fg-13": {
    predict: (h) => ({
      q: "旗子在 5 格外。「🐸 跳兩格」走 2 格、「🏃 衝三格」走 3 格。要用哪兩張食譜？",
      options: ["跳兩格 ＋ 跳兩格", "跳兩格 ＋ 衝三格", "衝三格 ＋ 衝三格"],
      answer: h.firstPass([["hop", "hop"], ["hop", "dash"], ["dash", "dash"]].map((names) => h.withMain(names.map(call)))),
      why: "2 + 3 = 5。衝三格 ＋ 衝三格是 6 格，會撞牆。",
    }),
    play: { kind: "cards", names: ["hop", "dash"], max: 3 },
    flap: "看函式的名字，就知道它會做什麼：不用打開「跳兩格」和「衝三格」，也知道要選哪兩張。",
  },
  "fg-4": {
    predict: (h) => ({
      q: "先「🏃 衝三格」到轉角，接著要轉哪一邊，才能再衝到旗子？",
      options: ["左轉 ↺", "右轉 ↻"],
      answer: h.firstPass(["left", "right"].map((turn) => h.withMain([call("dash"), turn, call("dash")]))),
      why: "旗子在上面，Robo 面向右邊，要左轉才會面向上面。",
    }),
    play: { kind: "mix" },
    flap: "函式可以和一般方塊混在一起用：衝三格（函式）→ 左轉（一般方塊）→ 衝三格（函式）。",
  },
  "fg-2": {
    predict: (h) => {
      const options = [h.sol.main.length - 1, h.sol.main.length, h.starter.main.length];
      return {
        q: `原本主程式有 ${h.starter.main.length} 個前進。用「🏃 衝三格」換掉 6 個前進以後，主程式剩幾個方塊？`,
        options: options.map((k) => `${k} 個`),
        answer: 1,
        why: "衝三格 ＋ 衝三格 ＋ 前進，3 個方塊就走完 7 格。",
      };
    },
    play: { kind: "compare", sides: (h) => [
      { label: "原本的程式", dsl: h.starter },
      { label: "用衝三格", dsl: h.sol },
    ] },
    flap: "為什麼要用函式？① 程式變短：走一樣的路，原本主程式 7 個方塊，換成函式只要 3 個。",
  },
  "fg-3": {
    predict: (h) => {
      const result = h.run(h.starter);
      const left = result.map.goal.x - result.stats.x;
      return {
        q: "「🏃 衝三格」裡面只放了 2 個前進。主程式照原樣跑，Robo 會停在哪？",
        options: ["剛好走到旗子", `還差 ${left} 格才到旗子`, "撞到牆"],
        answer: result.ok ? 0 : result.reason === "notGoal" ? 1 : 2,
        why: "每次衝三格都少走 1 格，叫了 3 次就少走 3 格。",
      };
    },
    play: { kind: "stepper", title: "衝三格裡面放幾個前進", unit: "個前進", min: 1, max: 4,
      start: (h) => h.starter.defs.dash.length, build: (h) => (k) => ({ main: h.starter.main, defs: { dash: times(k, "move") } }) },
    lock: ["main"],
    flap: "為什麼要用函式？② 只修一個地方：主程式完全不動，只在「衝三格」裡多放一個前進，3 個呼叫就一起修好了。",
  },
  "fn-2": {
    predict: (h) => ({
      q: "主程式已經呼叫「↪️ 轉角」3 次，可是轉角裡面是空的。裡面要放什麼？",
      options: ["前進、右轉", "前進、前進、右轉", "前進、前進、左轉"],
      answer: h.firstPass([["move", "right"], ["move", "move", "right"], ["move", "move", "left"]]
        .map((body) => ({ main: h.starter.main, defs: { corner: body } }))),
      why: "每個轉角都是先走 2 格再右轉，3 次都一樣。",
    }),
    play: { kind: "callmap", name: "corner" },
    lock: ["main"],
    flap: "自己寫函式「裡面」的步驟：主程式已經會叫它，函式裡面寫好了，3 個呼叫才有事可做。",
  },
  "fg-5": {
    predict: (h) => ({
      q: "「🧺 走走撿」= 前進、前進、撿起。用完 3 次走走撿以後，還要做什麼？",
      options: ["再前進 1 格到旗子", "什麼都不用，已經在旗子上", "再撿一次寶石"],
      answer: h.firstPass([[...times(3, call("grab")), "move"], times(3, call("grab")), [...times(3, call("grab")), "pick"]].map(h.withMain)),
      why: "3 次走走撿走了 6 格、撿了 3 顆，旗子還在前面 1 格。",
    }),
    play: { kind: "checklist", name: "grab" },
    flap: "函式和主程式都自己寫：先在定義裡寫好「走走撿」，再到「▶ 按下執行時」下面呼叫它。",
  },
  "fn-3": {
    predict: (h) => {
      const options = [2, 3, 4];
      const used = h.sol.main.filter((item) => item.call === "stairs").length;
      return {
        q: "樓梯中間夾著一段平路。「🪜 下樓梯」一共要用幾次？",
        options: options.map((k) => `${k} 次`),
        answer: options.indexOf(used),
        why: "上面 2 階、走一段平路、下面 2 階，一共 4 次。",
      };
    },
    play: { kind: "unfold" },
    flap: "找出重複的部分（一階樓梯），就算中間夾著別的步驟也沒關係：下樓梯 ×2、走平路、下樓梯 ×2。",
  },
  "fn-5": {
    predict: (h) => {
      const lengths = [];
      let walk = 0;
      h.sol.main.forEach((item) => {
        if (item === "move") walk += 1;
        else if (item.call === "room") {
          lengths.push(walk);
          walk = 0;
        }
      });
      return {
        q: "三個房間之間的走廊一樣長嗎？",
        options: ["一樣長，用「重複」就好", "不一樣長，用函式比較好"],
        answer: new Set(lengths).size === 1 ? 0 : 1,
        why: `走廊分別是 ${lengths.join("、")} 格，不一樣長。`,
      };
    },
    play: { kind: "gaps", name: "room" },
    flap: "間隔不一樣時，迴圈不好用，函式可以：走廊多長就走多長，到了房間門口再呼叫「進房間」。",
  },
};
