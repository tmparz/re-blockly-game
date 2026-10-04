// Game Studio (Part 3): build a full game version by version with several variables, randomness,
// comparisons, a timer running in parallel and game over. Then design your own game.
import { B, CREDIT_GOAL, act, actorOf, bodyOf, clickBody, clicked, field, goal, innerOf, say, says, script, scriptsOf, start, startBody, state } from "./task-kit.js";

const find = (list, type) => list.filter((b) => b.type === type);
const varOf = (b) => field(b, "VAR", "score");
const num = (b) => Number(field(b, "N", "0"));
const changes = (list, name, sign) => find(list, "story_change_var").some((b) => varOf(b) === name && Math.sign(num(b)) === sign);
const ifVar = (list, name) => find(list, "story_if_var").filter((b) => varOf(b) === name);
const receiveBody = (s) => bodyOf(scriptsOf(s, "story_when_receive"));
const stops = (list) => list.some((b) => b.type === "story_stop_all");

const setVar = (name, n) => B("story_set_var", { VAR: name, N: String(n) });
const changeVar = (name, n) => B("story_change_var", { VAR: name, N: String(n) });
const ifVarB = (name, cmp, n, body) => B("story_if_var", { VAR: name, CMP: cmp, N: String(n) }, body);
const sound = (id) => B("story_sound", { SOUND: id });
const scene = (id) => B("story_background", { SCENE: id });
const stopAll = B("story_stop_all");

// The game, version by version.
const game = (v) => {
  const run = [say("robot", "Tap the dragon! Don't tap me!", 2), setVar("score", 0), setVar("lives", 3), act("story_visibility", "dragon", { ACTION: "show" })];
  if (v >= 6) run.push(B("story_broadcast", { MSG: "go" }));
  if (v >= 2) run.push(B("story_forever", {}, [B("story_wait", { SECONDS: "1" }), act("story_goto", "dragon", { SPOT: "random" })]));
  const scripts = [script(start, ...run)];
  if (v >= 3) {
    scripts.push(script(clicked("dragon"), sound("pop"), changeVar("score", 1),
      ...(v >= 7 ? [B("story_if_chance", { N: "3" }, [sound("magic"), changeVar("score", 2)])] : []),
      ...(v >= 8 ? [ifVarB("score", "ge", 10, [scene("castle"), sound("cheer"), say("dragon", "You win!", 2), stopAll])] : [])));
  }
  if (v >= 4) {
    scripts.push(script(clicked("robot"), sound("boing"), changeVar("lives", -1), act("story_feel", "robot", { FEEL: "angry" }),
      ...(v >= 5 ? [ifVarB("lives", "le", 0, [scene("space"), say("robot", "Game over!", 2), stopAll])] : [])));
  }
  if (v >= 6) {
    scripts.push(script(B("story_when_receive", { MSG: "go" }), setVar("time", 10),
      B("story_until_var", { VAR: "time", CMP: "eq", N: "0" }, [B("story_wait", { SECONDS: "1" }), changeVar("time", -1)]),
      say("dragon", "Time's up!", 2), stopAll));
  }
  return state(...scripts);
};

const STEPS = [
  {
    title: { en: "v0.1 · Set Up the Game", zh: "v0.1・準備開始" },
    idea: { en: "A game needs rules and starting values.", zh: "遊戲要有規則，也要有起始值。" },
    task: { en: "Make \"Catch the Dragon Deluxe\"! When Run: the robot explains the rules, ⭐ score starts at 0, ❤️ lives start at 3, and the dragon appears.",
      zh: "來做「抓小龍豪華版」！按下執行時：機器人說明規則，⭐ 分數從 0 開始，❤️ 生命從 3 開始，小龍出現。" },
    goals: [
      goal("💬 Someone explains the rules", "💬 有人說明規則", (s) => startBody(s).some((b) => says(b))),
      goal("⭐ score and ❤️ lives get starting values", "⭐ 分數和 ❤️ 生命都有起始值",
        (s) => ["score", "lives"].every((name) => find(startBody(s), "story_set_var").some((b) => varOf(b) === name))),
      goal("👀 Show the dragon", "👀 讓小龍出現",
        (s) => startBody(s).some((b) => b.type === "story_visibility" && actorOf(b) === "dragon" && field(b, "ACTION", "show") === "show")),
    ],
  },
  {
    title: { en: "v0.2 · A Moving Target", zh: "v0.2・會跑的目標" },
    idea: { en: "Randomness makes a game different every time.", zh: "隨機讓每次玩都不一樣。" },
    task: { en: "At the end of when Run, add ♾️ forever: wait 1 second, then the dragon goes to a 🎲 random spot.",
      zh: "在「按下執行時」最後加上「♾️ 一直重複」：等待 1 秒，小龍移到 🎲 隨機位置。" },
    goals: [
      goal("♾️ A forever loop in when Run", "♾️ 按下執行時裡有「一直重複」", (s) => find(startBody(s), "story_forever").length > 0),
      goal("🎲 The dragon jumps to a random spot inside it", "🎲 迴圈裡小龍跳到隨機位置", (s) => find(startBody(s), "story_forever")
        .some((b) => innerOf(b).some((x) => x.type === "story_goto" && actorOf(x) === "dragon" && field(x, "SPOT") === "random"))),
    ],
  },
  {
    title: { en: "v0.3 · Score Points", zh: "v0.3・得分" },
    idea: { en: "Reward the player right away.", zh: "玩家做對了，馬上給回饋。" },
    task: { en: "Tapping the dragon scores: play a sound and change ⭐ score by +1. Press ▶ Run and try to catch it!",
      zh: "點到小龍就得分：播放聲音，⭐ 分數改變 +1。按 ▶ 執行，試著抓抓看！" },
    goals: [
      goal("👆 Tapping the dragon raises ⭐ score", "👆 點小龍讓 ⭐ 分數上升", (s) => changes(clickBody(s, "dragon"), "score", 1)),
      goal("🔊 A sound when you score", "🔊 得分時有聲音", (s) => find(clickBody(s, "dragon"), "story_sound").length > 0),
    ],
  },
  {
    title: { en: "v0.4 · Don't Tap the Robot", zh: "v0.4・別點機器人" },
    idea: { en: "A second variable adds a challenge.", zh: "第二個變數讓遊戲有挑戰。" },
    task: { en: "The robot is a trap! Tapping it loses one ❤️ life. Make the robot look angry too.",
      zh: "機器人是陷阱！點到它會少一條 ❤️ 生命，也讓機器人看起來很生氣。" },
    goals: [
      goal("👆 Tapping the robot takes away a ❤️ life", "👆 點機器人會少一條 ❤️ 生命", (s) => changes(clickBody(s, "robot"), "lives", -1)),
      goal("😠 The robot reacts", "😠 機器人有反應", (s) => clickBody(s, "robot").some((b) => b.type === "story_feel" || b.type === "story_sound")),
    ],
  },
  {
    title: { en: "v0.5 · Game Over", zh: "v0.5・遊戲結束" },
    idea: { en: "Every game needs a way to end.", zh: "每個遊戲都要有結束的方式。" },
    task: { en: "When ❤️ lives ≤ 0 the game is over: change the scene, say \"Game over!\" and 🛑 stop everything.",
      zh: "❤️ 生命 ≤ 0 時遊戲結束：換場景，說「遊戲結束！」，然後 🛑 全部停止。" },
    goals: [
      goal("⚖️ if ❤️ lives ≤ 0 (or = 0)", "⚖️ 如果 ❤️ 生命 ≤ 0（或 = 0）",
        (s) => ifVar(bodyOf(s), "lives").some((b) => num(b) === 0 && ["le", "eq", "lt"].includes(field(b, "CMP", "eq")))),
      goal("🛑 It stops everything", "🛑 全部停止", (s) => ifVar(bodyOf(s), "lives").some((b) => stops(innerOf(b)))),
      goal("💬 The player is told the game is over", "💬 告訴玩家遊戲結束了", (s) => ifVar(bodyOf(s), "lives").some((b) => innerOf(b).some((x) => says(x)))),
    ],
  },
  {
    title: { en: "v0.6 · Beat the Clock", zh: "v0.6・和時間賽跑" },
    idea: { en: "Two scripts can run at the same time.", zh: "兩段程式可以同時進行。" },
    task: { en: "Add a timer that runs alongside the game. In when Run, 📣 send go (before forever). When I receive go: ⏱ time = 10, repeat until time = 0 (wait 1, time -1), then stop everything.",
      zh: "加一個和遊戲同時跑的計時器。在按下執行時裡「📣 廣播 出發」（放在一直重複前面）。當收到出發：⏱ 時間 = 10，重複直到時間 = 0（等待 1、時間 -1），然後全部停止。" },
    goals: [
      goal("📣 when Run sends a message", "📣 按下執行時會廣播訊息", (s) => find(startBody(s), "story_broadcast").length > 0),
      goal("🔁 repeat until ⏱ time = 0, counting down", "🔁 重複直到 ⏱ 時間 = 0，並且倒數", (s) => find(receiveBody(s), "story_until_var")
        .some((b) => varOf(b) === "time" && changes(innerOf(b), "time", -1) && innerOf(b).some((x) => x.type === "story_wait"))),
      goal("🛑 When time is up, stop everything", "🛑 時間到就全部停止", (s) => stops(receiveBody(s))),
    ],
  },
  {
    title: { en: "v0.7 · Lucky Bonus", zh: "v0.7・幸運加分" },
    idea: { en: "A little surprise keeps players excited.", zh: "一點驚喜，讓玩家更想玩。" },
    task: { en: "Sometimes catching the dragon gives a bonus: 🎲 if a 1 in 3 chance → magic sound and ⭐ +2 more.",
      zh: "有時候抓到小龍會加分：🎲 如果 3 次裡中 1 次 → 魔法聲音，⭐ 再 +2。" },
    goals: [
      goal("🎲 A chance block when you tap the dragon", "🎲 點小龍時有機率方塊", (s) => find(clickBody(s, "dragon"), "story_if_chance").length > 0),
      goal("⭐ The bonus adds score", "⭐ 加分有加到分數", (s) => find(clickBody(s, "dragon"), "story_if_chance").some((b) => changes(innerOf(b), "score", 1))),
    ],
  },
  {
    title: { en: "v1.0 · You Win!", zh: "v1.0・你贏了！" },
    idea: { en: "Players need to know how to win.", zh: "玩家要知道怎樣才算贏。" },
    task: { en: "If ⭐ score ≥ 10, the player wins: move to the castle, cheer, say \"You win!\" and stop everything. Then press 🎦 Present and let a friend play!",
      zh: "如果 ⭐ 分數 ≥ 10，玩家就贏了：搬到城堡、歡呼、說「你贏了！」，然後全部停止。最後按「🎦 發表」，請朋友來玩！" },
    goals: [
      goal("⚖️ if ⭐ score ≥ 10", "⚖️ 如果 ⭐ 分數 ≥ 10", (s) => ifVar(bodyOf(s), "score").some((b) => num(b) === 10 && ["ge", "eq"].includes(field(b, "CMP", "eq")))),
      goal("🖼 A winning scene and 🔊 cheer", "🖼 勝利場景和 🔊 歡呼", (s) => ifVar(bodyOf(s), "score")
        .some((b) => find(innerOf(b), "story_background").length > 0 && find(innerOf(b), "story_sound").length > 0)),
      goal("🛑 The game stops when you win", "🛑 贏了之後遊戲停止", (s) => ifVar(bodyOf(s), "score").some((b) => stops(innerOf(b)))),
    ],
  },
];

export const GAME_STEPS = STEPS.map((step, index) => ({
  ...step,
  id: `game-${index + 1}`,
  carry: index > 0,
  starter: index ? game(index) : state(start),
  example: game(index + 1),
}));

export const MY_GAME = {
  id: "my-game",
  title: { en: "My Game", zh: "我的遊戲" },
  idea: { en: "Write the rules first: how do you win, how do you lose, what changes each turn? Then build v0.1 and test with a friend.",
    zh: "先寫規則：怎樣算贏、怎樣算輸、每一輪會改變什麼？再做出 v0.1，請朋友試玩。" },
  task: { en: "Design your own game. Use the checklist, then let a friend play, change one thing they suggest, and press 🎦 Present.",
    zh: "設計你自己的遊戲。照著檢查表做，再請朋友試玩，依照他的建議改一個地方，最後按「🎦 發表」。" },
  goals: [
    goal("💬 Rules explained at the start", "💬 一開始說明規則", (s) => startBody(s).some((b) => says(b))),
    goal("🎮 2 or more game variables", "🎮 至少 2 個遊戲變數", (s) => new Set(find(bodyOf(s), "story_set_var").map(varOf)).size >= 2),
    goal("🎲 Something random", "🎲 有隨機的東西", (s) => bodyOf(s).some((b) => b.type === "story_if_chance" || b.type === "story_random_var"
      || (b.type === "story_goto" && field(b, "SPOT") === "random"))),
    goal("⚖️ A rule that compares a variable", "⚖️ 用比較寫規則", (s) => find(bodyOf(s), "story_if_var").length + find(bodyOf(s), "story_until_var").length > 0),
    goal("🛑 A way for the game to end", "🛑 遊戲有結束的方式", (s) => stops(bodyOf(s))),
    goal("👆 The player can tap something", "👆 玩家可以點東西", (s) => scriptsOf(s, "story_when_clicked", (x) => x.body.length > 0).length > 0),
    CREDIT_GOAL,
  ],
  starter: state(start),
  example: state(
    script(start, say("cat", "Feed the dog before time runs out!", 2), setVar("score", 0), setVar("time", 8), B("story_broadcast", { MSG: "go" })),
    script(clicked("dog"), sound("pop"), changeVar("score", 1), act("story_jump", "dog"),
      B("story_if_chance", { N: "4" }, [say("dog", "Yum! Bonus!", 1), changeVar("score", 2)])),
    script(B("story_when_receive", { MSG: "go" }), B("story_until_var", { VAR: "time", CMP: "eq", N: "0" }, [B("story_wait", { SECONDS: "1" }), changeVar("time", -1)]),
      act("story_say_var", "cat", { VAR: "score" }), stopAll),
  ),
};

export const GAME_TASKS = [...GAME_STEPS, MY_GAME];
