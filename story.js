import { createQuickAdd } from "./src/quest/quick-add.js";

const STORAGE_KEY = "blocky-easy-story-lab-v1";

const actors = {
  cat: document.querySelector("#actor-cat"),
  dog: document.querySelector("#actor-dog"),
  robot: document.querySelector("#actor-robot"),
};
const stage = document.querySelector("#stage");
const sceneLabel = document.querySelector("#sceneLabel");
const status = document.querySelector("#status");
const blockCount = document.querySelector("#blockCount");
const runBtn = document.querySelector("#runBtn");

const initialLeft = { cat: 12, dog: 34, robot: 54 };
const positions = { ...initialLeft };
const scenes = {
  home: "🏠 家裡 Home",
  forest: "🌲 森林 Forest",
  castle: "🏰 城堡 Castle",
  space: "🚀 太空 Space",
};

Blockly.defineBlocksWithJsonArray([
  { type:"story_start", message0:"🎬 故事開始 when start", nextStatement:null, colour:255, tooltip:"故事的起點" },
  { type:"story_say", message0:"%1 說 %2 %3 秒", args0:[
    { type:"field_dropdown", name:"ACTOR", options:[["🐱 Cat","cat"],["🐶 Dog","dog"],["🤖 Robot","robot"]] },
    { type:"field_dropdown", name:"LINE", options:[
      ["我要去找寶藏！","我要去找寶藏！"],["I want to find the treasure!","I want to find the treasure!"],
      ["寶藏在哪裡？","寶藏在哪裡？"],["Where is the treasure?","Where is the treasure?"],
      ["寶藏在大樹旁！","寶藏在大樹旁！"],["Go to the big tree!","Go to the big tree!"],
      ["找到啦！","找到啦！"],["I found it!","I found it!"],
      ["汪汪！","汪汪！"],["Woof woof!","Woof woof!"],["嗶嗶！","嗶嗶！"],["Beep boop!","Beep boop!"],
      ["你好！","你好！"],["Hello!","Hello!"],["好好玩！","好好玩！"],["This is fun!","This is fun!"]
    ]},
    { type:"field_dropdown", name:"SECONDS", options:[["1","1"],["2","2"],["3","3"]] }
  ], previousStatement:null, nextStatement:null, colour:15 },
  { type:"story_move", message0:"%1 向 %2 移動 %3 格", args0:[
    { type:"field_dropdown", name:"ACTOR", options:[["🐱 Cat","cat"],["🐶 Dog","dog"],["🤖 Robot","robot"]] },
    { type:"field_dropdown", name:"DIR", options:[["右 right","right"],["左 left","left"]] },
    { type:"field_dropdown", name:"DIST", options:[["1","1"],["2","2"],["3","3"],["4","4"]] }
  ], previousStatement:null, nextStatement:null, colour:120 },
  { type:"story_wait", message0:"⏱ 等待 wait %1 秒", args0:[
    { type:"field_dropdown", name:"SECONDS", options:[["0.5","0.5"],["1","1"],["2","2"],["3","3"],["4","4"]] }
  ], previousStatement:null, nextStatement:null, colour:45 },
  { type:"story_when_clicked", message0:"👆 當點擊 %1 when clicked", args0:[
    { type:"field_dropdown", name:"ACTOR", options:[["🐱 Cat","cat"],["🐶 Dog","dog"],["🤖 Robot","robot"]] }
  ], nextStatement:null, colour:255, tooltip:"點舞台上的角色，就會執行下面的積木" },
  { type:"story_repeat", message0:"🔁 重複 repeat %1 次 times", args0:[
    { type:"field_dropdown", name:"TIMES", options:[["2","2"],["3","3"],["4","4"],["5","5"]] }
  ], message1:"%1", args1:[{ type:"input_statement", name:"DO" }], previousStatement:null, nextStatement:null, colour:42 },
  { type:"story_background", message0:"🖼 換場景 switch to %1", args0:[
    { type:"field_dropdown", name:"SCENE", options:[["🏠 家裡 Home","home"],["🌲 森林 Forest","forest"],["🏰 城堡 Castle","castle"],["🚀 太空 Space","space"]] }
  ], previousStatement:null, nextStatement:null, colour:285 },
  { type:"story_visibility", message0:"%1 %2", args0:[
    { type:"field_dropdown", name:"ACTOR", options:[["🐱 Cat","cat"],["🐶 Dog","dog"],["🤖 Robot","robot"]] },
    { type:"field_dropdown", name:"ACTION", options:[["出現 show","show"],["隱藏 hide","hide"]] }
  ], previousStatement:null, nextStatement:null, colour:200 }
]);

const workspace = Blockly.inject("blocklyDiv", {
  media:"https://unpkg.com/blockly/media/",
  trashcan:true,
  zoom:{ controls:true, wheel:true, startScale:innerWidth < 600 ? .85 : 1, maxScale:1.6, minScale:.55, scaleSpeed:1.1 },
  move:{ scrollbars:true, drag:true, wheel:true },
});

const hue = (h) => Blockly.utils.colour.hueToHex(h);
const quickAdd = createQuickAdd({
  workspace,
  root: document.querySelector("#quickAdd"),
  rootType: "story_start",
  text: { toMain: "點方塊就會接到「故事開始」最後面 Tap to add", after: "接在後面：", inside: "放進裡面：",
    insideElse: "放進：", intoElse: "", out: "跳出 Out", main: "故事開始", remove: "刪除" },
});
quickAdd.setItems([
  { type: "story_start", label: "🎬 故事開始", colour: hue(255), unique: true },
  { type: "story_when_clicked", label: "👆 當點擊", colour: hue(255) },
  { type: "story_say", label: "💬 說", colour: hue(15) },
  { type: "story_move", label: "🚶 移動", colour: hue(120) },
  { type: "story_wait", label: "⏱ 等待", colour: hue(45) },
  { type: "story_repeat", label: "🔁 重複", colour: hue(42) },
  { type: "story_background", label: "🖼 換場景", colour: hue(285) },
  { type: "story_visibility", label: "👀 出現/隱藏", colour: hue(200) },
]);
new ResizeObserver(() => Blockly.svgResize(workspace)).observe(document.querySelector("#blocklyDiv"));

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function resetStage() {
  stage.dataset.bg = "home";
  sceneLabel.textContent = scenes.home;
  Object.entries(actors).forEach(([key, el]) => {
    positions[key] = initialLeft[key];
    el.style.left = `${positions[key]}%`;
    el.style.opacity = "1";
    el.style.transform = "scaleX(1)";
    el.querySelector(".bubble").classList.remove("show");
  });
}

function setStatus(text) { status.textContent = text; }

async function say(actorKey, line, seconds) {
  const actor = actors[actorKey];
  const bubble = actor.querySelector(".bubble");
  bubble.textContent = line;
  bubble.classList.add("show");
  await sleep(seconds * 1000);
  bubble.classList.remove("show");
}

async function moveActor(actorKey, direction, distance) {
  const delta = Number(distance) * 10 * (direction === "right" ? 1 : -1);
  positions[actorKey] = Math.max(2, Math.min(82, positions[actorKey] + delta));
  actors[actorKey].style.transform = direction === "right" ? "scaleX(1)" : "scaleX(-1)";
  actors[actorKey].style.left = `${positions[actorKey]}%`;
  await sleep(650);
}

async function executeBlock(block) {
  switch (block.type) {
    case "story_say":
      await say(block.getFieldValue("ACTOR"), block.getFieldValue("LINE"), Number(block.getFieldValue("SECONDS")));
      break;
    case "story_move":
      await moveActor(block.getFieldValue("ACTOR"), block.getFieldValue("DIR"), block.getFieldValue("DIST"));
      break;
    case "story_wait":
      await sleep(Number(block.getFieldValue("SECONDS")) * 1000);
      break;
    case "story_background": {
      const scene = block.getFieldValue("SCENE");
      stage.dataset.bg = scene;
      sceneLabel.textContent = scenes[scene];
      await sleep(450);
      break;
    }
    case "story_visibility": {
      const actor = actors[block.getFieldValue("ACTOR")];
      actor.style.opacity = block.getFieldValue("ACTION") === "show" ? "1" : "0";
      await sleep(250);
      break;
    }
  }
}

const STEP_LIMIT = 120;

async function runChain(block, budget) {
  while (block && budget.steps < STEP_LIMIT) {
    budget.steps += 1;
    if (block.type === "story_repeat") {
      const times = Number(block.getFieldValue("TIMES"));
      for (let i = 0; i < times && budget.steps < STEP_LIMIT; i += 1) {
        await runChain(block.getInputTargetBlock("DO"), budget);
      }
    } else {
      await executeBlock(block);
    }
    block = block.getNextBlock();
  }
  return budget.steps;
}

async function runStory() {
  const start = workspace.getTopBlocks(true).find(block => block.type === "story_start");
  if (!start) { setStatus("先放入「🎬 故事開始」積木。"); return; }
  runBtn.disabled = true;
  resetStage();
  setStatus("故事演出中…");
  const steps = await runChain(start.getNextBlock(), { steps: 0 });
  setStatus(steps >= STEP_LIMIT ? `積木太多，已在 ${STEP_LIMIT} 步停止。` : "演出完成！試試點舞台上的角色，或換個順序再看看。");
  runBtn.disabled = false;
}

const runningClicks = new Set();

async function handleActorClick(actorKey) {
  const hats = workspace.getTopBlocks(true)
    .filter(block => block.type === "story_when_clicked" && block.getFieldValue("ACTOR") === actorKey)
    .filter(block => !runningClicks.has(block.id));
  if (!hats.length) { setStatus("這個角色還沒有「👆 當點擊」積木。"); return; }
  hats.forEach(block => runningClicks.add(block.id));
  await Promise.all(hats.map(block => runChain(block.getNextBlock(), { steps: 0 })));
  hats.forEach(block => runningClicks.delete(block.id));
}

function saveWorkspace() {
  const state = Blockly.serialization.workspaces.save(workspace);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function starterState() {
  return {
    blocks:{ languageVersion:0, blocks:[{
      type:"story_start", x:40, y:40,
      next:{ block:{ type:"story_say", fields:{ACTOR:"cat",LINE:"我要去找寶藏！",SECONDS:"2"},
        next:{ block:{ type:"story_move", fields:{ACTOR:"cat",DIR:"right",DIST:"2"} } } } }
    }] }
  };
}

function demoState() {
  return {
    blocks:{ languageVersion:0, blocks:[{
      type:"story_start", x:40, y:35,
      next:{ block:{ type:"story_say", fields:{ACTOR:"cat",LINE:"我要去找寶藏！",SECONDS:"2"},
      next:{ block:{ type:"story_move", fields:{ACTOR:"cat",DIR:"right",DIST:"2"},
      next:{ block:{ type:"story_background", fields:{SCENE:"forest"},
      next:{ block:{ type:"story_wait", fields:{SECONDS:"1"},
      next:{ block:{ type:"story_say", fields:{ACTOR:"cat",LINE:"寶藏在哪裡？",SECONDS:"2"},
      next:{ block:{ type:"story_wait", fields:{SECONDS:"1"},
      next:{ block:{ type:"story_say", fields:{ACTOR:"dog",LINE:"寶藏在大樹旁！",SECONDS:"2"},
      next:{ block:{ type:"story_move", fields:{ACTOR:"cat",DIR:"right",DIST:"2"},
      next:{ block:{ type:"story_say", fields:{ACTOR:"cat",LINE:"找到啦！",SECONDS:"2"} } } } } } } } } } } } } } } } } } }
    }, {
      type:"story_when_clicked", x:40, y:430, fields:{ACTOR:"dog"},
      next:{ block:{ type:"story_repeat", fields:{TIMES:"2"}, inputs:{ DO:{ block:{
        type:"story_move", fields:{ACTOR:"dog",DIR:"right",DIST:"1"},
        next:{ block:{ type:"story_move", fields:{ACTOR:"dog",DIR:"left",DIST:"1"} } } } } },
        next:{ block:{ type:"story_say", fields:{ACTOR:"dog",LINE:"汪汪！",SECONDS:"1"} } } } }
    }] }
  };
}

function loadState(state) {
  workspace.clear();
  Blockly.serialization.workspaces.load(state, workspace);
  saveWorkspace();
  quickAdd.reset();
}

function loadInitial() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    loadState(saved || starterState());
  } catch {
    loadState(starterState());
  }
}

workspace.addChangeListener(event => {
  if (event.isUiEvent) return;
  const count = workspace.getAllBlocks(false).length;
  blockCount.textContent = `${count} 個方塊`;
  saveWorkspace();
});

document.querySelector("#runBtn").addEventListener("click", runStory);
Object.entries(actors).forEach(([key, el]) => el.addEventListener("click", () => handleActorClick(key)));
document.querySelector("#resetBtn").addEventListener("click", () => { resetStage(); setStatus("舞台已重置，積木保留。"); });
document.querySelector("#demoBtn").addEventListener("click", () => { loadState(demoState()); resetStage(); setStatus("已載入示範：小貓找寶藏。按執行看看！"); });
document.querySelector("#clearBtn").addEventListener("click", () => { workspace.clear(); saveWorkspace(); quickAdd.reset(); setStatus("工作區已清空，可以重新創作。"); });

resetStage();
loadInitial();
Blockly.svgResize(workspace);
