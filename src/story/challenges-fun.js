// Story Lab challenges 9–16: short, funny projects that each practise one idea from 1–8 again
// (events, messages, loops, randomness), before students build their own story.
import { B, act, actorOf, bodyOf, clickBody, clicked, field, goal, innerOf, say, says, script, scriptsOf, start, startBody, state } from "./task-kit.js";

const sound = (id) => B("story_sound", { SOUND: id });
const scene = (id) => B("story_background", { SCENE: id });
const wait = (s) => B("story_wait", { SECONDS: String(s) });
const show = (actor) => act("story_visibility", actor, { ACTION: "show" });
const hide = (actor) => act("story_visibility", actor, { ACTION: "hide" });
const receive = (msg) => B("story_when_receive", { MSG: msg });
const send = (msg) => B("story_broadcast", { MSG: msg });
const MOTION = new Set(["story_move", "story_jump", "story_spin", "story_turn", "story_goto"]);
const has = (list, type, test = () => true) => list.some((b) => b.type === type && test(b));
const sentMessages = (s) => new Set(bodyOf(s).filter((b) => b.type === "story_broadcast").map((b) => field(b, "MSG", "go")));
const receiveBody = (s, msgs) => bodyOf(scriptsOf(s, "story_when_receive", (x) => !msgs || msgs.has(field(x, "MSG", "go"))));
const visibility = (b, actor, action) => b.type === "story_visibility" && actorOf(b) === actor && field(b, "ACTION", "show") === action;
const foreverBody = (s) => bodyOf(s).filter((b) => b.type === "story_forever").flatMap(innerOf);

export const FUN_CHALLENGES = [
  {
    id: "joke",
    title: { en: "Knock-Knock Joke", zh: "敲門笑話" },
    task: { en: "Tap the dog to start a knock-knock joke. The dog sends a message, and the cat answers when it receives it. Make it funny!",
      zh: "點小狗開始講「叩叩叩」笑話。小狗廣播一個訊息，小貓收到後回答。讓它好笑一點！" },
    goals: [
      goal("👆 Tapping the dog makes it say \"Knock knock!\"", "👆 點小狗，牠說「叩叩叩！」", (s) => clickBody(s, "dog").some((b) => says(b, "dog"))),
      goal("📣 The dog sends a message", "📣 小狗廣播一個訊息", (s) => has(clickBody(s, "dog"), "story_broadcast")),
      goal("📩 The cat answers when it receives it", "📩 小貓收到訊息後回答", (s) => receiveBody(s, sentMessages(s)).some((b) => says(b, "cat"))),
      goal("😂 4 or more lines in the joke", "😂 笑話至少 4 句", (s) => bodyOf(s).filter((b) => says(b)).length >= 4),
    ],
    starter: state(clicked("dog")),
    example: state(
      script(clicked("dog"), say("dog", "Knock knock!", 1), send("go")),
      script(receive("go"), say("cat", "Who's there?", 1), say("dog", "Lettuce.", 1), say("cat", "Lettuce who?", 1),
        say("dog", "Lettuce in, it's cold out here!", 2), sound("boing"), act("story_feel", "cat", { FEEL: "happy" })),
    ),
  },
  {
    id: "band",
    title: { en: "Animal Band", zh: "動物樂團" },
    task: { en: "Turn the stage into a band! Give 3 characters their own 👆 click script with a different sound and a dance move. Then tap them to play a song.",
      zh: "把舞台變成樂團！讓 3 個角色各有自己的「👆 當被點擊」：不同的聲音加一個舞步。然後點它們來演奏！" },
    goals: [
      goal("🎸 3 characters play a sound when tapped", "🎸 3 個角色被點擊時會發出聲音",
        (s) => new Set(scriptsOf(s, "story_when_clicked", (x) => has(x.body, "story_sound")).map(actorOf)).size >= 3),
      goal("🎵 Each one has a different sound", "🎵 每個角色的聲音都不一樣",
        (s) => new Set(scriptsOf(s, "story_when_clicked").flatMap((x) => x.body.filter((b) => b.type === "story_sound").map((b) => field(b, "SOUND", "pop")))).size >= 3),
      goal("💃 Every player also moves", "💃 每個演奏者也會動",
        (s) => scriptsOf(s, "story_when_clicked", (x) => has(x.body, "story_sound")).length >= 3
          && scriptsOf(s, "story_when_clicked", (x) => has(x.body, "story_sound")).every((x) => x.body.some((b) => MOTION.has(b.type)))),
    ],
    starter: state(script(start, say("robot", "Tap us to make music!", 2))),
    example: state(
      script(start, scene("theater"), say("robot", "Tap us to make music!", 2)),
      script(clicked("cat"), sound("meow"), act("story_jump", "cat")),
      script(clicked("dog"), sound("woof"), act("story_spin", "dog")),
      script(clicked("robot"), sound("beep"), act("story_jump", "robot"), act("story_turn", "robot")),
    ),
  },
  {
    id: "magic",
    title: { en: "The Magic Show", zh: "魔術秀" },
    task: { en: "The robot is a magician! On the theater stage, make the cat vanish and come back, then make it grow. Abracadabra!",
      zh: "機器人是魔術師！在劇場舞台上，讓小貓消失再出現，然後變大。阿布拉卡達布拉！" },
    goals: [
      goal("🎭 Switch to the theater", "🎭 換到劇場", (s) => has(startBody(s), "story_background", (b) => field(b, "SCENE", "home") === "theater")),
      goal("🪄 Play the magic sound", "🪄 播放魔法音效", (s) => has(bodyOf(s), "story_sound", (b) => field(b, "SOUND", "pop") === "magic")),
      goal("👻 Someone vanishes and then comes back", "👻 有角色消失，然後又出現", (s) => {
        const body = startBody(s);
        return body.some((b, i) => b.fields?.ACTOR && visibility(b, actorOf(b), "hide") && body.slice(i + 1).some((c) => visibility(c, actorOf(b), "show")));
      }),
      goal("🔍 Someone changes size", "🔍 有角色變大或變小", (s) => has(bodyOf(s), "story_size")),
    ],
    starter: state(script(start, say("robot", "Welcome to the magic show!", 2))),
    example: state(script(start, scene("theater"), say("robot", "Welcome to the magic show!", 2), say("robot", "Abracadabra!", 1),
      sound("magic"), hide("cat"), wait(1), sound("magic"), show("cat"), act("story_size", "cat", { SIZE: "big" }),
      sound("tada"), say("cat", "Ta-da! I'm a BIG cat!", 2))),
  },
  {
    id: "hide",
    title: { en: "Hide and Seek", zh: "捉迷藏" },
    task: { en: "The dragon pops up in a random spot, then hides again — forever! Tap it before it hides to score. At 5 points, celebrate!",
      zh: "小龍會在隨機位置冒出來，然後又躲起來，一直重複！趁牠躲起來前點牠就得分。得到 5 分時慶祝！" },
    goals: [
      goal("♾️ Forever: the dragon pops up at a 🎲 random spot", "♾️ 一直重複：小龍在 🎲 隨機位置冒出來",
        (s) => foreverBody(s).some((b) => b.type === "story_goto" && actorOf(b) === "dragon" && field(b, "SPOT", "left") === "random")
          && foreverBody(s).some((b) => visibility(b, "dragon", "show"))),
      goal("🙈 …waits, then hides again", "🙈 ……等一下，再躲起來",
        (s) => has(foreverBody(s), "story_wait") && foreverBody(s).some((b) => visibility(b, "dragon", "hide"))),
      goal("👆 Tapping the dragon scores a point", "👆 點到小龍就得分", (s) => has(clickBody(s, "dragon"), "story_change_score")),
      goal("⭐ At 5 points, someone celebrates", "⭐ 5 分時有人慶祝",
        (s) => bodyOf(s).some((b) => b.type === "story_if_score" && field(b, "N", "1") === "5" && innerOf(b).some((x) => says(x) || x.type === "story_sound"))),
    ],
    starter: state(start, clicked("dragon")),
    example: state(
      script(start, B("story_set_score", { N: "0" }), scene("park"), say("cat", "Find the dragon!", 1),
        B("story_forever", {}, [act("story_goto", "dragon", { SPOT: "random" }), show("dragon"), wait(1), hide("dragon"), wait(0.5)])),
      script(clicked("dragon"), sound("pop"), B("story_change_score", { N: "1" }), say("dragon", "You found me!", 1),
        B("story_if_score", { N: "5" }, [sound("cheer"), say("cat", "You win!", 2)])),
    ),
  },
  {
    id: "daynight",
    title: { en: "Day and Night", zh: "白天黑夜" },
    task: { en: "Make time go round and round: morning in the park, night in space, again and again. The cat wakes up happy and gets sleepy at night.",
      zh: "讓時間一直轉：早上在公園，晚上在太空，一直重複。小貓早上很開心，晚上想睡覺。" },
    goals: [
      goal("♾️ Use ♾️ forever", "♾️ 使用「一直重複」", (s) => has(bodyOf(s), "story_forever")),
      goal("🖼 Two different scenes inside the loop", "🖼 迴圈裡有兩個不同的場景",
        (s) => new Set(foreverBody(s).filter((b) => b.type === "story_background").map((b) => field(b, "SCENE", "home"))).size >= 2),
      goal("⏱ A wait so each part of the day lasts", "⏱ 用等待讓白天和晚上維持一下", (s) => has(foreverBody(s), "story_wait")),
      goal("😴 Someone gets sleepy", "😴 有角色想睡覺", (s) => has(foreverBody(s), "story_feel", (b) => field(b, "FEEL", "happy") === "sleepy")),
    ],
    starter: state(script(start, scene("park"))),
    example: state(script(start, B("story_forever", {}, [
      scene("park"), act("story_feel", "cat", { FEEL: "happy" }), say("cat", "Good morning!", 1), wait(1),
      scene("space"), act("story_feel", "cat", { FEEL: "sleepy" }), B("story_think", { ACTOR: "cat", TEXT: "Zzz…", SECONDS: "1" }), wait(1),
    ]))),
  },
  {
    id: "race",
    title: { en: "The Big Race", zh: "賽跑大賽" },
    task: { en: "The robot shouts \"Go!\" and sends 🚀 go. The cat and the dog both receive it and run at the same time — but at different speeds!",
      zh: "機器人喊「開始！」並廣播「🚀 出發」。小貓和小狗同時收到，一起開跑，但速度不一樣！" },
    goals: [
      goal("📣 When Run, someone shouts and sends a message", "📣 按下執行時，有人喊話並廣播訊息",
        (s) => startBody(s).some((b) => says(b)) && has(startBody(s), "story_broadcast")),
      goal("🏃 2 runners receive it and walk inside a 🔁 repeat", "🏃 2 位跑者收到訊息，在「🔁 重複」裡走路",
        (s) => new Set(scriptsOf(s, "story_when_receive").filter((x) => x.body.some((b) => b.type === "story_repeat"
          && innerOf(b).some((c) => c.type === "story_move"))).flatMap((x) => x.body.filter((b) => b.type === "story_repeat")
          .flatMap(innerOf).filter((c) => c.type === "story_move").map(actorOf))).size >= 2),
      goal("🏆 Someone says who won", "🏆 有人說出誰贏了", (s) => receiveBody(s).some((b) => says(b))),
    ],
    starter: state(script(start, say("robot", "Ready… set…", 1))),
    example: state(
      script(start, say("robot", "Ready… set…", 1), say("robot", "GO!", 1), send("go")),
      script(receive("go"), B("story_repeat", { TIMES: "4" }, [act("story_move", "cat", { DIR: "right", DIST: "1" })]), sound("tada"), say("cat", "I win!", 2)),
      script(receive("go"), B("story_repeat", { TIMES: "4" }, [act("story_move", "dog", { DIR: "right", DIST: "1" }), wait(0.5)]), say("dog", "Wait for me!", 2)),
    ),
  },
  {
    id: "fortune",
    title: { en: "Fortune-Telling Robot", zh: "算命機器人" },
    task: { en: "Tap the robot for a fortune. Use 🎲 \"if a 1 in … chance\" so the answer is different almost every time. Tap again and again!",
      zh: "點機器人來算命。用「🎲 如果 … 次裡中 1 次」，讓答案幾乎每次都不一樣。一直點看看！" },
    goals: [
      goal("👆 Tap the robot to ask", "👆 點機器人來問問題", (s) => clickBody(s, "robot").length > 0),
      goal("🎲 Use \"if a 1 in … chance\"", "🎲 使用「如果 … 次裡中 1 次」", (s) => has(clickBody(s, "robot"), "story_if_chance")),
      goal("🔮 2 or more different fortunes", "🔮 至少 2 種不同的答案",
        (s) => new Set(clickBody(s, "robot").filter((b) => says(b)).map((b) => field(b, "TEXT", ""))).size >= 2),
    ],
    starter: state(clicked("robot")),
    example: state(script(clicked("robot"), B("story_think", { ACTOR: "robot", TEXT: "Hmm, let me see…", SECONDS: "1" }), sound("magic"),
      B("story_if_chance", { N: "2" }, [say("robot", "Lucky day! 🍀", 2)]),
      B("story_if_chance", { N: "3" }, [say("robot", "You will find a cookie! 🍪", 2)]),
      say("robot", "Come back tomorrow!", 1))),
  },
  {
    id: "party",
    title: { en: "Surprise Party!", zh: "驚喜派對！" },
    task: { en: "Boss challenge! Everyone hides for the dragon's birthday. When you tap the dragon it sends 🎉 party — and everyone jumps out to say SURPRISE!",
      zh: "魔王挑戰！大家為小龍的生日躲起來。點小龍時牠廣播「🎉 派對」，所有人跳出來大喊「驚喜！」" },
    goals: [
      goal("🙈 When Run: 2+ friends hide and the dragon shows", "🙈 按下執行時：至少 2 位朋友躲起來，小龍出現",
        (s) => new Set(startBody(s).filter((b) => b.type === "story_visibility" && field(b, "ACTION", "show") === "hide").map(actorOf)).size >= 2
          && startBody(s).some((b) => visibility(b, "dragon", "show"))),
      goal("👆 Tapping the dragon sends 🎉 party", "👆 點小龍會廣播「🎉 派對」",
        (s) => has(clickBody(s, "dragon"), "story_broadcast", (b) => field(b, "MSG", "go") === "party")),
      goal("📩 When they receive it, 2+ friends show up", "📩 收到訊息時，至少 2 位朋友出現",
        (s) => new Set(receiveBody(s, new Set(["party"])).filter((b) => b.type === "story_visibility" && field(b, "ACTION", "show") === "show").map(actorOf)).size >= 2),
      goal("🎉 A cheer and a \"Surprise!\"", "🎉 歡呼聲加上一句「驚喜！」",
        (s) => has(receiveBody(s, new Set(["party"])), "story_sound", (b) => field(b, "SOUND", "pop") === "cheer") && receiveBody(s, new Set(["party"])).some((b) => says(b))),
    ],
    starter: state(start, clicked("dragon")),
    example: state(
      script(start, scene("home"), hide("cat"), hide("dog"), hide("robot"), show("dragon"), say("dragon", "Hello? Is anyone home?", 2)),
      script(clicked("dragon"), send("party")),
      script(receive("party"), show("cat"), show("dog"), show("robot"), sound("cheer"), say("cat", "SURPRISE! Happy birthday!", 2),
        B("story_repeat", { TIMES: "2" }, [act("story_jump", "dog"), act("story_spin", "robot")]), act("story_feel", "dragon", { FEEL: "love" })),
    ),
  },
];
