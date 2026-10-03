// Product Studio: build ONE real product (a dragon pet app) version by version, then design your own.
// Each step carries on from the student's previous version, so the product grows like real software.
import {
  B, MOTION, act, actorOf, bodyOf, clickBody, clicked, field, goal, innerOf, say, says, script, scriptsOf, start, startBody, state,
} from "./task-kit.js";

const find = (list, type) => list.filter((b) => b.type === type);
const amount = (b) => Number(field(b, "N", "1"));
const ifScore = (s, n) => find(bodyOf(s), "story_if_score").filter((b) => field(b, "N", "1") === String(n));
const feels = (list, ...moods) => list.some((b) => b.type === "story_feel" && moods.includes(field(b, "FEEL", "happy")));
const loops = (s) => find(startBody(s), "story_forever");

// ---- the dragon pet, version by version (each list is what that version adds) ----
const wait = (n) => B("story_wait", { SECONDS: String(n) });
const score = (n) => B("story_change_score", { N: String(n) });
const sound = (id) => B("story_sound", { SOUND: id });
const v1Start = [act("story_visibility", "dragon", { ACTION: "show" }), say("dragon", "Hi! I'm Drako, your pet dragon!"), B("story_set_score", { N: "5" })];
const v2Feed = [sound("pop"), score(1), act("story_jump", "dragon")];
const v3Feed = [act("story_feel", "dragon", { FEEL: "happy" }), act("story_say_score", "dragon")];
const v5Rule = B("story_if_score", { N: "0" }, [act("story_feel", "dragon", { FEEL: "sad" }), say("dragon", "I'm hungry!")]);
const v7Grow = B("story_if_score", { N: "10" }, [act("story_size", "dragon", { SIZE: "big" }), sound("cheer"),
  B("story_background", { SCENE: "castle" }), say("dragon", "I grew up!")]);
const v8Help = [say("cat", "Tap Drako to feed it. Tap Robot to play!", 3), wait(1)];

const forever = (...body) => B("story_forever", {}, body);
const pet = (v) => {
  const run = [...(v >= 8 ? v8Help : []), ...v1Start];
  if (v >= 4) run.push(forever(wait(3), score(-1), ...(v >= 5 ? [v5Rule] : [])));
  const scripts = [script(start, ...run)];
  if (v >= 2) scripts.push(script(clicked("dragon"), ...v2Feed, ...(v >= 3 ? v3Feed : []), ...(v >= 7 ? [v7Grow] : [])));
  if (v >= 6) {
    scripts.push(script(clicked("robot"), say("robot", "Let's play!", 1), B("story_broadcast", { MSG: "party" })));
    scripts.push(script(B("story_when_receive", { MSG: "party" }), act("story_spin", "dragon"), sound("magic"), score(2)));
  }
  if (v >= 8) scripts.push(script(clicked("dog"), say("dog", "Tip: don't let Drako's score reach 0!", 3)));
  return state(...scripts);
};

const STEPS = [
  {
    title: { en: "v0.1 · Hatch the Pet", zh: "v0.1・寵物孵化了" },
    idea: { en: "Start small: the first version only needs a first screen.", zh: "從小地方開始：第一版只要有開始畫面就好。" },
    task: { en: "We are making a pet app! When the app starts, the dragon appears, says hi, and its ⭐ happiness score starts at 5.",
      zh: "我們要做一個寵物 App！App 一開始，小龍出現、打招呼，⭐ 心情分數從 5 開始。" },
    goals: [
      goal("🎬 when Run: 👀 show the dragon", "🎬 按下執行時：👀 讓小龍出現",
        (s) => startBody(s).some((b) => b.type === "story_visibility" && actorOf(b) === "dragon" && field(b, "ACTION", "show") === "show")),
      goal("The dragon says hello", "小龍打招呼", (s) => startBody(s).some((b) => says(b, "dragon"))),
      goal("⭐ Set the happiness score", "⭐ 設定心情分數", (s) => find(startBody(s), "story_set_score").length > 0),
    ],
  },
  {
    title: { en: "v0.2 · The Feed Button", zh: "v0.2・餵食按鈕" },
    idea: { en: "A product does something when the user taps it.", zh: "使用者點一下，產品就要有反應。" },
    task: { en: "Make the dragon a button: tapping it feeds the pet, so happiness goes up. Make it jump or play a sound so the user knows it worked.",
      zh: "讓小龍變成按鈕：點牠就是餵食，心情分數會上升。讓牠跳一下或發出聲音，使用者才知道有餵到。" },
    goals: [
      goal("👆 when Dragon is clicked", "👆 當小龍被點擊", (s) => clickBody(s, "dragon").length > 0),
      goal("⭐ Feeding raises the score", "⭐ 餵食讓分數上升", (s) => find(clickBody(s, "dragon"), "story_change_score").some((b) => amount(b) > 0)),
      goal("🔊 A sound or a move shows it worked", "🔊 用聲音或動作表示成功",
        (s) => clickBody(s, "dragon").some((b) => b.type === "story_sound" || MOTION.has(b.type))),
    ],
  },
  {
    title: { en: "v0.3 · Show How It Feels", zh: "v0.3・讓人看到心情" },
    idea: { en: "Show the user what changed.", zh: "讓使用者看到什麼改變了。" },
    task: { en: "After eating, the dragon should look happy and tell you its score.",
      zh: "吃完東西，小龍要露出開心的表情，並說出現在的分數。" },
    goals: [
      goal("😊 The dragon feels happy after eating", "😊 吃完後小龍很開心", (s) => feels(clickBody(s, "dragon"), "happy", "love")),
      goal("💬 The dragon says the score", "💬 小龍說出分數", (s) => clickBody(s, "dragon").some((b) => b.type === "story_say_score")),
    ],
  },
  {
    title: { en: "v0.4 · Getting Hungry", zh: "v0.4・肚子會餓" },
    idea: { en: "Good products keep working by themselves.", zh: "好的產品，自己也會持續運作。" },
    task: { en: "A real pet gets hungry. At the end of 🎬 when Run, add ♾️ forever: wait 3 seconds, then the score goes down by 1. Press ▶ Run and feed the dragon to test it.",
      zh: "真的寵物會餓。在「🎬 按下執行時」最後加上「♾️ 一直重複」：等待 3 秒，分數減 1。按 ▶ 執行，再餵小龍測試看看。" },
    goals: [
      goal("♾️ A forever loop in when Run", "♾️ 按下執行時裡有「一直重複」", (s) => loops(s).length > 0),
      goal("⏱ It waits inside the loop", "⏱ 迴圈裡有等待", (s) => loops(s).some((b) => innerOf(b).some((x) => x.type === "story_wait"))),
      goal("⭐ The score goes down (-1)", "⭐ 分數往下掉（-1）",
        (s) => loops(s).some((b) => find(innerOf(b), "story_change_score").some((x) => amount(x) < 0))),
    ],
  },
  {
    title: { en: "v0.5 · Pet Rules", zh: "v0.5・寵物規則" },
    idea: { en: "Rules (if) make a product smart.", zh: "用「如果」寫規則，產品就變聰明了。" },
    task: { en: "When happiness reaches 0, the dragon should feel sad and say it is hungry. Put the rule inside the forever loop so it is checked again and again.",
      zh: "心情分數掉到 0 時，小龍要變難過，並說牠餓了。把規則放進「一直重複」裡，才會一直檢查。" },
    goals: [
      goal("❓ if score = 0 → the dragon feels sad", "❓ 如果分數 = 0 → 小龍難過", (s) => ifScore(s, 0).some((b) => feels(innerOf(b), "sad"))),
      goal("💬 The dragon tells you what is wrong", "💬 小龍說出牠怎麼了", (s) => ifScore(s, 0).some((b) => innerOf(b).some((x) => says(x, "dragon")))),
      goal("The rule is inside ♾️ forever", "規則放在「♾️ 一直重複」裡", (s) => loops(s).some((b) => find(innerOf(b), "story_if_score").length > 0)),
    ],
  },
  {
    title: { en: "v0.6 · A Play Button", zh: "v0.6・玩耍按鈕" },
    idea: { en: "Add features one at a time, and connect them with messages.", zh: "功能一次加一個，用廣播把它們連起來。" },
    task: { en: "Tapping the robot means \"let's play\". The robot sends 📣 party; when the message arrives, the dragon plays and gets +2 happiness.",
      zh: "點機器人代表「來玩吧」。機器人廣播「📣 派對」，收到訊息時，小龍玩耍，心情分數 +2。" },
    goals: [
      goal("👆 Tapping the robot sends a 📣 message", "👆 點機器人會「📣 廣播」", (s) => find(clickBody(s, "robot"), "story_broadcast").length > 0),
      goal("📩 When it arrives, the score goes up", "📩 收到訊息時，分數上升",
        (s) => find(bodyOf(scriptsOf(s, "story_when_receive")), "story_change_score").some((b) => amount(b) > 0)),
      goal("The dragon moves to play", "小龍動起來玩耍",
        (s) => bodyOf(scriptsOf(s, "story_when_receive")).some((b) => MOTION.has(b.type) && actorOf(b) === "dragon")),
    ],
  },
  {
    title: { en: "v0.7 · Growing Up", zh: "v0.7・長大了" },
    idea: { en: "Give users a goal to reach.", zh: "給使用者一個可以達成的目標。" },
    task: { en: "When happiness reaches 10, the dragon grows up! Make it grow big, move to the castle, and celebrate.",
      zh: "心情分數到 10，小龍就長大了！讓牠變大、搬到城堡，再來一點慶祝。" },
    goals: [
      goal("❓ if score = 10 → the dragon grows big", "❓ 如果分數 = 10 → 小龍變大",
        (s) => ifScore(s, 10).some((b) => innerOf(b).some((x) => x.type === "story_size" && field(x, "SIZE", "big") === "big"))),
      goal("🖼 It moves to a new scene", "🖼 換到新場景", (s) => ifScore(s, 10).some((b) => find(innerOf(b), "story_background").length > 0)),
      goal("🔊 A celebration sound", "🔊 慶祝的聲音", (s) => ifScore(s, 10).some((b) => find(innerOf(b), "story_sound").length > 0)),
    ],
  },
  {
    title: { en: "v1.0 · Launch Day", zh: "v1.0・正式上線" },
    idea: { en: "Test with a friend: if they don't know what to do, add help.", zh: "請朋友試用：他不知道怎麼玩，就加上說明。" },
    task: { en: "A friend tried the app and asked \"what do I do?\" Add instructions at the start, and a help button: tapping the dog gives a tip. Then press 🎦 Present!",
      zh: "朋友試玩時問：「我要做什麼？」在開頭加上說明，再做一個求助按鈕：點小狗會給提示。最後按「🎦 發表」！" },
    goals: [
      goal("💬 when Run: a helper explains how to use it", "💬 按下執行時：有角色說明怎麼玩",
        (s) => startBody(s).some((b) => says(b) && actorOf(b) !== "dragon")),
      goal("👆 Help button: tapping the dog gives a tip", "👆 求助按鈕：點小狗會給提示", (s) => clickBody(s, "dog").some((b) => says(b, "dog"))),
    ],
  },
];

export const PRODUCT_STEPS = STEPS.map((step, index) => ({
  ...step,
  id: `pet-${index + 1}`,
  carry: index > 0,
  starter: index ? pet(index) : state(start),
  example: pet(index + 1),
}));

// The capstone: students design their own product with the same building blocks.
export const MY_PRODUCT = {
  id: "my-product",
  title: { en: "My Product", zh: "我的產品" },
  idea: { en: "Who is it for? What problem does it solve? Draw it first, build v0.1, then add one feature at a time.",
    zh: "給誰用？解決什麼問題？先畫出來，做出 v0.1，再一次加一個功能。" },
  task: { en: "Design your own app or game: a pet, a quiz, a shop, a clicker game… Use the checklist to make it a real product, then press 🎦 Present.",
    zh: "設計你自己的 App 或遊戲：寵物、問答、商店、點擊遊戲……用檢查表把它做成真正的產品，最後按「🎦 發表」。" },
  goals: [
    goal("💬 Instructions when it starts", "💬 一開始有使用說明", (s) => startBody(s).some((b) => says(b))),
    goal("⭐ A score that starts at a number", "⭐ 分數有起始值", (s) => find(startBody(s), "story_set_score").length > 0),
    goal("👆 2 or more buttons (clickable characters)", "👆 2 個以上的按鈕（可以點的角色）",
      (s) => new Set(scriptsOf(s, "story_when_clicked", (x) => x.body.length > 0).map(actorOf)).size >= 2),
    goal("❓ A rule: if score = …", "❓ 規則：如果分數 = …", (s) => find(bodyOf(s), "story_if_score").length > 0),
    goal("♾️ Something happens by itself (forever)", "♾️ 有東西會自己動（一直重複）", (s) => find(bodyOf(s), "story_forever").length > 0),
    goal("📣 A message connects two parts", "📣 用廣播連接兩個部分", (s) => {
      const sent = new Set(find(bodyOf(s), "story_broadcast").map((b) => field(b, "MSG", "go")));
      return scriptsOf(s, "story_when_receive", (x) => sent.has(field(x, "MSG", "go")) && x.body.length > 0).length > 0;
    }),
  ],
  starter: state(start),
  example: state(
    script(start, say("robot", "Tap the dragon 5 times before it escapes!", 3), B("story_set_score", { N: "0" }),
      act("story_visibility", "dragon", { ACTION: "show" }), forever(wait(1), act("story_goto", "dragon", { SPOT: "random" }))),
    script(clicked("dragon"), sound("pop"), score(1), B("story_if_score", { N: "5" }, [B("story_broadcast", { MSG: "theEnd" })])),
    script(clicked("dog"), say("dog", "Hint: watch where the dragon lands!", 2)),
    script(B("story_when_receive", { MSG: "theEnd" }), B("story_background", { SCENE: "space" }), sound("cheer"), say("robot", "You win!")),
  ),
};

export const PRODUCT_TASKS = [...PRODUCT_STEPS, MY_PRODUCT];
