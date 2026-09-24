// Story Lab challenges. Goals are checked live against the workspace JSON, so kids see ✓ as they build.
const HATS = new Set(["story_start", "story_when_clicked", "story_when_receive"]);
const MOTION = new Set(["story_move", "story_jump", "story_spin", "story_turn", "story_goto"]);
const DEFAULT_WORDS = new Set(["Hello!", "你好！"]);

// ---- tiny builders for starter code and examples ----
const chainOf = (list) => list.reduceRight((next, block) => (next ? { ...block, next: { block: next } } : block), null);
const B = (type, fields = {}, body) => (body ? { type, fields, inputs: { DO: { block: chainOf(body) } } } : { type, fields });
const script = (hat, ...body) => (body.length ? { ...hat, next: { block: chainOf(body) } } : hat);
const state = (...scripts) => ({ blocks: { languageVersion: 0, blocks: scripts.map((s, i) => ({ ...s, x: 24, y: 24 + i * 200 })) } });
const start = B("story_start");
const clicked = (actor) => B("story_when_clicked", { ACTOR: actor });
const say = (actor, text, seconds = 2) => B("story_say", { ACTOR: actor, TEXT: text, SECONDS: String(seconds) });
const act = (type, actor, fields = {}) => B(type, { ACTOR: actor, ...fields });

// ---- reading a workspace ----
function flatten(block, out = []) {
  while (block) {
    out.push(block);
    if (block.inputs?.DO?.block) flatten(block.inputs.DO.block, out);
    block = block.next?.block;
  }
  return out;
}

export function analyze(saved) {
  const tops = saved?.blocks?.blocks ?? [];
  return tops.filter((b) => HATS.has(b.type)).map((hat) => ({ type: hat.type, fields: hat.fields ?? {}, body: flatten(hat.next?.block) }));
}

const field = (block, name, fallback) => block.fields?.[name] ?? fallback;
const actorOf = (block) => field(block, "ACTOR", "cat");
const scriptsOf = (scripts, type, test = () => true) => scripts.filter((s) => s.type === type && test(s));
const bodyOf = (list) => list.flatMap((s) => s.body);
const says = (block, actor) => block.type === "story_say" && (!actor || actorOf(block) === actor);
const innerOf = (block) => flatten(block.inputs?.DO?.block);
const startBody = (scripts) => bodyOf(scriptsOf(scripts, "story_start"));
const clickBody = (scripts, actor) => bodyOf(scriptsOf(scripts, "story_when_clicked", (s) => actorOf(s) === actor));
const goal = (en, zh, test) => ({ text: { en, zh }, test });

export const CHALLENGES = [
  {
    id: "hello",
    title: { en: "Hello, Stage!", zh: "舞台你好！" },
    task: { en: "Every story starts with an event. Put a 💬 say block under 🎬 when Run so the cat greets the audience.",
      zh: "每個故事都從一個事件開始。在「🎬 按下執行時」下面放一個「💬 說」，讓小貓跟觀眾打招呼。" },
    goals: [
      goal("Start with 🎬 when Run", "用「🎬 按下執行時」開始", (s) => startBody(s).length > 0),
      goal("The cat says something", "小貓說一句話", (s) => startBody(s).some((b) => says(b, "cat"))),
      goal("Write your own words (tap the text)", "改成你自己的話（點文字修改）",
        (s) => startBody(s).some((b) => says(b) && !DEFAULT_WORDS.has(field(b, "TEXT", "Hello!")))),
    ],
    starter: state(start),
    example: state(script(start, say("cat", "Hi! I'm Kit the cat."))),
  },
  {
    id: "turns",
    title: { en: "Take Turns", zh: "輪流說話" },
    task: { en: "The cat and the dog have a conversation. Use ⏱ wait so they take turns instead of talking at once.",
      zh: "小貓和小狗在聊天。用「⏱ 等待」讓牠們輪流說話，不要同時開口。" },
    goals: [
      goal("The cat talks first", "小貓先說話", (s) => says(startBody(s)[0] ?? {}, "cat")),
      goal("⏱ wait, then the dog answers", "⏱ 等待，然後小狗回答", (s) => {
        const body = startBody(s);
        const w = body.findIndex((b) => b.type === "story_wait");
        return w > 0 && body.slice(w).some((b) => says(b, "dog"));
      }),
      goal("At least 3 lines of talking", "至少說 3 句話", (s) => startBody(s).filter((b) => says(b)).length >= 3),
    ],
    starter: state(script(start, say("cat", "Hi, Dog!"))),
    example: state(script(start, say("cat", "Hi, Dog!"), B("story_wait", { SECONDS: "1" }),
      say("dog", "Hi, Cat! Want to play?"), B("story_wait", { SECONDS: "1" }), say("cat", "Yes! Let's go!"))),
  },
  {
    id: "click",
    title: { en: "Click Me!", zh: "點我！" },
    task: { en: "Stories can react to the audience. Add 👆 when Dog is clicked, then tap the dog on the stage to test it.",
      zh: "故事可以回應觀眾。加上「👆 當小狗被點擊」，然後點舞台上的小狗試試看。" },
    goals: [
      goal("Use 👆 when Dog is clicked", "使用「👆 當小狗被點擊」", (s) => scriptsOf(s, "story_when_clicked", (x) => actorOf(x) === "dog").length > 0),
      goal("The dog says something when clicked", "被點擊時小狗說話", (s) => clickBody(s, "dog").some((b) => says(b, "dog"))),
      goal("Add a 🔊 sound", "加上「🔊 聲音」", (s) => clickBody(s, "dog").some((b) => b.type === "story_sound")),
    ],
    starter: state(start),
    example: state(script(clicked("dog"), B("story_sound", { SOUND: "pop" }), say("dog", "Woof woof!", 1), act("story_jump", "dog"))),
  },
  {
    id: "dance",
    title: { en: "Dance Party", zh: "機器人跳舞" },
    task: { en: "Tap the robot to make it dance! Put dance moves inside 🔁 repeat so they happen again and again.",
      zh: "點機器人讓它跳舞！把舞步放進「🔁 重複」裡，讓動作一直重複。" },
    goals: [
      goal("Use 👆 when Robot is clicked", "使用「👆 當機器人被點擊」", (s) => scriptsOf(s, "story_when_clicked", (x) => actorOf(x) === "robot").length > 0),
      goal("Use 🔁 repeat", "使用「🔁 重複」", (s) => clickBody(s, "robot").some((b) => b.type === "story_repeat")),
      goal("2 or more dance moves inside the repeat", "重複裡至少有 2 個動作",
        (s) => clickBody(s, "robot").some((b) => b.type === "story_repeat" && innerOf(b).filter((x) => MOTION.has(x.type)).length >= 2)),
    ],
    starter: state(clicked("robot")),
    example: state(script(clicked("robot"), B("story_sound", { SOUND: "drum" }),
      B("story_repeat", { TIMES: "3" }, [act("story_jump", "robot"), act("story_spin", "robot")]), act("story_feel", "robot", { FEEL: "happy" }))),
  },
  {
    id: "trip",
    title: { en: "Let's Go on a Trip", zh: "出發去旅行" },
    task: { en: "Take the characters somewhere new! Switch the scene at least 2 times so the story has a beginning, middle and end.",
      zh: "帶角色去新的地方！至少換 2 次場景，讓故事有開頭、中間和結尾。" },
    goals: [
      goal("Switch the scene 2 or more times", "換場景 2 次以上",
        (s) => new Set(startBody(s).filter((b) => b.type === "story_background").map((b) => field(b, "SCENE", "home"))).size >= 2),
      goal("Someone talks in every new scene", "每個新場景都有人說話", (s) => {
        const body = startBody(s);
        const cuts = body.map((b, i) => (b.type === "story_background" ? i : -1)).filter((i) => i >= 0);
        return cuts.length > 0 && cuts.every((c, k) => body.slice(c, cuts[k + 1] ?? body.length).some((b) => says(b)));
      }),
      goal("A character walks or moves", "有角色走路或移動", (s) => startBody(s).some((b) => MOTION.has(b.type))),
    ],
    starter: state(script(start, say("cat", "Let's go on a trip!"))),
    example: state(script(start, say("cat", "Let's go on a trip!"), act("story_move", "cat", { DIR: "left", DIST: "1" }),
      B("story_background", { SCENE: "beach" }), say("dog", "The water is so blue!"),
      B("story_background", { SCENE: "space" }), say("robot", "Now we are in space!"), act("story_spin", "robot"))),
  },
  {
    id: "dragon",
    title: { en: "Here Comes the Dragon", zh: "小龍登場" },
    task: { en: "The dragon is hiding off-stage. Make it appear with a surprise: show it, let it talk, and make someone feel surprised.",
      zh: "小龍躲在舞台外面。讓牠驚喜登場：讓牠出現、說話，並讓其他角色覺得驚訝。" },
    goals: [
      goal("👀 Show the dragon", "👀 讓小龍出現",
        (s) => bodyOf(s).some((b) => b.type === "story_visibility" && actorOf(b) === "dragon" && field(b, "ACTION", "show") === "show")),
      goal("The dragon says something", "小龍說一句話", (s) => bodyOf(s).some((b) => says(b, "dragon"))),
      goal("Someone feels 😮 surprised", "有角色覺得 😮 驚訝", (s) => bodyOf(s).some((b) => b.type === "story_feel" && field(b, "FEEL") === "surprised")),
    ],
    starter: state(start),
    example: state(script(start, B("story_wait", { SECONDS: "1" }), B("story_sound", { SOUND: "magic" }),
      act("story_visibility", "dragon", { ACTION: "show" }), say("dragon", "Surprise! I'm Drake!"),
      act("story_feel", "cat", { FEEL: "surprised" }), act("story_feel", "dog", { FEEL: "surprised" }))),
  },
  {
    id: "messages",
    title: { en: "Send a Message", zh: "廣播訊息" },
    task: { en: "One character can tell everyone what to do. When you tap the cat, it sends 🎉 party — and everyone who receives it dances at the same time!",
      zh: "一個角色可以通知大家。點小貓時，牠廣播「🎉 派對」，收到訊息的角色會同時一起跳舞！" },
    goals: [
      goal("When the cat is clicked, 📣 send a message", "小貓被點擊時「📣 廣播」訊息", (s) => clickBody(s, "cat").some((b) => b.type === "story_broadcast")),
      goal("Use 📩 when I receive the same message", "用「📩 當收到」同一個訊息", (s) => {
        const sent = new Set(bodyOf(s).filter((b) => b.type === "story_broadcast").map((b) => field(b, "MSG", "go")));
        return scriptsOf(s, "story_when_receive", (x) => sent.has(field(x, "MSG", "go")) && x.body.length > 0).length > 0;
      }),
      goal("2 or more characters react", "至少 2 個角色有反應",
        (s) => new Set(bodyOf(scriptsOf(s, "story_when_receive")).filter((b) => b.fields?.ACTOR).map(actorOf)).size >= 2),
    ],
    starter: state(clicked("cat")),
    example: state(
      script(clicked("cat"), say("cat", "Party time!", 1), B("story_broadcast", { MSG: "party" })),
      script(B("story_when_receive", { MSG: "party" }), act("story_jump", "dog"), act("story_spin", "dog")),
      script(B("story_when_receive", { MSG: "party" }), act("story_spin", "robot"), act("story_jump", "robot")),
    ),
  },
  {
    id: "game",
    title: { en: "Catch the Dragon (a game!)", zh: "抓小龍（做遊戲！）" },
    task: { en: "Make a game! Each tap on the dragon scores a point and the dragon runs to a random spot. At 5 points, say “You win!”",
      zh: "做一個遊戲！每點到小龍一次得 1 分，小龍會跑到隨機位置。得到 5 分時說「你贏了！」" },
    goals: [
      goal("🎬 when Run: set the score to 0 and show the dragon", "按下執行時：分數設為 0，並讓小龍出現", (s) => {
        const body = startBody(s);
        return body.some((b) => b.type === "story_set_score" && field(b, "N", "0") === "0") &&
          body.some((b) => b.type === "story_visibility" && actorOf(b) === "dragon" && field(b, "ACTION", "show") === "show");
      }),
      goal("👆 Tapping the dragon changes the score", "點小龍會改變分數", (s) => clickBody(s, "dragon").some((b) => b.type === "story_change_score")),
      goal("The dragon runs to a 🎲 random spot", "小龍跑到 🎲 隨機位置",
        (s) => clickBody(s, "dragon").some((b) => b.type === "story_goto" && field(b, "SPOT", "left") === "random")),
      goal("⭐ if score = 5 → someone says something", "⭐ 如果分數 = 5 → 有人說話",
        (s) => bodyOf(s).some((b) => b.type === "story_if_score" && field(b, "N", "1") === "5" && innerOf(b).some((x) => says(x)))),
    ],
    starter: state(start, clicked("dragon")),
    example: state(
      script(start, B("story_set_score", { N: "0" }), act("story_visibility", "dragon", { ACTION: "show" }), say("dragon", "Catch me if you can!", 1)),
      script(clicked("dragon"), B("story_sound", { SOUND: "pop" }), B("story_change_score", { N: "1" }),
        act("story_goto", "dragon", { SPOT: "random" }),
        B("story_if_score", { N: "5" }, [B("story_sound", { SOUND: "cheer" }), say("dragon", "You win!")])),
    ),
  },
];

// The capstone: free creation, with the course rubric as a live checklist.
export const MY_STORY = {
  id: "mine",
  title: { en: "My Story", zh: "我的故事" },
  task: { en: "Your turn! Plan it first (beginning, middle, end), then build it. Use the checklist to make it great, then press 🎦 Present.",
    zh: "換你創作！先規劃（開頭、中間、結尾），再動手做。用檢查表讓作品更完整，最後按「🎦 發表」。" },
  goals: [
    goal("🎬 A “when Run” event", "🎬「按下執行時」事件", (s) => startBody(s).length > 0),
    goal("👆 A click event with code", "👆 有程式的「當被點擊」事件", (s) => scriptsOf(s, "story_when_clicked", (x) => x.body.length > 0).length > 0),
    goal("💬 3 or more lines of dialogue", "💬 至少 3 句對話", (s) => bodyOf(s).filter((b) => says(b)).length >= 3),
    goal("⏱ Characters take turns (wait)", "⏱ 角色輪流（等待）", (s) => bodyOf(s).some((b) => b.type === "story_wait")),
    goal("🔁 A repeat loop", "🔁 使用重複", (s) => bodyOf(s).some((b) => b.type === "story_repeat" || b.type === "story_forever")),
    goal("🖼 2 or more scenes", "🖼 至少 2 個場景", (s) => bodyOf(s).filter((b) => b.type === "story_background").length >= 2),
  ],
  starter: state(start),
  example: state(
    script(start, say("cat", "Today is Dog's birthday!"), B("story_wait", { SECONDS: "1" }), say("robot", "Let's find a present!"),
      B("story_background", { SCENE: "beach" }), act("story_move", "cat", { DIR: "right", DIST: "3" }), say("cat", "A shiny shell!"),
      B("story_background", { SCENE: "home" }), say("dog", "Thank you, friends!"), act("story_feel", "dog", { FEEL: "love" })),
    script(clicked("dog"), B("story_sound", { SOUND: "cheer" }), B("story_repeat", { TIMES: "2" }, [act("story_jump", "dog")])),
  ),
};

export const ALL_STORY_TASKS = [...CHALLENGES, MY_STORY];

export function checkGoals(task, saved) {
  const scripts = analyze(saved);
  return task.goals.map((g) => Boolean(g.test(scripts)));
}
