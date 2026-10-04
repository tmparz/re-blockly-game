// 🔮 Predict missions: the code is already written and cannot change. Students choose what Robo will say
// (ask: "say") or where it will stop (ask: "cell", marks A/B/C on the map), then press Run to check.
// The right choice is never written here: the engine runs the program, and tests check exactly one choice matches.
// Each Part 3 unit opens and closes with one (see PREDICT in index.js).
const set = (v, value) => ({ op: "setVar", var: v, value });
const add = (v, value = 1) => ({ op: "changeVar", var: v, value });
const say = (v) => ({ op: "sayVar", var: v });
const forEach = (body) => ({ op: "forEach", do: body });
const ifCmp = (v, cmp, value, body) => ({ op: "ifCmp", var: v, cmp, value, do: body });
const iff = (cond, yes, no) => ({ if: cond, do: yes, else: no });
const WALK = { go: [{ repeatN: true, do: ["move"] }] };
const TURNS = { turns: [{ repeatN: true, do: ["right"] }] };
const DOUBLE = { double: [set("answer", "input"), add("answer", "input"), { op: "report", value: "answer" }] };
const countDef = { count: [ifCmp("input", "gt", 0, [{ call: "count", n: "in-1" }, { op: "addList", value: "input" }])] };
const OPEN = [".....", ".....", ">....", ".....", "....."];

const predict = (mission) => ({ ...mission, mode: "predict", blocks: [], starter: mission.program, solution: mission.program });

export const PREDICT = {
  inputs: [
    predict({
      id: "in-p1",
      title: { en: "Guess: Walk 3", zh: "猜猜看：走 3 格" },
      story: { en: "This function has an input 🎛️. Robo runs \"walk with 🎛️ 3\". Which square does it stop on?", zh: "這個函式有一個輸入 🎛️。Robo 執行「走 輸入 🎛️ 3」，它會停在哪一格？" },
      hint: { en: "The number you send is how many times the function repeats \"move\".", zh: "送進去的數字，就是函式裡「前進」要重複幾次。" },
      lesson: { en: "Read the code first, then guess.", zh: "先讀程式，再猜答案。" },
      maps: [[">...."]],
      functions: ["go"],
      ask: { type: "cell", marks: { A: [2, 0], B: [3, 0], C: [4, 0] } },
      program: { main: [{ call: "go", n: 3 }], defs: WALK },
    }),
    predict({
      id: "in-p2",
      title: { en: "Guess: Three Right Turns", zh: "猜猜看：右轉三次" },
      story: { en: "Walk 2, then \"turn right ×\" with 🎛️ 3, then walk 2. Where does Robo end up?", zh: "走 2 格，「右轉幾次」輸入 🎛️ 3，再走 2 格。Robo 最後在哪一格？" },
      hint: { en: "Turning right 3 times faces the same way as turning left once.", zh: "右轉 3 次，和左轉 1 次面對同一個方向。" },
      lesson: { en: "Follow the inputs step by step.", zh: "跟著輸入一步一步想。" },
      maps: [OPEN],
      functions: ["go", "turns"],
      ask: { type: "cell", marks: { A: [2, 0], B: [2, 4], C: [4, 2] } },
      program: { main: [{ call: "go", n: 2 }, { call: "turns", n: 3 }, { call: "go", n: 2 }], defs: { ...WALK, ...TURNS } },
    }),
  ],
  logic: [
    predict({
      id: "lg-p1",
      title: { en: "Guess: More Than 3", zh: "猜猜看：大於 3" },
      story: { en: "Robo repeats until 👣 steps > 3, then says 👣 steps. What number does it say?", zh: "Robo 重複直到 👣 步數 > 3，再說出 👣 步數。它會說幾？" },
      hint: { en: "When steps is exactly 3, is \"steps > 3\" true yet?", zh: "步數剛好是 3 的時候，「步數 > 3」成立了嗎？" },
      lesson: { en: "\"> 3\" does not include 3.", zh: "「> 3」不包含 3。" },
      maps: [[">......"]],
      vars: ["steps"],
      ask: { type: "say" },
      choices: [2, 3, 4, 5],
      program: { main: [set("steps", 0), { op: "untilCmp", var: "steps", cmp: "gt", value: 3, do: ["move", add("steps")] }, say("steps")] },
    }),
    predict({
      id: "lg-p2",
      title: { en: "Guess: Left AND Right", zh: "猜猜看：左邊而且右邊" },
      story: { en: "Robo walks to the flag and adds 1 when there is a road on the left AND on the right. What does it say?", zh: "Robo 走到旗子，左邊「而且」右邊都有路時加 1。它最後說幾？" },
      hint: { en: "Count only the squares with a road on BOTH sides.", zh: "只算兩邊「都」有路的格子。" },
      lesson: { en: "\"and\" needs both sides to be true.", zh: "「而且」要兩邊都成立。" },
      maps: [["#.#..#.#", ">......G", "##.#.#.#"]],
      vars: ["roads"],
      ask: { type: "say" },
      choices: [1, 2, 3, 5],
      program: { main: [set("roads", 0), { until: true, do: ["move", { op: "ifLogic", a: "pathLeft", logic: "and", b: "pathRight", do: [add("roads")] }] }, say("roads")] },
    }),
  ],
  variables: [
    predict({
      id: "vr-p1",
      title: { en: "Guess: Copy a Box", zh: "猜猜看：複製盒子" },
      story: { en: "💎 gems starts at 2 and 👣 steps at 5. Then \"set 💎 gems to 👣 steps\". What does Robo say?", zh: "💎 寶石數是 2，👣 步數是 5。接著「💎 寶石數 設為 👣 步數」。Robo 會說幾？" },
      hint: { en: "\"Set\" replaces what was in the box; it does not add.", zh: "「設為」會換掉盒子裡原本的數字，不是加上去。" },
      lesson: { en: "Each box keeps its own number.", zh: "每個盒子各自裝自己的數字。" },
      maps: [[">."]],
      vars: ["gems", "steps"],
      ask: { type: "say" },
      choices: [1, 2, 5, 7],
      program: { main: [set("gems", 2), set("steps", 5), set("gems", "steps"), say("gems")] },
    }),
    predict({
      id: "vr-p2",
      title: { en: "Guess: The Broken Swap", zh: "猜猜看：失敗的交換" },
      story: { en: "This code tries to swap 💎 gems (3) and 👣 steps (8) without a spare box. What does it say for 👣 steps?", zh: "這段程式想交換 💎 寶石數（3）和 👣 步數（8），卻沒有用空盒子。它說的 👣 步數是幾？" },
      hint: { en: "After the first \"set\", what is in 💎 gems? The 3 is already gone.", zh: "第一個「設為」之後，💎 寶石數裡面是幾？3 已經不見了。" },
      lesson: { en: "Without a spare box, one number is lost.", zh: "沒有空盒子，就會弄丟一個數字。" },
      maps: [[">."]],
      vars: ["gems", "steps"],
      ask: { type: "say" },
      choices: [3, 8, 11, 16],
      program: { main: [set("gems", 3), set("steps", 8), set("gems", "steps"), set("steps", "gems"), say("steps")] },
    }),
  ],
  lists: [
    predict({
      id: "ls-p1",
      title: { en: "Guess: Add the List", zh: "猜猜看：加起來" },
      story: { en: "The list is [2, 5, 3]. For each item, 🧮 total changes by the item. What does Robo say?", zh: "串列是 [2, 5, 3]。對每個項目，🧮 總和改變 📦 項目。Robo 會說幾？" },
      hint: { en: "0 + 2, then + 5, then + 3.", zh: "0 + 2，再 + 5，再 + 3。" },
      lesson: { en: "\"For each\" visits every item in order.", zh: "「對每個」會照順序走過每一個項目。" },
      maps: [[">."]],
      lists: [[2, 5, 3]],
      vars: ["total"],
      tokens: ["item"],
      ask: { type: "say" },
      choices: [3, 5, 8, 10],
      program: { main: [set("total", 0), forEach([add("total", "item")]), say("total")] },
    }),
    predict({
      id: "ls-p2",
      title: { en: "Guess: The Wrong Start", zh: "猜猜看：起點錯了" },
      story: { en: "This finds the 🏆 biggest item of [3, 4, 2], but 🏆 biggest starts at 5. What does Robo say?", zh: "這段程式要找出 [3, 4, 2] 裡 🏆 最大的數，可是 🏆 最大值一開始是 5。Robo 會說幾？" },
      hint: { en: "Is any item bigger than 5? If not, 🏆 never changes.", zh: "有沒有項目比 5 大？沒有的話，🏆 就不會改變。" },
      lesson: { en: "The starting value matters.", zh: "起始值很重要。" },
      maps: [[">."]],
      lists: [[3, 4, 2]],
      vars: ["best"],
      tokens: ["item"],
      ask: { type: "say" },
      choices: [2, 3, 4, 5],
      program: { main: [set("best", 5), forEach([ifCmp("item", "gt", "best", [set("best", "item")])]), say("best")] },
    }),
  ],
  algorithms: [
    predict({
      id: "al-p1",
      title: { en: "Guess: Count the Moves", zh: "猜猜看：走幾步" },
      story: { en: "Rule: go straight if you can, otherwise turn right. 👣 steps counts every move. What does Robo say at the flag?", zh: "規則：能直走就直走，不然就右轉。👣 步數記下每一步。Robo 到旗子時說幾？" },
      hint: { en: "Trace the path with your finger and count only the moves, not the turns.", zh: "用手指沿著路線走，只數「前進」，轉彎不算。" },
      lesson: { en: "Count the steps before you race.", zh: "比賽之前，先數數看要走幾步。" },
      maps: [[">...#", "###.#", "G...#"]],
      vars: ["steps"],
      ask: { type: "say" },
      choices: [5, 6, 7, 8],
      program: { main: [set("steps", 0), { until: true, do: [iff("pathAhead", ["move", add("steps")], ["right"])] }, say("steps")] },
    }),
    predict({
      id: "al-p2",
      title: { en: "Guess: Battery Left", zh: "猜猜看：剩多少電" },
      story: { en: "🔋 battery starts at 10 and goes down 1 for each move. Robo follows the left wall to the flag. How much battery is left?", zh: "🔋 電量從 10 開始，每前進一步減 1。Robo 用左手摸著牆走到旗子，最後剩多少電？" },
      hint: { en: "Left hand: turn left if you can, else go straight, else turn right.", zh: "左手規則：能左轉就左轉，不然直走，再不然右轉。" },
      lesson: { en: "A different rule can use a different amount of battery.", zh: "換一種規則，用掉的電量可能不一樣。" },
      maps: [[">..", ".#.", "..G"]],
      vars: ["battery"],
      ask: { type: "say" },
      choices: [2, 4, 6, 8],
      program: { main: [set("battery", 10), { until: true, do: [iff("pathLeft", ["left", "move", add("battery", -1)], [iff("pathAhead", ["move", add("battery", -1)], ["right"])])] }, say("battery")] },
    }),
  ],
  masters: [
    predict({
      id: "fm-p1",
      title: { en: "Guess: The Doubling Machine", zh: "猜猜看：變兩倍機器" },
      story: { en: "\"double\" reports 🎛️ input + 🎛️ input. Robo sets 📝 answer to ↩️ double with 🎛️ 3. What does it say?", zh: "「變兩倍」會回傳 🎛️ 輸入 + 🎛️ 輸入。Robo 把 📝 答案 設為 ↩️ 變兩倍（輸入 3），它會說幾？" },
      hint: { en: "Inside the function: answer = 3, then answer + 3.", zh: "函式裡面：答案 = 3，再加上 3。" },
      lesson: { en: "A reporter sends its answer back.", zh: "會回傳的函式，把答案送回來。" },
      maps: [[">."]],
      vars: ["answer"],
      tokens: ["input"],
      functions: ["double"],
      ask: { type: "say" },
      choices: [3, 6, 9, 12],
      program: { main: [{ op: "setCall", var: "answer", name: "double", n: 3 }, say("answer")], defs: DOUBLE },
    }),
    predict({
      id: "fm-p2",
      title: { en: "Guess: Call First, Add After", zh: "猜猜看：先呼叫，後加入" },
      story: { en: "\"count\" calls itself with 🎛️ input − 1 FIRST, then adds 🎛️ input to the list. Robo runs count with 🎛️ 3. What list does it say?", zh: "「數數」先用 🎛️ 輸入 − 1 呼叫自己，「之後」才把 🎛️ 輸入 加進串列。Robo 執行 數數（輸入 3），會說出什麼串列？" },
      hint: { en: "count 3 waits for count 2, which waits for count 1. Who adds first?", zh: "數數 3 要等數數 2 做完，數數 2 要等數數 1。誰最先把數字加進去？" },
      lesson: { en: "Work after the call happens on the way back.", zh: "放在呼叫之後的事，會在「回來的路上」才做。" },
      maps: [[">."]],
      lists: [[]],
      tokens: ["input", "in-1"],
      functions: ["count"],
      ask: { type: "say" },
      choices: [[3], [3, 2, 1], [1], [1, 2, 3]],
      program: { main: [{ call: "count", n: 3 }, "sayList"], defs: countDef },
    }),
  ],
};

export const ALL_PREDICT = Object.values(PREDICT).flat();
