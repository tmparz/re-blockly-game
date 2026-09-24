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
      ["找到啦！","找到啦！"],["I found it!","I found it!"]
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
  { type:"story_background", message0:"🖼 換場景 switch to %1", args0:[
    { type:"field_dropdown", name:"SCENE", options:[["🏠 家裡 Home","home"],["🌲 森林 Forest","forest"],["🏰 城堡 Castle","castle"],["🚀 太空 Space","space"]] }
  ], previousStatement:null, nextStatement:null, colour:285 },
  { type:"story_visibility", message0:"%1 %2", args0:[
    { type:"field_dropdown", name:"ACTOR", options:[["🐱 Cat","cat"],["🐶 Dog","dog"],["🤖 Robot","robot"]] },
    { type:"field_dropdown", name:"ACTION", options:[["出現 show","show"],["隱藏 hide","hide"]] }
  ], previousStatement:null, nextStatement:null, colour:200 }
]);

const toolbox = {
  kind:"categoryToolbox",
  contents:[
    { kind:"category", name:"開始 Start", colour:"#6d5bd0", contents:[{kind:"block", type:"story_start"}] },
    { kind:"category", name:"角色 Actor", colour:"#e66a32", contents:[{kind:"block", type:"story_say"},{kind:"block", type:"story_move"},{kind:"block", type:"story_visibility"}] },
    { kind:"category", name:"時間 Timing", colour:"#d9a219", contents:[{kind:"block", type:"story_wait"}] },
    { kind:"category", name:"場景 Scene", colour:"#8757c8", contents:[{kind:"block", type:"story_background"}] }
  ]
};

const workspace = Blockly.inject("blocklyDiv", {
  toolbox,
  trashcan:true,
  zoom:{ controls:true, wheel:true, startScale:.92, maxScale:1.4, minScale:.55, scaleSpeed:1.1 },
  move:{ scrollbars:true, drag:true, wheel:true },
});

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

async function runStory() {
  const start = workspace.getTopBlocks(true).find(block => block.type === "story_start");
  if (!start) { setStatus("先放入「🎬 故事開始」積木。"); return; }
  runBtn.disabled = true;
  resetStage();
  setStatus("故事演出中…");
  let block = start.getNextBlock();
  let count = 0;
  while (block && count < 60) {
    block.select();
    await executeBlock(block);
    block = block.getNextBlock();
    count += 1;
  }
  Blockly.getSelected()?.unselect();
  setStatus(count >= 60 ? "積木太多，已在 60 步停止。" : "演出完成！可以換順序，再看看會發生什麼。");
  runBtn.disabled = false;
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
    }] }
  };
}

function loadState(state) {
  workspace.clear();
  Blockly.serialization.workspaces.load(state, workspace);
  saveWorkspace();
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
document.querySelector("#resetBtn").addEventListener("click", () => { resetStage(); setStatus("舞台已重置，積木保留。"); });
document.querySelector("#demoBtn").addEventListener("click", () => { loadState(demoState()); resetStage(); setStatus("已載入示範：小貓找寶藏。按執行看看！"); });
document.querySelector("#clearBtn").addEventListener("click", () => { workspace.clear(); saveWorkspace(); setStatus("工作區已清空，可以重新創作。"); });

resetStage();
loadInitial();
Blockly.svgResize(workspace);
