const LANGUAGE_KEY = "blocky-easy-language";

function readLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY) === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

let currentLang = readLanguage();
document.documentElement.lang = currentLang === "en" ? "en" : "zh-Hant";

const STAGES = [
  {
    id: "basic",
    title: "第一階段：移動與轉彎",
    description: "先熟悉前進、方向和避開石牆。",
  },
  {
    id: "for",
    title: "第二階段：For 重複",
    description: "用重複方塊縮短程式，練習把規律收進迴圈。",
  },
  {
    id: "nested_for",
    title: "第三階段：巢狀 For 入門",
    description: "從兩個 For 串接開始，慢慢練習把 For 放進 For 裡。",
  },
  {
    id: "advanced_for",
    title: "第四階段：進階 For 工廠",
    description: "把路線拆成可重複的巡檢流程，練習二層以上的 For。",
  },
  {
    id: "while",
    title: "第五階段：While 迴圈",
    description: "不用指定次數，讓程式自己判斷要不要繼續走，直到條件不成立為止。",
  },
  {
    id: "if",
    title: "第六階段：If 條件",
    description: "從單次 If 到 For + If，最後加入 If/Else 二選一。",
  },
];

const LEVELS = [
  {
    id: "straight-path",
    stage: "basic",
    title: "直線前進",
    concept: "順序",
    goalText: "把小隊員帶到綠色傳送門。",
    hint: "只需要把四個「前進一步」接在開始方塊下面。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 2, dir: "E" },
    goal: { x: 4, y: 2 },
    walls: [],
    gems: [],
    blocks: ["move_forward"],
    targetBlocks: 4,
    solution: [
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "move_forward" },
    ],
  },
  {
    id: "long-straight",
    stage: "basic",
    title: "長直線衝刺",
    concept: "順序",
    goalText: "一路往右走到最遠的傳送門。",
    hint: "方向已經面向右邊，只要連續前進。",
    grid: { cols: 7, rows: 5 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 6, y: 1 },
    walls: [],
    gems: [],
    blocks: ["move_forward"],
    targetBlocks: 6,
    solution: [
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "move_forward" },
    ],
  },
  {
    id: "turn-corner",
    stage: "basic",
    title: "第一次轉彎",
    concept: "方向",
    goalText: "先往右走，再轉向上方的傳送門。",
    hint: "走兩步後左轉，再走兩步。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 3, dir: "E" },
    goal: { x: 2, y: 1 },
    walls: [],
    gems: [],
    blocks: ["move_forward", "turn_left", "turn_right"],
    targetBlocks: 5,
    solution: [
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "turn_left" },
      { type: "move_forward" },
      { type: "move_forward" },
    ],
  },
  {
    id: "zigzag-turns",
    stage: "basic",
    title: "雙轉彎小路",
    concept: "方向",
    goalText: "照著階梯形路線走到右上角。",
    hint: "每段走兩步，遇到轉角就換方向。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 4, dir: "E" },
    goal: { x: 4, y: 0 },
    walls: [
      { x: 3, y: 4 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 3, y: 3 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "turn_right"],
    targetBlocks: 11,
    solution: [
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "turn_left" },
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "turn_right" },
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "turn_left" },
      { type: "move_forward" },
      { type: "move_forward" },
    ],
  },
  {
    id: "wall-detour",
    stage: "basic",
    title: "繞過石牆",
    concept: "轉向避障",
    goalText: "石牆擋住直線，請繞一個小彎到傳送門。",
    hint: "先到石牆前，再往上繞過去，最後回到原本的方向。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 2, dir: "E" },
    goal: { x: 4, y: 2 },
    walls: [
      { x: 2, y: 2 },
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
      { x: 4, y: 4 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "turn_right"],
    targetBlocks: 10,
    solution: [
      { type: "move_forward" },
      { type: "turn_left" },
      { type: "move_forward" },
      { type: "turn_right" },
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "turn_right" },
      { type: "move_forward" },
      { type: "turn_left" },
      { type: "move_forward" },
    ],
  },
  {
    id: "vertical-climb",
    stage: "basic",
    title: "向上爬升",
    concept: "直線方向",
    goalText: "面向上方，直線走到傳送門。",
    hint: "小隊員已經面向上方，只需要連續前進。",
    grid: { cols: 5, rows: 5 },
    start: { x: 2, y: 4, dir: "N" },
    goal: { x: 2, y: 0 },
    walls: [],
    gems: [],
    blocks: ["move_forward"],
    targetBlocks: 4,
    solution: [
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "move_forward" },
    ],
  },
  {
    id: "right-turn-corner",
    stage: "basic",
    title: "右轉下樓",
    concept: "方向",
    goalText: "先往右，再右轉往下到傳送門。",
    hint: "走兩步後右轉，再走兩步。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 0, dir: "E" },
    goal: { x: 2, y: 2 },
    walls: [],
    gems: [],
    blocks: ["move_forward", "turn_left", "turn_right"],
    targetBlocks: 5,
    solution: [
      { type: "move_forward" },
      { type: "move_forward" },
      { type: "turn_right" },
      { type: "move_forward" },
      { type: "move_forward" },
    ],
  },
  {
    id: "about-face",
    stage: "basic",
    title: "原地回頭",
    concept: "方向",
    goalText: "用兩次轉彎完成回頭，再走回傳送門。",
    hint: "如果要回頭，可以連續右轉兩次。",
    grid: { cols: 5, rows: 5 },
    start: { x: 3, y: 2, dir: "E" },
    goal: { x: 1, y: 2 },
    walls: [{ x: 4, y: 2 }],
    gems: [],
    blocks: ["move_forward", "turn_left", "turn_right"],
    targetBlocks: 4,
    solution: [
      { type: "turn_right" },
      { type: "turn_right" },
      { type: "move_forward" },
      { type: "move_forward" },
    ],
  },
  {
    id: "repeat-bridge",
    stage: "for",
    title: "重複過橋",
    concept: "迴圈",
    goalText: "用重複方塊走完長橋。",
    hint: "把「前進一步」放進「重複」裡，次數設成 5。",
    grid: { cols: 6, rows: 5 },
    start: { x: 0, y: 2, dir: "E" },
    goal: { x: 5, y: 2 },
    walls: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times"],
    targetBlocks: 2,
    solution: [
      {
        type: "repeat_times",
        times: 5,
        children: [{ type: "move_forward" }],
      },
    ],
  },
  {
    id: "repeat-corner",
    stage: "for",
    title: "重複轉角",
    concept: "迴圈 + 轉向",
    goalText: "先走一段長直線，再轉彎走到出口。",
    hint: "兩段直線都可以用重複方塊。",
    grid: { cols: 6, rows: 6 },
    start: { x: 0, y: 5, dir: "N" },
    goal: { x: 5, y: 0 },
    walls: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times"],
    targetBlocks: 5,
    solution: [
      {
        type: "repeat_times",
        times: 5,
        children: [{ type: "move_forward" }],
      },
      { type: "turn_right" },
      {
        type: "repeat_times",
        times: 5,
        children: [{ type: "move_forward" }],
      },
    ],
  },
  {
    id: "square-patrol",
    stage: "for",
    title: "正方形巡邏",
    concept: "重複動作組",
    goalText: "用同一組動作繞一圈回到原本的基地。",
    hint: "不要先用兩層重複；這關練習把「前進、前進、右轉」放進同一個重複裡。",
    grid: { cols: 5, rows: 5 },
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 1, y: 1 },
    walls: [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
      { x: 4, y: 4 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times"],
    targetBlocks: 4,
    solution: [
      {
        type: "repeat_times",
        times: 4,
        children: [
          { type: "move_forward" },
          { type: "move_forward" },
          { type: "turn_right" },
        ],
      },
    ],
  },
  {
    id: "first-gem",
    stage: "for",
    title: "第一顆能量石",
    concept: "收集動作",
    goalText: "先收集能量石，再走到傳送門。",
    hint: "到寶石那格時，要放一個「收集寶石」。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 4, dir: "N" },
    goal: { x: 2, y: 2 },
    walls: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 3 },
    ],
    gems: [{ x: 0, y: 2 }],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 6,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
      { type: "collect_gem" },
      { type: "turn_right" },
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
    ],
  },
  {
    id: "collect-gems",
    stage: "for",
    title: "收集兩顆能量石",
    concept: "動作組合",
    goalText: "收集兩顆能量石，再站上傳送門。",
    hint: "可以先重複走兩步收第一顆，再右轉，重複走四步收第二顆。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 4, dir: "N" },
    goal: { x: 4, y: 2 },
    walls: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ],
    gems: [
      { x: 0, y: 2 },
      { x: 4, y: 2 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 7,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
      { type: "collect_gem" },
      { type: "turn_right" },
      {
        type: "repeat_times",
        times: 4,
        children: [{ type: "move_forward" }],
      },
      { type: "collect_gem" },
    ],
  },
  {
    id: "maze-turns",
    stage: "for",
    title: "石牆迷宮",
    concept: "路線規劃",
    goalText: "在石牆之間規劃多段直線與轉彎。",
    hint: "長直線用重複，轉角用左轉或右轉串起來。",
    grid: { cols: 6, rows: 6 },
    start: { x: 0, y: 5, dir: "E" },
    goal: { x: 5, y: 0 },
    walls: [
      { x: 1, y: 4 },
      { x: 3, y: 5 },
      { x: 3, y: 4 },
      { x: 3, y: 3 },
      { x: 0, y: 3 },
      { x: 1, y: 2 },
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 5, y: 1 },
      { x: 4, y: 3 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times"],
    targetBlocks: 13,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
      { type: "turn_left" },
      {
        type: "repeat_times",
        times: 3,
        children: [{ type: "move_forward" }],
      },
      { type: "turn_right" },
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
      { type: "turn_left" },
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
      { type: "turn_right" },
      { type: "move_forward" },
    ],
  },
  {
    id: "triple-gem-route",
    stage: "for",
    title: "大挑戰：三顆能量石",
    concept: "進階整合",
    goalText: "收集三顆能量石，最後停在傳送門上。",
    hint: "每一段直線都可以用重複；到寶石格要記得收集。",
    grid: { cols: 7, rows: 6 },
    start: { x: 0, y: 5, dir: "N" },
    goal: { x: 6, y: 1 },
    walls: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      { x: 3, y: 1 },
      { x: 3, y: 0 },
    ],
    gems: [
      { x: 0, y: 3 },
      { x: 3, y: 3 },
      { x: 6, y: 1 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 13,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
      { type: "collect_gem" },
      { type: "turn_right" },
      {
        type: "repeat_times",
        times: 3,
        children: [{ type: "move_forward" }],
      },
      { type: "collect_gem" },
      {
        type: "repeat_times",
        times: 3,
        children: [{ type: "move_forward" }],
      },
      { type: "turn_left" },
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
      { type: "collect_gem" },
    ],
  },
  {
    id: "for-long-road",
    stage: "for",
    title: "For：衝刺補給",
    concept: "For + 收尾",
    goalText: "先用重複走到補給點，收集能量石後再走到傳送門。",
    hint: "先重複前進 5 步，收集補給點，再接最後一步前進。",
    grid: { cols: 7, rows: 3 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 6, y: 1 },
    walls: [],
    gems: [{ x: 5, y: 1 }],
    blocks: ["move_forward", "repeat_times", "collect_gem"],
    targetBlocks: 4,
    solution: [
      {
        type: "repeat_times",
        times: 5,
        children: [{ type: "move_forward" }],
      },
      { type: "collect_gem" },
      { type: "move_forward" },
    ],
  },
  {
    id: "for-gem-row",
    stage: "for",
    title: "For：沿路收集",
    concept: "For + 收集",
    goalText: "連續收集三顆能量石，再到傳送門。",
    hint: "重複做：前進一步、收集寶石。最後再前進一步到終點。",
    grid: { cols: 5, rows: 3 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 4, y: 1 },
    walls: [],
    gems: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
    blocks: ["move_forward", "repeat_times", "collect_gem"],
    targetBlocks: 4,
    solution: [
      {
        type: "repeat_times",
        times: 3,
        children: [
          { type: "move_forward" },
          { type: "collect_gem" },
        ],
      },
      { type: "move_forward" },
    ],
  },
  {
    id: "for-rectangle-lap",
    stage: "for",
    title: "For：長方形跑道",
    concept: "巢狀迴圈",
    goalText: "用巢狀重複走完整個長方形。",
    hint: "外層重複 2 次；裡面走長邊、轉彎、走短邊、轉彎。",
    grid: { cols: 6, rows: 5 },
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 1, y: 1 },
    walls: [],
    gems: [],
    blocks: ["move_forward", "turn_right", "repeat_times"],
    targetBlocks: 7,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [
          {
            type: "repeat_times",
            times: 3,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_right" },
        ],
      },
    ],
  },
  {
    id: "nested-for-two-runs",
    stage: "nested_for",
    title: "兩段長路",
    concept: "兩個 For 串接",
    goalText: "先走完水平長路，再轉向上方出口。",
    hint: "這關先練習放兩個重複方塊：第一個走 4 步，轉彎後第二個走 2 步。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 4, dir: "E" },
    goal: { x: 4, y: 2 },
    walls: [
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times"],
    targetBlocks: 5,
    solution: [
      {
        type: "repeat_times",
        times: 4,
        children: [{ type: "move_forward" }],
      },
      { type: "turn_left" },
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
    ],
  },
  {
    id: "nested-for-three-runs",
    stage: "nested_for",
    title: "三段折線",
    concept: "三個 For 串接",
    goalText: "把三段長路分別用 For 表示，走到右側出口。",
    hint: "先走 3 步、左轉走 2 步、右轉再走 2 步。三段都可以各用一個重複。",
    grid: { cols: 6, rows: 6 },
    start: { x: 0, y: 5, dir: "E" },
    goal: { x: 5, y: 3 },
    walls: [
      { x: 0, y: 4 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times"],
    targetBlocks: 8,
    solution: [
      {
        type: "repeat_times",
        times: 3,
        children: [{ type: "move_forward" }],
      },
      { type: "turn_left" },
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
      { type: "turn_right" },
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
    ],
  },
  {
    id: "nested-for-station-pairs",
    stage: "nested_for",
    title: "兩格一站",
    concept: "For 裡放 For",
    goalText: "每隔兩格啟動一座能量站，最後停在最右側傳送門。",
    hint: "外層重複 3 次；每次裡面先重複走 2 步，再收集。",
    grid: { cols: 7, rows: 3 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 6, y: 1 },
    walls: [
      { x: 1, y: 0 },
      { x: 3, y: 0 },
      { x: 5, y: 0 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 5, y: 2 },
    ],
    gems: [
      { x: 2, y: 1 },
      { x: 4, y: 1 },
      { x: 6, y: 1 },
    ],
    blocks: ["move_forward", "repeat_times", "collect_gem"],
    targetBlocks: 4,
    solution: [
      {
        type: "repeat_times",
        times: 3,
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
        ],
      },
    ],
  },
  {
    id: "nested-for-turn-beacons",
    stage: "nested_for",
    title: "轉角信標",
    concept: "重複一組路線",
    goalText: "沿著三個轉角前進，每到轉角就啟動信標。",
    hint: "同一組動作會重複 3 次：走 2 步、收集、左轉。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 4, dir: "E" },
    goal: { x: 0, y: 2 },
    walls: [
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
    gems: [
      { x: 2, y: 4 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ],
    blocks: ["move_forward", "turn_left", "repeat_times", "collect_gem"],
    targetBlocks: 5,
    solution: [
      {
        type: "repeat_times",
        times: 3,
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_left" },
        ],
      },
    ],
  },
  {
    id: "nested-for-two-lane-patrol",
    stage: "nested_for",
    title: "雙排巡檢",
    concept: "外層 For",
    goalText: "巡檢上下兩排通道，啟動每排末端的能量站後回到起點。",
    hint: "外層處理兩排；每排都先走 4 步、收集，再轉到下一排。",
    grid: { cols: 5, rows: 4 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 0, y: 1 },
    walls: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ],
    gems: [
      { x: 4, y: 1 },
      { x: 0, y: 2 },
    ],
    blocks: ["move_forward", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 7,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [
          {
            type: "repeat_times",
            times: 4,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_right" },
          { type: "move_forward" },
          { type: "turn_right" },
        ],
      },
    ],
  },
  {
    id: "nested-for-small-loop",
    stage: "nested_for",
    title: "小圈巡邏",
    concept: "二層 For",
    goalText: "繞小圈巡邏一周，啟動四個角落信標。",
    hint: "外層重複 4 次；每次裡面走 2 步、收集、右轉。",
    grid: { cols: 5, rows: 5 },
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 1, y: 1 },
    walls: [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
      { x: 4, y: 4 },
    ],
    gems: [
      { x: 3, y: 1 },
      { x: 3, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 1 },
    ],
    blocks: ["move_forward", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 5,
    solution: [
      {
        type: "repeat_times",
        times: 4,
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_right" },
        ],
      },
    ],
  },
  {
    id: "nested-for-route-plus-climb",
    stage: "nested_for",
    title: "巡線再爬升",
    concept: "巢狀 + 串接",
    goalText: "先沿主線啟動兩座站台，再轉向上方收集最後一顆能量石。",
    hint: "前半段用一個巢狀 For；轉彎後再接一個走 3 步的 For。",
    grid: { cols: 5, rows: 6 },
    start: { x: 0, y: 5, dir: "E" },
    goal: { x: 4, y: 2 },
    walls: [
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    gems: [
      { x: 2, y: 5 },
      { x: 4, y: 5 },
      { x: 4, y: 2 },
    ],
    blocks: ["move_forward", "turn_left", "repeat_times", "collect_gem"],
    targetBlocks: 8,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
        ],
      },
      { type: "turn_left" },
      {
        type: "repeat_times",
        times: 3,
        children: [{ type: "move_forward" }],
      },
      { type: "collect_gem" },
    ],
  },
  {
    id: "nested-for-three-samplers",
    stage: "nested_for",
    title: "三段採樣",
    concept: "三個 For 組合",
    goalText: "完成三段採樣路線，依序收集三個能量樣本。",
    hint: "三段都是走 3 步再收集；中間用左轉與右轉接起來。",
    grid: { cols: 7, rows: 7 },
    start: { x: 0, y: 6, dir: "E" },
    goal: { x: 6, y: 3 },
    walls: [
      { x: 0, y: 5 },
      { x: 1, y: 5 },
      { x: 2, y: 5 },
      { x: 4, y: 5 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 0, y: 4 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
    ],
    gems: [
      { x: 3, y: 6 },
      { x: 3, y: 3 },
      { x: 6, y: 3 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 11,
    solution: [
      {
        type: "repeat_times",
        times: 3,
        children: [{ type: "move_forward" }],
      },
      { type: "collect_gem" },
      { type: "turn_left" },
      {
        type: "repeat_times",
        times: 3,
        children: [{ type: "move_forward" }],
      },
      { type: "collect_gem" },
      { type: "turn_right" },
      {
        type: "repeat_times",
        times: 3,
        children: [{ type: "move_forward" }],
      },
      { type: "collect_gem" },
    ],
  },
  {
    id: "adv-for-station-line",
    stage: "advanced_for",
    title: "L 型雙站巡線",
    concept: "二層 For + 動作組",
    goalText: "沿著兩組 L 型巡線啟動四座能量站，最後停在上方傳送門。",
    hint: "把一組 L 型流程寫進重複：走兩步收集、左轉上升一格收集、再右轉回到主線。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 4, dir: "E" },
    goal: { x: 4, y: 2 },
    walls: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
    ],
    gems: [
      { x: 2, y: 4 },
      { x: 2, y: 3 },
      { x: 4, y: 3 },
      { x: 4, y: 2 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 8,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_left" },
          { type: "move_forward" },
          { type: "collect_gem" },
          { type: "turn_right" },
        ],
      },
    ],
  },
  {
    id: "adv-for-corner-beacons",
    stage: "advanced_for",
    title: "四角信標巡邏",
    concept: "外層 For + 內層步數",
    goalText: "繞過四座信標並逐一啟動，最後回到起點基地。",
    hint: "外層重複 4 次；每次先走 3 步、收集信標，再右轉。",
    grid: { cols: 6, rows: 6 },
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 1, y: 1 },
    walls: [
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 0, y: 5 },
      { x: 5, y: 5 },
    ],
    gems: [
      { x: 4, y: 1 },
      { x: 4, y: 4 },
      { x: 1, y: 4 },
      { x: 1, y: 1 },
    ],
    blocks: ["move_forward", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 5,
    solution: [
      {
        type: "repeat_times",
        times: 4,
        children: [
          {
            type: "repeat_times",
            times: 3,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_right" },
        ],
      },
    ],
  },
  {
    id: "adv-for-double-scan",
    stage: "advanced_for",
    title: "雙線掃描",
    concept: "三層重複",
    goalText: "掃描上下兩條生產線，收集所有能量點後回到控制台。",
    hint: "每條線都重複兩次「前進兩步、收集」；外層再處理兩條線。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 0, y: 1 },
    walls: [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 4 },
      { x: 4, y: 4 },
    ],
    gems: [
      { x: 2, y: 1 },
      { x: 4, y: 1 },
      { x: 2, y: 3 },
      { x: 0, y: 3 },
    ],
    blocks: ["move_forward", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 9,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [
              {
                type: "repeat_times",
                times: 2,
                children: [{ type: "move_forward" }],
              },
              { type: "collect_gem" },
            ],
          },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_right" },
        ],
      },
    ],
  },
  {
    id: "adv-for-stair-loader",
    stage: "advanced_for",
    title: "階梯輸送帶",
    concept: "重複路段",
    goalText: "沿著斜向輸送帶上升，啟動三個平台後進入傳送門。",
    hint: "同一個流程會重複 3 次：走兩步、收集、上升一格、轉回主線。",
    grid: { cols: 7, rows: 6 },
    start: { x: 0, y: 5, dir: "E" },
    goal: { x: 6, y: 2 },
    walls: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
    ],
    gems: [
      { x: 2, y: 5 },
      { x: 4, y: 4 },
      { x: 6, y: 3 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 7,
    solution: [
      {
        type: "repeat_times",
        times: 3,
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_left" },
          { type: "move_forward" },
          { type: "turn_right" },
        ],
      },
    ],
  },
  {
    id: "adv-for-comb-mines",
    stage: "advanced_for",
    title: "梳齒礦道",
    concept: "重複採礦流程",
    goalText: "在三條直立礦道中上下穿梭，挖完能量石後回到主通道出口。",
    hint: "每一條礦道流程相同：進入、上去 3 格、收集、回到底部、前往下一條。",
    grid: { cols: 7, rows: 6 },
    start: { x: 0, y: 5, dir: "E" },
    goal: { x: 6, y: 5 },
    walls: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 3, y: 0 },
      { x: 3, y: 1 },
      { x: 5, y: 0 },
      { x: 5, y: 1 },
      { x: 2, y: 0 },
      { x: 4, y: 0 },
      { x: 6, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
      { x: 0, y: 4 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 4 },
      { x: 4, y: 1 },
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 4, y: 4 },
      { x: 6, y: 1 },
      { x: 6, y: 2 },
      { x: 6, y: 3 },
      { x: 6, y: 4 },
    ],
    gems: [
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 5, y: 2 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 12,
    solution: [
      {
        type: "repeat_times",
        times: 3,
        children: [
          { type: "move_forward" },
          { type: "turn_left" },
          {
            type: "repeat_times",
            times: 3,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_right" },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 3,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_left" },
          { type: "move_forward" },
        ],
      },
    ],
  },
  {
    id: "adv-for-cross-patrol",
    stage: "advanced_for",
    title: "十字信標通道",
    concept: "十字方向重複",
    goalText: "從中央起點出發，依序進入四個方向的通道，收集頂端的能量石並回到中央。",
    hint: "外層重複 4 次；每次走 3 步到頂端，收集後轉身，走 3 步回中央，最後右轉 1 次指向下個方向。",
    grid: { cols: 7, rows: 7 },
    start: { x: 3, y: 3, dir: "N" },
    goal: { x: 3, y: 3 },
    walls: [
      { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 4 }, { x: 0, y: 5 }, { x: 0, y: 6 },
      { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 4 }, { x: 1, y: 5 }, { x: 1, y: 6 },
      { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 4 }, { x: 2, y: 5 }, { x: 2, y: 6 },
      { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 },
      { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 },
      { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 4 }, { x: 6, y: 5 }, { x: 6, y: 6 },
    ],
    gems: [
      { x: 3, y: 0 },
      { x: 6, y: 3 },
      { x: 3, y: 6 },
      { x: 0, y: 3 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 9,
    solution: [
      {
        type: "repeat_times",
        times: 4,
        children: [
          {
            type: "repeat_times",
            times: 3,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_right" },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 3,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_right" },
        ],
      },
    ],
  },
  {
    id: "adv-for-battlement-patrol",
    stage: "advanced_for",
    title: "城垛雙向巡檢",
    concept: "凸字形起伏波動",
    goalText: "沿著高低起伏的城牆防線前進，在最高點與最低點啟動信標並抵達終點。",
    hint: "每一組包含：往上 2 步、右轉、往右 2 步收集、右轉、往下 2 步收集、左轉、往右 2 步、左轉。整組重複 2 次。",
    grid: { cols: 9, rows: 6 },
    start: { x: 0, y: 4, dir: "N" },
    goal: { x: 8, y: 4 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 },
      { x: 3, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 },
      { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 5, y: 3 }, { x: 7, y: 3 }, { x: 8, y: 3 },
      { x: 1, y: 4 }, { x: 5, y: 4 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 },
    ],
    gems: [
      { x: 2, y: 2 },
      { x: 2, y: 4 },
      { x: 6, y: 2 },
      { x: 6, y: 4 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 15,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_left" },
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_left" },
        ],
      },
    ],
  },
  {
    id: "adv-for-serpentine-pipe",
    stage: "advanced_for",
    title: "蛇形管道",
    concept: "S型曲線重複",
    goalText: "通過雙重S型的封閉管道，在每個管道底端收集能量石並到達傳送門。",
    hint: "一組包含：往上 4 步、右轉、往右 2 步、右轉、往下 4 步收集、左轉、往右 2 步、左轉。重複 2 次。",
    grid: { cols: 7, rows: 7 },
    start: { x: 0, y: 5, dir: "N" },
    goal: { x: 6, y: 5 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 },
      { x: 1, y: 2 }, { x: 3, y: 2 }, { x: 5, y: 2 },
      { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 5, y: 3 },
      { x: 1, y: 4 }, { x: 3, y: 4 }, { x: 5, y: 4 },
      { x: 1, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 },
    ],
    gems: [
      { x: 2, y: 5 },
      { x: 6, y: 5 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 14,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [
          {
            type: "repeat_times",
            times: 4,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 4,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_left" },
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_left" },
        ],
      },
    ],
  },
  {
    id: "adv-for-three-peaks",
    stage: "advanced_for",
    title: "三峰山脈巡檢",
    concept: "階梯式波形巡迴",
    goalText: "攀登並越過兩座階梯山峰，在每個頂峰與谷底收集能量石，最後抵達防線終點。",
    hint: "一組完整的流程包含：爬上坡 2 次、前進 1 步收集、轉身；爬下坡 2 次、前進 1 步收集、轉向。重複 2 次。",
    grid: { cols: 9, rows: 7 },
    start: { x: 0, y: 5, dir: "N" },
    goal: { x: 8, y: 5 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 }, { x: 8, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 },
      { x: 0, y: 3 }, { x: 4, y: 3 }, { x: 8, y: 3 },
      { x: 2, y: 4 }, { x: 6, y: 4 },
      { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
      { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 },
    ],
    gems: [
      { x: 2, y: 2 },
      { x: 4, y: 5 },
      { x: 6, y: 2 },
      { x: 8, y: 5 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 19,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [
              { type: "move_forward" },
              { type: "turn_right" },
              { type: "move_forward" },
              { type: "turn_left" },
            ],
          },
          { type: "move_forward" },
          { type: "collect_gem" },
          { type: "turn_right" },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 2,
            children: [
              { type: "move_forward" },
              { type: "turn_left" },
              { type: "move_forward" },
              { type: "turn_right" },
            ],
          },
          { type: "move_forward" },
          { type: "collect_gem" },
          { type: "turn_right" },
          { type: "turn_right" },
        ],
      },
    ],
  },
  {
    id: "adv-for-circuit-board",
    stage: "advanced_for",
    title: "核心電路板",
    concept: "雙重縱向 S 軌跡與極速雙端點採集",
    goalText: "通過曲折的電路板軌跡，在每個焊接點（轉折端）收集能量點並抵達晶片終點。",
    hint: "一組流程包含：前進 3 步、收集、右轉、前進 2 步、右轉、前進 3 步、收集、左轉、前進 2 步、左轉。重複 2 次。",
    grid: { cols: 8, rows: 8 },
    start: { x: 0, y: 7, dir: "N" },
    goal: { x: 6, y: 7 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 },
      { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 },
      { x: 3, y: 4 }, { x: 7, y: 4 },
      { x: 1, y: 5 }, { x: 3, y: 5 }, { x: 5, y: 5 }, { x: 7, y: 5 },
      { x: 1, y: 6 }, { x: 3, y: 6 }, { x: 5, y: 6 }, { x: 7, y: 6 },
      { x: 1, y: 7 }, { x: 5, y: 7 }, { x: 7, y: 7 },
    ],
    gems: [
      { x: 0, y: 4 },
      { x: 2, y: 7 },
      { x: 4, y: 4 },
      { x: 6, y: 7 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 15,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [
          {
            type: "repeat_times",
            times: 3,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 3,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_left" },
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_left" },
        ],
      },
    ],
  },
  {
    id: "adv-for-twin-squares",
    stage: "advanced_for",
    title: "雙核心巡檢",
    concept: "多段二層 For",
    goalText: "完成左右兩座核心的方形巡檢，啟動所有角落信標。",
    hint: "左右兩座核心都可以用同一種方形巡檢：走 2 步、收集、右轉，重複 4 次。",
    grid: { cols: 8, rows: 5 },
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 4, y: 1 },
    walls: [
      { x: 0, y: 0 },
      { x: 7, y: 0 },
      { x: 0, y: 4 },
      { x: 7, y: 4 },
    ],
    gems: [
      { x: 3, y: 1 },
      { x: 3, y: 3 },
      { x: 1, y: 3 },
      { x: 1, y: 1 },
      { x: 6, y: 1 },
      { x: 6, y: 3 },
      { x: 4, y: 3 },
      { x: 4, y: 1 },
    ],
    blocks: ["move_forward", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 12,
    solution: [
      {
        type: "repeat_times",
        times: 4,
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_right" },
        ],
      },
      {
        type: "repeat_times",
        times: 3,
        children: [{ type: "move_forward" }],
      },
      {
        type: "repeat_times",
        times: 4,
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_right" },
        ],
      },
    ],
  },
  {
    id: "adv-for-diagonal-shuttle",
    stage: "advanced_for",
    title: "斜線搬運",
    concept: "成組路線",
    goalText: "把能量石沿著斜向階梯一路搬到右上角傳送門。",
    hint: "一組流程會讓你往右兩格、收集，再往上兩格、收集；整組重複 3 次。",
    grid: { cols: 7, rows: 7 },
    start: { x: 0, y: 6, dir: "E" },
    goal: { x: 6, y: 0 },
    walls: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 3 },
    ],
    gems: [
      { x: 2, y: 6 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
      { x: 4, y: 2 },
      { x: 6, y: 2 },
      { x: 6, y: 0 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 9,
    solution: [
      {
        type: "repeat_times",
        times: 3,
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_left" },
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_right" },
        ],
      },
    ],
  },
  {
    id: "adv-for-windmill-core",
    stage: "advanced_for",
    title: "風車核心",
    concept: "往返迴圈",
    goalText: "從中央核心出發，依序啟動四個方向的端點後回到中央。",
    hint: "每一輪都先走到端點收集，再轉身走回中央，最後左轉面向下一個方向。",
    grid: { cols: 7, rows: 7 },
    start: { x: 3, y: 3, dir: "N" },
    goal: { x: 3, y: 3 },
    walls: [
      { x: 0, y: 0 },
      { x: 6, y: 0 },
      { x: 0, y: 6 },
      { x: 6, y: 6 },
      { x: 2, y: 2 },
      { x: 4, y: 2 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
    ],
    gems: [
      { x: 3, y: 1 },
      { x: 5, y: 3 },
      { x: 3, y: 5 },
      { x: 1, y: 3 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 9,
    solution: [
      {
        type: "repeat_times",
        times: 4,
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_right" },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_left" },
        ],
      },
    ],
  },
  {
    id: "adv-for-double-track",
    stage: "advanced_for",
    title: "雙層能量跑道",
    concept: "大型二層 For",
    goalText: "先完成外圈跑道，再切入內圈跑道，收集每個轉角的能量石。",
    hint: "外圈與內圈都可以用「重複 2 次：長邊、收集、轉彎、短邊、收集、轉彎」。",
    grid: { cols: 7, rows: 7 },
    start: { x: 0, y: 6, dir: "E" },
    goal: { x: 1, y: 5 },
    walls: [
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 4, y: 3 },
      { x: 3, y: 4 },
    ],
    gems: [
      { x: 6, y: 6 },
      { x: 6, y: 1 },
      { x: 0, y: 1 },
      { x: 0, y: 6 },
      { x: 5, y: 5 },
      { x: 5, y: 2 },
      { x: 1, y: 2 },
      { x: 1, y: 5 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 22,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [
          {
            type: "repeat_times",
            times: 6,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_left" },
          {
            type: "repeat_times",
            times: 5,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_left" },
        ],
      },
      { type: "move_forward" },
      { type: "turn_left" },
      { type: "move_forward" },
      { type: "turn_right" },
      {
        type: "repeat_times",
        times: 2,
        children: [
          {
            type: "repeat_times",
            times: 4,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_left" },
          {
            type: "repeat_times",
            times: 3,
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_left" },
        ],
      },
    ],
  },
  {
    id: "adv-for-final-matrix",
    stage: "advanced_for",
    title: "最終關：矩陣掃描",
    concept: "多層 For 綜合",
    goalText: "掃描四條能量列，收集 12 顆能量石，最後停在維修出口。",
    hint: "把一列拆成「重複 3 次：前進兩步、收集」。再把上下兩列做成一組，整組重複 2 次。",
    grid: { cols: 7, rows: 10 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 0, y: 9 },
    walls: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
      { x: 0, y: 2 },
      { x: 2, y: 2 },
      { x: 4, y: 2 },
      { x: 1, y: 4 },
      { x: 3, y: 4 },
      { x: 5, y: 4 },
      { x: 0, y: 6 },
      { x: 2, y: 6 },
      { x: 4, y: 6 },
      { x: 1, y: 8 },
      { x: 3, y: 8 },
      { x: 5, y: 8 },
    ],
    gems: [
      { x: 2, y: 1 },
      { x: 4, y: 1 },
      { x: 6, y: 1 },
      { x: 4, y: 3 },
      { x: 2, y: 3 },
      { x: 0, y: 3 },
      { x: 2, y: 5 },
      { x: 4, y: 5 },
      { x: 6, y: 5 },
      { x: 4, y: 7 },
      { x: 2, y: 7 },
      { x: 0, y: 7 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "collect_gem"],
    targetBlocks: 17,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [
          {
            type: "repeat_times",
            times: 3,
            children: [
              {
                type: "repeat_times",
                times: 2,
                children: [{ type: "move_forward" }],
              },
              { type: "collect_gem" },
            ],
          },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_right" },
          {
            type: "repeat_times",
            times: 3,
            children: [
              {
                type: "repeat_times",
                times: 2,
                children: [{ type: "move_forward" }],
              },
              { type: "collect_gem" },
            ],
          },
          { type: "turn_left" },
          {
            type: "repeat_times",
            times: 2,
            children: [{ type: "move_forward" }],
          },
          { type: "turn_left" },
        ],
      },
    ],
  },
  {
    id: "while-straight-walk",
    stage: "while",
    title: "While：一直往前走",
    concept: "While 入門",
    goalText: "用「當前方沒牆時重複」讓小隊員自動走到傳送門。",
    hint: "放一個 While 方塊，條件選「前方沒牆」，裡面放「前進一步」。",
    grid: { cols: 7, rows: 3 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 6, y: 1 },
    walls: [],
    gems: [],
    blocks: ["move_forward", "while_loop"],
    targetBlocks: 2,
    solution: [
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
      },
    ],
  },
  {
    id: "while-collect-line",
    stage: "while",
    title: "While：沿路收集",
    concept: "While + 收集",
    goalText: "一路前進到傳送門，沿途收集所有寶石。",
    hint: "While 裡面放兩個方塊：「收集寶石」和「前進一步」。站在寶石上時先收集再前進。",
    grid: { cols: 7, rows: 3 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 6, y: 1 },
    walls: [],
    gems: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 1 },
    ],
    blocks: ["move_forward", "while_loop", "collect_gem"],
    targetBlocks: 3,
    solution: [
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [
          { type: "collect_gem" },
          { type: "move_forward" },
        ],
      },
    ],
  },
  {
    id: "while-wall-stop",
    stage: "while",
    title: "While：走到牆前停",
    concept: "While 停止",
    goalText: "往前走直到碰到牆壁，然後轉彎走到傳送門。",
    hint: "先用 While 一直前進到撞牆前停下來，再手動左轉，最後再用第二個 While 繼續前進。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 3, dir: "E" },
    goal: { x: 3, y: 0 },
    walls: [
      { x: 4, y: 3 },
      { x: 4, y: 2 },
      { x: 4, y: 1 },
      { x: 4, y: 0 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "while_loop"],
    targetBlocks: 5,
    solution: [
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
      },
      { type: "turn_left" },
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
      },
    ],
  },
  {
    id: "while-corridor",
    stage: "while",
    title: "While：長廊巡邏",
    concept: "While + 多段轉彎",
    goalText: "沿著 U 型走廊巡邏，在每個轉角收集能量石，最後到達傳送門。",
    hint: "走廊有三段：先往右走到底、左轉、往上走到底、左轉、再往左走到傳送門。每段都用 While（前方沒牆）。",
    grid: { cols: 7, rows: 5 },
    start: { x: 0, y: 4, dir: "E" },
    goal: { x: 0, y: 0 },
    walls: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 },
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
      { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
    ],
    gems: [
      { x: 6, y: 4 },
      { x: 6, y: 0 },
    ],
    blocks: ["move_forward", "turn_left", "while_loop", "collect_gem"],
    targetBlocks: 10,
    solution: [
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
      },
      { type: "collect_gem" },
      { type: "turn_left" },
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
      },
      { type: "collect_gem" },
      { type: "turn_left" },
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
      },
    ],
  },
  {
    id: "while-gem-vacuum",
    stage: "while",
    title: "While：寶石吸塵器",
    concept: "While 條件：站在寶石上",
    goalText: "一邊前進一邊檢查腳下有沒有寶石，有就收集，走到底即完成。",
    hint: "外層用 While（前方沒牆）一直走；裡面再放一個 While（站在寶石上）收集寶石，然後前進一步。",
    grid: { cols: 6, rows: 3 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 5, y: 1 },
    walls: [],
    gems: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    blocks: ["move_forward", "while_loop", "collect_gem"],
    targetBlocks: 4,
    solution: [
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [
          {
            type: "while_loop",
            condition: "ON_GEM",
            children: [{ type: "collect_gem" }],
          },
          { type: "move_forward" },
        ],
      },
    ],
  },
  {
    id: "if-clear-step",
    stage: "if",
    title: "If：前方沒牆才走",
    concept: "If 入門",
    goalText: "先檢查前方是不是安全，安全才往前走到傳送門。",
    hint: "條件選「前方沒牆」，把「前進一步」放進 If 裡。",
    grid: { cols: 4, rows: 3 },
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 2, y: 1 },
    walls: [{ x: 3, y: 1 }],
    gems: [],
    blocks: ["move_forward", "if_condition"],
    targetBlocks: 2,
    solution: [
      {
        type: "if_condition",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
      },
    ],
  },
  {
    id: "if-blocked-turn-only",
    stage: "if",
    title: "If：有牆才轉彎",
    concept: "If + 方向",
    goalText: "前方有石牆時才轉彎，接著走到上方傳送門。",
    hint: "條件選「前方有牆」，If 裡放左轉；If 後面再接前進。",
    grid: { cols: 4, rows: 4 },
    start: { x: 1, y: 2, dir: "E" },
    goal: { x: 1, y: 1 },
    walls: [{ x: 2, y: 2 }],
    gems: [],
    blocks: ["move_forward", "turn_left", "if_condition"],
    targetBlocks: 3,
    solution: [
      {
        type: "if_condition",
        condition: "FRONT_BLOCKED",
        children: [{ type: "turn_left" }],
      },
      { type: "move_forward" },
    ],
  },
  {
    id: "if-clear-two-step",
    stage: "if",
    title: "If：通道安全才連走",
    concept: "兩個 If",
    goalText: "用兩次 If 檢查前方是否安全，安全就前進一步。",
    hint: "同一個判斷要做兩次：如果前方沒牆，就前進一步。",
    grid: { cols: 5, rows: 3 },
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 3, y: 1 },
    walls: [{ x: 4, y: 1 }],
    gems: [],
    blocks: ["move_forward", "if_condition"],
    targetBlocks: 4,
    solution: [
      {
        type: "if_condition",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
      },
      {
        type: "if_condition",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
      },
    ],
  },
  {
    id: "if-gem-or-step",
    stage: "if",
    title: "If：收集後再前進",
    concept: "If + 收集",
    goalText: "站在寶石上時先收集，再前進到傳送門。",
    hint: "先判斷「站在寶石上」才收集；不要把收集寶石放在每一格都會執行的位置。",
    grid: { cols: 4, rows: 3 },
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 2, y: 1 },
    walls: [],
    gems: [{ x: 1, y: 1 }],
    blocks: ["move_forward", "if_condition", "collect_gem"],
    targetBlocks: 3,
    solution: [
      {
        type: "if_condition",
        condition: "ON_GEM",
        children: [{ type: "collect_gem" }],
      },
      { type: "move_forward" },
    ],
  },
  {
    id: "if-first-wall-turn",
    stage: "if",
    title: "If：第一個判斷",
    concept: "If 入門",
    goalText: "前方被石牆擋住時，先判斷再轉向傳送門。",
    hint: "把「如果前方有牆，就左轉」放在最前面，接著再前進一步。",
    grid: { cols: 4, rows: 4 },
    start: { x: 1, y: 2, dir: "E" },
    goal: { x: 1, y: 1 },
    walls: [{ x: 2, y: 2 }],
    gems: [],
    blocks: ["move_forward", "turn_left", "if_condition"],
    targetBlocks: 3,
    solution: [
      {
        type: "if_condition",
        condition: "FRONT_BLOCKED",
        children: [{ type: "turn_left" }],
      },
      { type: "move_forward" },
    ],
  },
  {
    id: "if-first-gem-check",
    stage: "if",
    title: "If：站上寶石才收集",
    concept: "If + 收集",
    goalText: "先判斷自己是不是站在寶石上，是的話才收集，再前往傳送門。",
    hint: "條件選「站在寶石上」，把「收集寶石」放進 If 裡。",
    grid: { cols: 4, rows: 3 },
    start: { x: 1, y: 1, dir: "E" },
    goal: { x: 2, y: 1 },
    walls: [],
    gems: [{ x: 1, y: 1 }],
    blocks: ["move_forward", "if_condition", "collect_gem"],
    targetBlocks: 3,
    solution: [
      {
        type: "if_condition",
        condition: "ON_GEM",
        children: [{ type: "collect_gem" }],
      },
      { type: "move_forward" },
    ],
  },
  {
    id: "if-for-safe-bridge",
    stage: "if",
    title: "If：確認安全再重複",
    concept: "If 裡放 For",
    goalText: "確認前方道路可走後，再用重複一次走完長橋。",
    hint: "這關開始把 For 放進 If：如果前方沒牆，就重複前進 4 步。",
    grid: { cols: 5, rows: 3 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 4, y: 1 },
    walls: [],
    gems: [],
    blocks: ["move_forward", "repeat_times", "if_condition"],
    targetBlocks: 3,
    solution: [
      {
        type: "if_condition",
        condition: "FRONT_CLEAR",
        children: [
          {
            type: "repeat_times",
            times: 4,
            children: [{ type: "move_forward" }],
          },
        ],
      },
    ],
  },
  {
    id: "if-left-zigzag",
    stage: "if",
    title: "If：遇牆左轉長路",
    concept: "For + If",
    goalText: "用同一條規則通過兩個左轉彎。",
    hint: "外層用重複；每一回合先判斷前方是否有牆，有牆就左轉，接著前進。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 4, dir: "E" },
    goal: { x: 2, y: 1 },
    walls: [
      { x: 4, y: 4 },
      { x: 3, y: 0 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "repeat_times", "if_condition"],
    targetBlocks: 4,
    solution: [
      {
        type: "repeat_times",
        times: 7,
        children: [
          {
            type: "if_condition",
            condition: "FRONT_BLOCKED",
            children: [{ type: "turn_left" }],
          },
          { type: "move_forward" },
        ],
      },
    ],
  },
  {
    id: "if-gem-lane",
    stage: "if",
    title: "If：掃描寶石長廊",
    concept: "For + If + 收集",
    goalText: "沿著長廊前進，只在站到寶石時收集。",
    hint: "每回合都前進一步，再判斷是否站在寶石上。不是每一格都有寶石，不能無腦一直收集。",
    grid: { cols: 7, rows: 3 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 6, y: 1 },
    walls: [],
    gems: [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 5, y: 1 },
    ],
    blocks: ["move_forward", "repeat_times", "if_condition", "collect_gem"],
    targetBlocks: 4,
    solution: [
      {
        type: "repeat_times",
        times: 6,
        children: [
          { type: "move_forward" },
          {
            type: "if_condition",
            condition: "ON_GEM",
            children: [{ type: "collect_gem" }],
          },
        ],
      },
    ],
  },
  {
    id: "if-left-gem-route",
    stage: "if",
    concept: "For + 多個 If",
    title: "If：左轉路線收集",
    goalText: "走過多個轉角，沿路遇到寶石就收集。",
    hint: "每一回合先判斷牆，再前進；前進後再判斷是否站在寶石上。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 4, dir: "E" },
    goal: { x: 2, y: 1 },
    walls: [
      { x: 4, y: 4 },
      { x: 3, y: 0 },
    ],
    gems: [
      { x: 2, y: 4 },
      { x: 3, y: 2 },
      { x: 2, y: 1 },
    ],
    blocks: ["move_forward", "turn_left", "repeat_times", "if_condition", "collect_gem"],
    targetBlocks: 6,
    solution: [
      {
        type: "repeat_times",
        times: 7,
        children: [
          {
            type: "if_condition",
            condition: "FRONT_BLOCKED",
            children: [{ type: "turn_left" }],
          },
          { type: "move_forward" },
          {
            type: "if_condition",
            condition: "ON_GEM",
            children: [{ type: "collect_gem" }],
          },
        ],
      },
    ],
  },
  {
    id: "if-else-first-choice",
    stage: "if",
    title: "Else：第一次二選一",
    concept: "If / Else 入門",
    goalText: "如果前方可走就前進；否則先轉向，再往上走到出口。",
    hint: "這關會用到新的「如果/否則」方塊：前方沒牆就前進，否則左轉。",
    grid: { cols: 4, rows: 4 },
    start: { x: 1, y: 3, dir: "E" },
    goal: { x: 1, y: 1 },
    walls: [{ x: 2, y: 3 }],
    gems: [],
    blocks: ["move_forward", "turn_left", "repeat_times", "if_else_condition"],
    targetBlocks: 5,
    solution: [
      {
        type: "if_else_condition",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
        elseChildren: [{ type: "turn_left" }],
      },
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
    ],
  },
  {
    id: "if-else-left-zigzag",
    stage: "if",
    title: "Else：左轉自動路線",
    concept: "For + If / Else",
    goalText: "用 If/Else 把「遇牆轉彎，否則前進」寫成一條規則。",
    hint: "外層重複 9 次；如果前方有牆就左轉，否則前進一步。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 4, dir: "E" },
    goal: { x: 2, y: 1 },
    walls: [
      { x: 4, y: 4 },
      { x: 3, y: 0 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "repeat_times", "if_else_condition"],
    targetBlocks: 4,
    solution: [
      {
        type: "repeat_times",
        times: 9,
        children: [
          {
            type: "if_else_condition",
            condition: "FRONT_BLOCKED",
            children: [{ type: "turn_left" }],
            elseChildren: [{ type: "move_forward" }],
          },
        ],
      },
    ],
  },
  {
    id: "if-else-right-zigzag",
    stage: "if",
    title: "Else：右轉自動路線",
    concept: "For + If / Else",
    goalText: "換成右轉規則，讓程式自己在牆前轉向。",
    hint: "規則和上一關相同，只是遇牆時改成右轉。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 0, dir: "E" },
    goal: { x: 2, y: 3 },
    walls: [
      { x: 4, y: 0 },
      { x: 3, y: 4 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_right", "repeat_times", "if_else_condition"],
    targetBlocks: 4,
    solution: [
      {
        type: "repeat_times",
        times: 9,
        children: [
          {
            type: "if_else_condition",
            condition: "FRONT_BLOCKED",
            children: [{ type: "turn_right" }],
            elseChildren: [{ type: "move_forward" }],
          },
        ],
      },
    ],
  },
  {
    id: "if-else-final-gem-maze",
    stage: "if",
    title: "最終 If：自動轉彎收集",
    concept: "For + If + Else 綜合",
    goalText: "用 If/Else 自動通過轉角，再用 If 收集沿路寶石。",
    hint: "每回合先做 If/Else：遇牆左轉，否則前進。接著再判斷是否站在寶石上。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 4, dir: "E" },
    goal: { x: 2, y: 1 },
    walls: [
      { x: 4, y: 4 },
      { x: 3, y: 0 },
    ],
    gems: [
      { x: 2, y: 4 },
      { x: 3, y: 2 },
      { x: 2, y: 1 },
    ],
    blocks: ["move_forward", "turn_left", "repeat_times", "if_condition", "if_else_condition", "collect_gem"],
    targetBlocks: 6,
    solution: [
      {
        type: "repeat_times",
        times: 9,
        children: [
          {
            type: "if_else_condition",
            condition: "FRONT_BLOCKED",
            children: [{ type: "turn_left" }],
            elseChildren: [{ type: "move_forward" }],
          },
          {
            type: "if_condition",
            condition: "ON_GEM",
            children: [{ type: "collect_gem" }],
          },
        ],
      },
    ],
  },
  {
    id: "while-dual-corridor",
    stage: "if",
    title: "While：雙走廊吸塵器",
    concept: "巢狀 While + 雙廊清除",
    goalText: "在 U 型長廊中，用吸塵器邏輯清理完兩側通道的寶石，抵達終點傳送門。",
    hint: "通道有三段：第一廊、轉彎段、第二廊。每一段都用「當前方沒牆」的吸塵器巢狀邏輯來前進與收集。",
    grid: { cols: 8, rows: 5 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 0, y: 3 },
    walls: [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
      { x: 5, y: 2 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
      { x: 6, y: 0 },
      { x: 7, y: 0 },
      { x: 7, y: 1 },
      { x: 7, y: 2 },
      { x: 7, y: 3 },
      { x: 7, y: 4 },
      { x: 0, y: 4 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
    ],
    gems: [
      { x: 2, y: 1 },
      { x: 4, y: 1 },
      { x: 6, y: 2 },
      { x: 4, y: 3 },
      { x: 2, y: 3 },
    ],
    blocks: ["move_forward", "turn_right", "while_loop", "if_condition", "collect_gem"],
    targetBlocks: 8,
    solution: [
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [
          {
            type: "while_loop",
            condition: "ON_GEM",
            children: [{ type: "collect_gem" }],
          },
          { type: "move_forward" },
        ],
      },
      {
        type: "while_loop",
        condition: "ON_GEM",
        children: [{ type: "collect_gem" }],
      },
      { type: "turn_right" },
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [
          {
            type: "while_loop",
            condition: "ON_GEM",
            children: [{ type: "collect_gem" }],
          },
          { type: "move_forward" },
        ],
      },
      {
        type: "while_loop",
        condition: "ON_GEM",
        children: [{ type: "collect_gem" }],
      },
      { type: "turn_right" },
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [
          {
            type: "while_loop",
            condition: "ON_GEM",
            children: [{ type: "collect_gem" }],
          },
          { type: "move_forward" },
        ],
      },
      {
        type: "while_loop",
        condition: "ON_GEM",
        children: [{ type: "collect_gem" }],
      },
    ],
  },
  {
    id: "while-spiral-sweeper",
    stage: "if",
    title: "While：螺旋掃地機",
    concept: "巢狀 While + 螺旋巡邏",
    goalText: "用 For 重複配合巢狀 While 吸塵器，讓小隊員一路沿著螺旋通道吸乾淨所有寶石，走到正中心的傳送門！",
    hint: "螺旋通道共有 5 個直行區段，每次直走到底後右轉。用 For 重複 5 次，裡面放吸塵器與右轉積木。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 0, dir: "E" },
    goal: { x: 2, y: 2 },
    walls: [
      { x: 0, y: 1 },
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 3 }, { x: 3, y: 3 },
      { x: 3, y: 2 },
    ],
    gems: [
      { x: 2, y: 0 },
      { x: 4, y: 2 },
      { x: 2, y: 4 },
      { x: 0, y: 3 },
      { x: 1, y: 2 },
    ],
    blocks: ["move_forward", "turn_right", "repeat_times", "while_loop", "if_condition", "collect_gem"],
    targetBlocks: 8,
    solution: [
      {
        type: "repeat_times",
        times: 5,
        children: [
          {
            type: "while_loop",
            condition: "FRONT_CLEAR",
            children: [
              {
                type: "while_loop",
                condition: "ON_GEM",
                children: [{ type: "collect_gem" }],
              },
              { type: "move_forward" },
            ],
          },
          {
            type: "while_loop",
            condition: "ON_GEM",
            children: [{ type: "collect_gem" }],
          },
          { type: "turn_right" },
        ],
      },
    ],
  },
  {
    id: "while-grid-sweeper",
    stage: "if",
    title: "While：網格吸塵器",
    concept: "巢狀 While + 蛇形掃街",
    goalText: "以蛇形軌跡（北行、南行、北行）清理三個通道的寶石，最後抵達傳送門。",
    hint: "每一段直行都是一次吸塵器區間，清理到底後做手動移動與調頭，再開始下一個區間的清理。",
    grid: { cols: 3, rows: 5 },
    start: { x: 0, y: 4, dir: "N" },
    goal: { x: 2, y: 4 },
    walls: [],
    gems: [
      { x: 0, y: 2 },
      { x: 1, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 2 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "while_loop", "if_condition", "collect_gem"],
    targetBlocks: 14,
    solution: [
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [
          {
            type: "while_loop",
            condition: "ON_GEM",
            children: [{ type: "collect_gem" }],
          },
          { type: "move_forward" },
        ],
      },
      {
        type: "while_loop",
        condition: "ON_GEM",
        children: [{ type: "collect_gem" }],
      },
      { type: "turn_right" },
      { type: "move_forward" },
      { type: "turn_right" },
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [
          {
            type: "while_loop",
            condition: "ON_GEM",
            children: [{ type: "collect_gem" }],
          },
          { type: "move_forward" },
        ],
      },
      {
        type: "while_loop",
        condition: "ON_GEM",
        children: [{ type: "collect_gem" }],
      },
      { type: "turn_left" },
      { type: "move_forward" },
      { type: "turn_left" },
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [
          {
            type: "while_loop",
            condition: "ON_GEM",
            children: [{ type: "collect_gem" }],
          },
          { type: "move_forward" },
        ],
      },
      {
        type: "while_loop",
        condition: "ON_GEM",
        children: [{ type: "collect_gem" }],
      },
    ],
  },
  {
    id: "while-for-combo",
    stage: "if",
    title: "While + For：自動巡檢",
    concept: "While 與 For 結合",
    goalText: "用 While 自動走到牆壁，收集寶石後調頭，來回巡邏兩趟回到起點。",
    hint: "外層用 For 重複 2 次；每次先用 While（前方沒牆）一直前進，收集寶石、右轉兩次調頭，再 While 走回去、收集、調頭。",
    grid: { cols: 7, rows: 3 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 0, y: 1 },
    walls: [],
    gems: [
      { x: 6, y: 1 },
    ],
    blocks: ["move_forward", "turn_right", "repeat_times", "while_loop", "if_condition", "collect_gem"],
    targetBlocks: 7,
    solution: [
      {
        type: "repeat_times",
        times: 2,
        children: [
          {
            type: "while_loop",
            condition: "FRONT_CLEAR",
            children: [{ type: "move_forward" }],
          },
          { type: "collect_gem" },
          { type: "turn_right" },
          { type: "turn_right" },
        ],
      },
    ],
  },
];

const STAGE_TRANSLATIONS = {
  en: {
    basic: {
      title: "Stage 1: Move and Turn",
      description: "Start with moving forward, changing direction, and avoiding stone walls.",
    },
    for: {
      title: "Stage 2: For Loops",
      description: "Use repeat blocks to shorten programs and place patterns inside loops.",
    },
    nested_for: {
      title: "Stage 3: Nested For Basics",
      description: "Start by chaining two For loops, then slowly place For loops inside other For loops.",
    },
    advanced_for: {
      title: "Stage 4: Advanced For Factory",
      description: "Break routes into reusable inspection routines and practice two-layer loops.",
    },
    while: {
      title: "Stage 5: While Loops",
      description: "No fixed count needed — let the program decide when to stop based on conditions.",
    },
    if: {
      title: "Stage 6: If Conditions",
      description: "Move from single If checks to For + If, then finish with If/Else choices.",
    },
  },
};

const LEVEL_TRANSLATIONS = {
  en: {
    "straight-path": {
      title: "Straight Ahead",
      concept: "Sequence",
      goalText: "Guide the scout to the green portal.",
      hint: "Connect four Move Forward blocks under the Start block.",
    },
    "long-straight": {
      title: "Long Straight Sprint",
      concept: "Sequence",
      goalText: "Walk right all the way to the far portal.",
      hint: "The scout is already facing right, so keep moving forward.",
    },
    "turn-corner": {
      title: "First Turn",
      concept: "Direction",
      goalText: "Walk right first, then turn toward the portal above.",
      hint: "Move two steps, turn left, then move two more steps.",
    },
    "zigzag-turns": {
      title: "Two-Turn Path",
      concept: "Direction",
      goalText: "Follow the stair-shaped path to the upper-right corner.",
      hint: "Move two steps on each segment, then turn at the corner.",
    },
    "wall-detour": {
      title: "Around the Wall",
      concept: "Turning Around Obstacles",
      goalText: "A stone wall blocks the straight path. Take a small detour to the portal.",
      hint: "Go to the wall, move around it from above, then return to your original direction.",
    },
    "vertical-climb": {
      title: "Climb Up",
      concept: "Straight Direction",
      goalText: "Face upward and walk straight to the portal.",
      hint: "The scout already faces upward. Just keep moving forward.",
    },
    "right-turn-corner": {
      title: "Right Turn Down",
      concept: "Direction",
      goalText: "Move right first, then turn right and walk down to the portal.",
      hint: "Move two steps, turn right, then move two more steps.",
    },
    "about-face": {
      title: "Turn Around",
      concept: "Direction",
      goalText: "Turn around with two turns, then walk back to the portal.",
      hint: "To face the opposite way, turn right twice.",
    },
    "repeat-bridge": {
      title: "Repeat Bridge",
      concept: "Loop",
      goalText: "Use a repeat block to cross the long bridge.",
      hint: "Put Move Forward inside Repeat and set the count to 5.",
    },
    "repeat-corner": {
      title: "Repeat Corner",
      concept: "Loop + Turning",
      goalText: "Walk a long straight path, then turn toward the exit.",
      hint: "Both straight segments can use repeat blocks.",
    },
    "square-patrol": {
      title: "Square Patrol",
      concept: "Repeating an Action Group",
      goalText: "Use the same action group to loop once and return to the starting base.",
      hint: "Do not use two layers of Repeat yet. Practice placing Move, Move, Turn Right inside one Repeat.",
    },
    "first-gem": {
      title: "First Energy Gem",
      concept: "Collect Action",
      goalText: "Collect the energy gem, then walk to the portal.",
      hint: "When you stand on the gem tile, add a Collect Gem block.",
    },
    "collect-gems": {
      title: "Collect Two Energy Gems",
      concept: "Combining Actions",
      goalText: "Collect two energy gems, then stand on the portal.",
      hint: "Repeat two moves to collect the first gem, turn right, then repeat four moves to collect the second gem.",
    },
    "maze-turns": {
      title: "Stone Wall Maze",
      concept: "Route Planning",
      goalText: "Plan several straight segments and turns between the stone walls.",
      hint: "Use repeat blocks for long straight paths, then connect turns at the corners.",
    },
    "triple-gem-route": {
      title: "Challenge: Three Energy Gems",
      concept: "Advanced Mix",
      goalText: "Collect three energy gems and finish on the portal.",
      hint: "Each straight segment can use Repeat. Remember to collect when you reach a gem tile.",
    },
    "for-long-road": {
      title: "For: Supply Sprint",
      concept: "For + Finish",
      goalText: "Use Repeat to reach the supply point, collect the energy stone, then take the final step to the portal.",
      hint: "Repeat 5 moves first, collect at the supply point, then add one final Move Forward.",
    },
    "for-gem-row": {
      title: "For: Collect Along the Way",
      concept: "For + Collect",
      goalText: "Collect three energy gems in a row, then reach the portal.",
      hint: "Repeat this pattern: move forward, collect gem. Then move one last step to the goal.",
    },
    "for-rectangle-lap": {
      title: "For: Rectangle Track",
      concept: "Nested Loop",
      goalText: "Use nested repeats to walk the full rectangle.",
      hint: "Repeat 2 times: walk the long side, turn, walk the short side, turn.",
    },
    "nested-for-two-runs": {
      title: "Two Long Segments",
      concept: "Chaining Two For Loops",
      goalText: "Finish the horizontal path first, then turn toward the upper exit.",
      hint: "Practice using two repeat blocks: the first moves 4 steps, then after turning the second moves 2 steps.",
    },
    "nested-for-three-runs": {
      title: "Three-Segment Bend",
      concept: "Chaining Three For Loops",
      goalText: "Represent each long segment with For and reach the right-side exit.",
      hint: "Move 3 steps, turn left for 2 steps, then turn right for 2 more steps. Each segment can use its own repeat.",
    },
    "nested-for-station-pairs": {
      title: "Station Every Two Tiles",
      concept: "For Inside For",
      goalText: "Activate one energy station every two tiles and stop at the right portal.",
      hint: "Repeat 3 times on the outside. Inside each round, repeat 2 moves, then collect.",
    },
    "nested-for-turn-beacons": {
      title: "Corner Beacons",
      concept: "Repeating a Route Group",
      goalText: "Move through three corners and activate the beacon at each corner.",
      hint: "The same group repeats 3 times: move 2 steps, collect, then turn left.",
    },
    "nested-for-two-lane-patrol": {
      title: "Two-Lane Patrol",
      concept: "Outer For Loop",
      goalText: "Inspect two lanes, activate the station at the end of each lane, and return to the start.",
      hint: "Use the outer loop for the two lanes. Each lane moves 4 steps, collects, then turns into the next lane.",
    },
    "nested-for-small-loop": {
      title: "Small Loop Patrol",
      concept: "Two-Layer For",
      goalText: "Walk a small loop and activate all four corner beacons.",
      hint: "Repeat 4 times on the outside. Inside each round, move 2 steps, collect, and turn right.",
    },
    "nested-for-route-plus-climb": {
      title: "Line Patrol, Then Climb",
      concept: "Nested + Chained",
      goalText: "Activate two stations on the main line, then turn upward to collect the final energy stone.",
      hint: "Use one nested For for the first half. After turning, add one more For that moves 3 steps.",
    },
    "nested-for-three-samplers": {
      title: "Three Sampling Segments",
      concept: "Combining Three For Loops",
      goalText: "Finish three sampling segments and collect three energy samples in order.",
      hint: "Each segment moves 3 steps and collects. Use left and right turns to connect the segments.",
    },
    "adv-for-station-line": {
      title: "L-Shaped Dual Stations",
      concept: "Two-Layer For + Action Group",
      goalText: "Follow two L-shaped inspection routes, activate four stations, and stop at the upper portal.",
      hint: "Put one L-shaped routine inside Repeat: move two and collect, turn left and climb one tile to collect, then turn right back to the main line.",
    },
    "adv-for-corner-beacons": {
      title: "Corner Beacon Patrol",
      concept: "Outer For + Step Count",
      goalText: "Circle four beacons, activate each one, and return to the base.",
      hint: "Repeat 4 times: move 3 steps, collect the beacon, then turn right.",
    },
    "adv-for-double-scan": {
      title: "Double-Line Scan",
      concept: "Three-Layer Repeat",
      goalText: "Scan two production lines, collect every energy point, and return to the console.",
      hint: "Each line repeats \"move two steps, collect\" twice. Use the outer loop for the two lines.",
    },
    "adv-for-stair-loader": {
      title: "Stair Conveyor",
      concept: "Repeated Segment",
      goalText: "Climb the diagonal conveyor, activate three platforms, and enter the portal.",
      hint: "The same routine repeats 3 times: move two, collect, climb one tile, and turn back to the main line.",
    },
    "adv-for-comb-mines": {
      title: "Comb Mine Shafts",
      concept: "Repeated Mining Routine",
      goalText: "Move up and down three mine shafts, collect the energy stones, and return to the exit lane.",
      hint: "Each shaft uses the same routine: enter, move up 3 tiles, collect, return to the bottom, and move to the next shaft.",
    },
    "adv-for-twin-squares": {
      title: "Twin Core Inspection",
      concept: "Multiple Two-Layer Loops",
      goalText: "Inspect two square cores and activate every corner beacon.",
      hint: "Both cores use the same square patrol: move 2 steps, collect, turn right, and repeat 4 times.",
    },
    "adv-for-diagonal-shuttle": {
      title: "Diagonal Shuttle",
      concept: "Grouped Route",
      goalText: "Carry the energy stones up the diagonal staircase to the upper-right portal.",
      hint: "One group moves two tiles right and collects, then two tiles up and collects. Repeat the group 3 times.",
    },
    "adv-for-windmill-core": {
      title: "Windmill Core",
      concept: "Out-and-Back Loop",
      goalText: "Start from the center, activate the four endpoints, and return to the core.",
      hint: "Each round goes to an endpoint, collects, turns around, returns to the center, then turns left toward the next arm.",
    },
    "adv-for-double-track": {
      title: "Double-Layer Energy Track",
      concept: "Large Two-Layer For",
      goalText: "Complete the outer track, move into the inner track, and collect every corner energy stone.",
      hint: "Both tracks use \"repeat 2 times: long side, collect, turn, short side, collect, turn\".",
    },
    "adv-for-final-matrix": {
      title: "Final: Matrix Scan",
      concept: "Multi-Layer For Mix",
      goalText: "Scan four energy rows, collect 12 energy stones, and stop at the service exit.",
      hint: "Make one row as \"repeat 3 times: move two steps, collect\". Then make an up-and-down row pair and repeat the pair 2 times.",
    },
    "while-straight-walk": {
      title: "While: Keep Walking",
      concept: "While Basics",
      goalText: "Use \"while front is clear\" to walk automatically to the portal.",
      hint: "Place a While block, choose \"front is clear\", and put Move Forward inside.",
    },
    "while-collect-line": {
      title: "While: Collect Along the Way",
      concept: "While + Collect",
      goalText: "Walk to the portal and collect all gems along the way.",
      hint: "Put two blocks inside While: Collect Gem and Move Forward. Collect first, then move.",
    },
    "while-wall-stop": {
      title: "While: Stop at the Wall",
      concept: "While Stop",
      goalText: "Walk forward until you hit a wall, then turn and walk to the portal.",
      hint: "Use While to walk until blocked, then turn left manually, then use a second While to keep going.",
    },
    "while-corridor": {
      title: "While: U-Corridor Patrol",
      concept: "While + Multi-Turn",
      goalText: "Patrol along a U-shaped corridor, collect energy stones at each corner, and reach the portal.",
      hint: "The corridor has three segments: walk right to the wall, turn left, walk up to the wall, turn left, walk left to the portal. Use While for each.",
    },
    "while-gem-vacuum": {
      title: "While: Gem Vacuum",
      concept: "While Condition: On Gem",
      goalText: "Walk forward while checking for gems underfoot — collect any you find and reach the portal.",
      hint: "Outer While (front clear) keeps walking; inside, put a While (on gem) to collect, then Move Forward.",
    },
    "while-dual-corridor": {
      title: "While: Dual Corridor Vacuum",
      concept: "Nested While + Dual Corridor",
      goalText: "Use the vacuum loop logic to clean up gems in a U-shaped corridor and reach the portal.",
      hint: "The corridor has three straight legs. For each leg, use the nested \"while front is clear\" vacuum logic to move and collect.",
    },
    "while-spiral-sweeper": {
      title: "While: Spiral Sweeper",
      concept: "Nested While + Spiral Route",
      goalText: "Combine a For loop with the nested While vacuum cleaner to sweep a spiral path all the way to the center portal!",
      hint: "The spiral path has 5 legs, turning right after each leg. Repeat 5 times with a vacuum loop followed by Turn Right.",
    },
    "while-grid-sweeper": {
      title: "While: Grid Sweeper",
      concept: "Nested While + Zig-zag Sweeping",
      goalText: "Sweep three corridors in a zig-zag serpentine pattern (North, South, North) and reach the portal.",
      hint: "Each leg is a vacuum interval. Clean all the way to the boundary, turn around manually, and start the next leg.",
    },
    "while-for-combo": {
      title: "While + For: Shuttle Patrol",
      concept: "While and For Combined",
      goalText: "Use While to walk to the wall, collect the gem, turn around, and patrol back and forth twice.",
      hint: "Outer For repeats 2 times; each time use While (front clear) to walk, collect, then turn right twice to reverse.",
    },
    "if-clear-step": {
      title: "If: Move Only When Clear",
      concept: "If Basics",
      goalText: "Check whether the front is safe. Move to the portal only if it is safe.",
      hint: "Choose \"front is clear\" and put Move Forward inside the If block.",
    },
    "if-blocked-turn-only": {
      title: "If: Turn Only at a Wall",
      concept: "If + Direction",
      goalText: "Turn only when a stone wall blocks the front, then walk to the upper portal.",
      hint: "Choose \"front is blocked\", put Turn Left inside If, then add Move Forward after the If block.",
    },
    "if-clear-two-step": {
      title: "If: Safe Path Twice",
      concept: "Two If Blocks",
      goalText: "Use If twice to check whether the front is safe. Move one step when it is safe.",
      hint: "Repeat the same check twice: if the front is clear, move forward.",
    },
    "if-gem-or-step": {
      title: "If: Collect, Then Move",
      concept: "If + Collect",
      goalText: "Collect only when standing on a gem, then move to the portal.",
      hint: "First check \"on a gem\" before collecting. Do not place Collect where it runs on every tile.",
    },
    "if-first-wall-turn": {
      title: "If: First Check",
      concept: "If Basics",
      goalText: "When a stone wall blocks the front, check first and then turn toward the portal.",
      hint: "Put \"if front is blocked, turn left\" first, then move forward.",
    },
    "if-first-gem-check": {
      title: "If: Collect Only on a Gem",
      concept: "If + Collect",
      goalText: "Check whether you are standing on a gem. If yes, collect it, then go to the portal.",
      hint: "Choose the condition \"on a gem\" and put Collect Gem inside the If block.",
    },
    "if-for-safe-bridge": {
      title: "If: Check Safety, Then Repeat",
      concept: "For Inside If",
      goalText: "After confirming the path is clear, use Repeat to cross the long bridge.",
      hint: "Put For inside If: if the front is clear, repeat Move Forward 4 times.",
    },
    "if-left-zigzag": {
      title: "If: Left Turns at Walls",
      concept: "For + If",
      goalText: "Use one rule to pass two left turns.",
      hint: "Use Repeat outside. Each round checks the front: if blocked, turn left, then move forward.",
    },
    "if-gem-lane": {
      title: "If: Scan the Gem Lane",
      concept: "For + If + Collect",
      goalText: "Move along the lane and collect only when standing on a gem.",
      hint: "Each round moves forward once, then checks whether you are on a gem. Not every tile has a gem.",
    },
    "if-left-gem-route": {
      title: "If: Left-Turn Gem Route",
      concept: "For + Multiple Ifs",
      goalText: "Pass several corners and collect gems whenever you find them.",
      hint: "Each round checks for a wall, moves forward, then checks whether it is on a gem.",
    },
    "if-else-first-choice": {
      title: "Else: First Two-Way Choice",
      concept: "If / Else Basics",
      goalText: "If the front is clear, move forward. Otherwise turn first, then climb to the exit.",
      hint: "Use the new If/Else block: if the front is clear, move forward; otherwise turn left.",
    },
    "if-else-left-zigzag": {
      title: "Else: Auto Left-Turn Route",
      concept: "For + If / Else",
      goalText: "Use If/Else to write one rule: turn at walls, otherwise move forward.",
      hint: "Repeat 9 times. If the front is blocked, turn left; otherwise move forward.",
    },
    "if-else-right-zigzag": {
      title: "Else: Auto Right-Turn Route",
      concept: "For + If / Else",
      goalText: "Switch to a right-turn rule so the program turns itself at walls.",
      hint: "The rule is the same as the previous level, but the wall branch turns right.",
    },
    "if-else-final-gem-maze": {
      title: "Final If: Auto Turn and Collect",
      concept: "For + If + Else Mix",
      goalText: "Use If/Else to pass corners automatically, then use If to collect gems along the route.",
      hint: "Each round starts with If/Else: turn left at walls, otherwise move forward. Then check whether you are on a gem.",
    },
  },
};

const UI_TEXT = {
  zh: {
    addBlocksFirst: "先放一些動作方塊，再按執行。",
    addToElse: "接到否則裡",
    addToIf: "接到如果裡",
    addToRepeat: "接到重複 {times} 次裡",
    addToRoot: "接到主程式",
    addedBlock: "已接上「{label}」。",
    addedContainer: "已加入「{label}」。請在 Blockly 工作區中把方塊放進它裡面。",
    adjust: "再調整一下",
    actionCategory: "動作",
    blockCount: "{count} / {limit} 個方塊",
    blockLimit: "限制 {limit} 個方塊內",
    cannotRun: "還不能執行",
    cannotRunLimit: "這一關最多只能使用 {limit} 個方塊，請刪掉多餘方塊或改用重複/條件。",
    clear: "清空",
    collectStatus: "收集成功",
    collectTooltip: "站在寶石上時收集它。",
    complete: "任務完成",
    condition: "條件",
    conditionCategory: "條件",
    conditionFalse: "條件跳過",
    conditionTrue: "條件成立",
    chooseLevel: "選擇關卡",
    parentTarget: "上一層",
    decreaseRepeat: "減少重複次數",
    defaultResult: "把方塊接在「當按下執行」下面。",
    demo: "示範",
    demoLoaded: "示範方塊已放入，可以按執行觀察路線。",
    elseDoMessage: "否則做 %1",
    elseTarget: "否則裡",
    emptyProgram: "點上方方塊，把程式接起來。",
    frontBlocked: "前方有牆",
    frontClear: "前方沒牆",
    gemAlready: "這顆寶石已經收集過了。",
    hideHint: "隱藏提示",
    hitWall: "撞到邊界或石牆了。",
    ifBlockMessage: "如果 %1",
    ifChip: "如果",
    ifDoMessage: "就做 %1",
    ifElseChip: "如果/否則",
    ifTarget: "如果裡",
    ifElseTooltip: "條件成立時做第一組方塊，否則做另一組方塊。",
    ifTooltip: "條件成立時，才執行裡面的方塊。",
    increaseRepeat: "增加重複次數",
    levelCardTitle: "第 {number} 關：{title}",
    levelKicker: "第 {number} 關",
    lastLevel: "最後一關",
    limitShort: "限制 {limit}",
    loadWarning: "Blockly 沒有載入。請確認這台電腦可以連到 unpkg.com，或改成安裝本機 Blockly 套件。",
    loopCategory: "迴圈",
    mapTitleFallback: "任務地圖",
    missionBoard: "Mission board",
    missingBlockly: "缺少 Blockly",
    missingGems: "已經到傳送門了，但還有寶石沒收集。",
    moveStatus: "前進一步",
    moveTooltip: "依照目前方向前進一格。",
    noGem: "這一格沒有寶石可以收集。",
    noGoal: "程式跑完了，但還沒有站上傳送門。",
    noStart: "找不到開始方塊。",
    nextLevel: "下一關",
    onGem: "站在寶石上",
    pageDescription: "用 Blockly 方塊練習順序、轉向、重複與收集動作的兒童程式邏輯遊戲。",
    pageTitle: "Blocky Easy",
    passedStars: "過關，得到 {stars} 顆星。",
    quickBlocks: "接方塊",
    ready: "準備好了",
    removeBlock: "移除 {label}",
    repeatChip: "重複 {times} 次",
    repeatDoMessage: "做 %1",
    repeatMessage: "重複 %1 次",
    repeatTooltip: "把裡面的方塊重複執行幾次。",
    whileMessage: "當 %1 時重複",
    whileDoMessage: "做 %1",
    whileChip: "當…重複",
    whileTooltip: "只要條件成立，就一直重複執行裡面的方塊。",
    addToWhile: "接到當…重複裡",
    reset: "重來",
    rootProgram: "主程式",
    run: "執行",
    running: "執行中",
    runningResult: "小隊員正在照你的方塊行動。",
    runaway: "方塊太多了，請把程式拆短一點。",
    showHint: "顯示提示",
    speed: "速度",
    startBlock: "當按下執行",
    startTooltip: "程式從這裡開始。",
    tooManyBlocks: "方塊太多",
    tooManyBlocksAdd: "這一關最多只能使用 {limit} 個方塊。",
    totalStars: "總星數",
    turnLeftStatus: "左轉",
    turnLeftTooltip: "往左轉 90 度。",
    turnRightStatus: "右轉",
    turnRightTooltip: "往右轉 90 度。",
    undo: "退一步",
    workspaceEyebrow: "Blockly workspace",
    workspaceTitle: "方塊工作區",
  },
  en: {
    addBlocksFirst: "Add some action blocks before running.",
    addToElse: "Add inside Else",
    addToIf: "Add inside If",
    addToRepeat: "Add inside Repeat {times}x",
    addToRoot: "Add to main program",
    addedBlock: "Added \"{label}\".",
    addedContainer: "Added \"{label}\". Drag blocks into it in the Blockly workspace.",
    adjust: "Try again",
    actionCategory: "Actions",
    blockCount: "{count} / {limit} blocks",
    blockLimit: "Limit: {limit} blocks",
    cannotRun: "Not ready",
    cannotRunLimit: "This level allows at most {limit} blocks. Delete extra blocks or use Repeat/If.",
    clear: "Clear",
    collectStatus: "Collected",
    collectTooltip: "Collect the gem when standing on it.",
    complete: "Mission complete",
    condition: "Condition",
    conditionCategory: "Conditions",
    conditionFalse: "Condition skipped",
    conditionTrue: "Condition true",
    chooseLevel: "Choose level",
    parentTarget: "Up one level",
    decreaseRepeat: "Decrease repeat count",
    defaultResult: "Connect blocks under \"When Run is pressed\".",
    demo: "Demo",
    demoLoaded: "Demo blocks are ready. Press Run to watch the route.",
    elseDoMessage: "else do %1",
    elseTarget: "Else",
    emptyProgram: "Tap blocks above to build the program.",
    frontBlocked: "front is blocked",
    frontClear: "front is clear",
    gemAlready: "This gem has already been collected.",
    hideHint: "Hide hint",
    hitWall: "Hit the edge or a stone wall.",
    ifBlockMessage: "if %1",
    ifChip: "If",
    ifDoMessage: "do %1",
    ifElseChip: "If/Else",
    ifTarget: "If",
    ifElseTooltip: "Run the first group when the condition is true, otherwise run the other group.",
    ifTooltip: "Run the blocks inside only when the condition is true.",
    increaseRepeat: "Increase repeat count",
    levelCardTitle: "Level {number}: {title}",
    levelKicker: "Level {number}",
    lastLevel: "Last level",
    limitShort: "Limit {limit}",
    loadWarning: "Blockly did not load. Make sure this device can reach unpkg.com, or install Blockly locally.",
    loopCategory: "Loops",
    mapTitleFallback: "Mission Map",
    missionBoard: "Mission board",
    missingBlockly: "Blockly missing",
    missingGems: "You reached the portal, but some gems are still missing.",
    moveStatus: "Move forward",
    moveTooltip: "Move one tile in the current direction.",
    noGem: "There is no gem on this tile.",
    noGoal: "The program finished, but the scout is not on the portal.",
    noStart: "Cannot find the Start block.",
    nextLevel: "Next level",
    onGem: "on a gem",
    pageDescription: "A Blockly logic game for kids to practice sequence, turning, repeat loops, conditions, and collection actions.",
    pageTitle: "Blocky Easy",
    passedStars: "Level complete. You earned {stars} stars.",
    quickBlocks: "Add blocks",
    ready: "Ready",
    removeBlock: "Remove {label}",
    repeatChip: "Repeat {times}x",
    repeatDoMessage: "do %1",
    repeatMessage: "repeat %1 times",
    repeatTooltip: "Run the blocks inside several times.",
    whileMessage: "while %1",
    whileDoMessage: "do %1",
    whileChip: "While…",
    whileTooltip: "Keep running the blocks inside as long as the condition is true.",
    addToWhile: "Add inside While",
    reset: "Reset",
    rootProgram: "Main",
    run: "Run",
    running: "Running",
    runningResult: "The scout is following your blocks.",
    runaway: "Too many blocks. Shorten the program.",
    showHint: "Show hint",
    speed: "Speed",
    startBlock: "when Run is pressed",
    startTooltip: "The program starts here.",
    tooManyBlocks: "Too many blocks",
    tooManyBlocksAdd: "This level allows at most {limit} blocks.",
    totalStars: "Total stars",
    turnLeftStatus: "Turn left",
    turnLeftTooltip: "Turn 90 degrees left.",
    turnRightStatus: "Turn right",
    turnRightTooltip: "Turn 90 degrees right.",
    undo: "Undo",
    workspaceEyebrow: "Blockly workspace",
    workspaceTitle: "Block workspace",
  },
};

const BLOCK_LABELS = {
  zh: {
    move_forward: "前進一步",
    turn_left: "左轉",
    turn_right: "右轉",
    repeat_times: "重複",
    while_loop: "當…重複",
    if_condition: "如果",
    if_else_condition: "如果/否則",
    collect_gem: "收集寶石",
  },
  en: {
    move_forward: "Move Forward",
    turn_left: "Turn Left",
    turn_right: "Turn Right",
    repeat_times: "Repeat",
    while_loop: "While…",
    if_condition: "If",
    if_else_condition: "If/Else",
    collect_gem: "Collect Gem",
  },
};

const DIRS = ["N", "E", "S", "W"];
const DELTAS = {
  N: { x: 0, y: -1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: 1 },
  W: { x: -1, y: 0 },
};

const STORAGE_KEY = "blocky-easy-progress-v1";
const CURRENT_LEVEL_KEY = "blocky-easy-current-level";

function t(key, values = {}) {
  const source = UI_TEXT[currentLang]?.[key] ?? UI_TEXT.zh[key] ?? key;
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    source,
  );
}

function stageText(stage, key) {
  return STAGE_TRANSLATIONS[currentLang]?.[stage.id]?.[key] || stage[key];
}

function levelText(level, key) {
  return LEVEL_TRANSLATIONS[currentLang]?.[level.id]?.[key] || level[key];
}

function blockLabel(type) {
  return BLOCK_LABELS[currentLang]?.[type] || BLOCK_LABELS.zh[type] || type;
}

function conditionOptions() {
  return [
    [t("frontBlocked"), "FRONT_BLOCKED"],
    [t("frontClear"), "FRONT_CLEAR"],
    [t("onGem"), "ON_GEM"],
  ];
}

function repeatCountOptions() {
  return Array.from({ length: 12 }, (_, index) => {
    const value = String(index + 1);
    return [value, value];
  });
}

function setButtonText(button, text) {
  const textNode = Array.from(button.childNodes)
    .reverse()
    .find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  if (textNode) {
    textNode.textContent = ` ${text}`;
    return;
  }
  button.append(document.createTextNode(` ${text}`));
}

const els = {
  board: document.querySelector("#board"),
  blockCount: document.querySelector("#blockCount"),
  blockLimit: document.querySelector("#blockLimit"),
  demoButton: document.querySelector("#demoButton"),
  hint: document.querySelector("#levelHint"),
  hintToggle: document.querySelector("#hintToggle"),
  langButtons: document.querySelectorAll("[data-lang]"),
  levelConcept: document.querySelector("#levelConcept"),
  levelGoal: document.querySelector("#levelGoal"),
  levelKicker: document.querySelector("#levelKicker"),
  levelSelect: document.querySelector("#levelSelect"),
  levelSelectLabel: document.querySelector("#levelSelectLabel"),
  levelTitle: document.querySelector("#levelTitle"),
  loadWarning: document.querySelector("#loadWarning"),
  mapTitle: document.querySelector("#mapTitle"),
  missionEyebrow: document.querySelector("#missionEyebrow"),
  nextLevelButton: document.querySelector("#nextLevelButton"),
  nextLevelStatusButton: document.querySelector("#nextLevelStatusButton"),
  branchTargetButton: document.querySelector("#branchTargetButton"),
  parentTargetButton: document.querySelector("#parentTargetButton"),
  quickBlocksLabel: document.querySelector("#quickBlocksLabel"),
  quickBlocks: document.querySelector("#quickBlocks"),
  resetButton: document.querySelector("#resetButton"),
  rootTargetButton: document.querySelector("#rootTargetButton"),
  quickTarget: document.querySelector("#quickTarget"),
  resultLine: document.querySelector("#resultLine"),
  runButton: document.querySelector("#runButton"),
  runStatus: document.querySelector("#runStatus"),
  speedLabel: document.querySelector("#speedLabel"),
  speedRange: document.querySelector("#speedRange"),
  totalStars: document.querySelector("#totalStars"),
  totalStarsLabel: document.querySelector("#totalStarsLabel"),
  workspaceEyebrow: document.querySelector("#workspaceEyebrow"),
  workspaceTitle: document.querySelector("#workspaceTitle"),
};

let workspace = null;
let currentLevelIndex = -1;
let state = null;
let progress = readProgress();
let isRunning = false;
let audioContext = null;
let programStructure = [];
let selectedContainerId = "root";
let syncingWorkspace = false;
let programIdCounter = 0;

function applyStaticTranslations() {
  document.title = t("pageTitle");
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute("content", t("pageDescription"));
  }

  els.totalStarsLabel.textContent = t("totalStars");
  els.missionEyebrow.textContent = t("missionBoard");
  els.workspaceEyebrow.textContent = t("workspaceEyebrow");
  els.workspaceTitle.textContent = t("workspaceTitle");
  els.quickBlocksLabel.textContent = t("quickBlocks");
  els.levelSelectLabel.textContent = t("chooseLevel");
  els.levelSelect.setAttribute("aria-label", t("chooseLevel"));
  els.branchTargetButton.textContent = t("elseTarget");
  els.parentTargetButton.textContent = t("parentTarget");
  els.rootTargetButton.textContent = t("rootProgram");
  els.speedLabel.textContent = t("speed");
  els.loadWarning.textContent = t("loadWarning");
  setButtonText(els.hintToggle, els.hint.hidden ? t("showHint") : t("hideHint"));
  setButtonText(els.runButton, t("run"));
  setButtonText(els.resetButton, t("reset"));
  setButtonText(els.demoButton, t("demo"));
  setButtonText(els.nextLevelButton, t("nextLevel"));
  setButtonText(els.nextLevelStatusButton, t("nextLevel"));

  els.langButtons.forEach((button) => {
    const active = button.dataset.lang === currentLang;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function readCurrentLevelIndex() {
  try {
    const index = Number(localStorage.getItem(CURRENT_LEVEL_KEY) || 0);
    return Math.max(0, Math.min(LEVELS.length - 1, Number.isFinite(index) ? index : 0));
  } catch {
    return 0;
  }
}

function writeProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }
  if (!audioContext) {
    audioContext = new AudioContextClass();
  }
  return audioContext;
}

async function prepareAudio() {
  const context = getAudioContext();
  if (!context) {
    return;
  }
  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch {
      // Audio is optional; browsers may block it until a later gesture.
    }
  }
}

function playTone(frequency, start, duration, type = "sine", volume = 0.08) {
  const context = getAudioContext();
  if (!context || context.state !== "running") {
    return;
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

function vibrate(pattern) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function playSuccessSound() {
  const context = getAudioContext();
  if (!context || context.state !== "running") {
    return;
  }
  const now = context.currentTime;
  playTone(523.25, now, 0.16, "sine", 0.08);
  playTone(659.25, now + 0.09, 0.16, "sine", 0.08);
  playTone(783.99, now + 0.18, 0.22, "triangle", 0.09);
  vibrate(30);
}

function playFailSound() {
  const context = getAudioContext();
  if (!context || context.state !== "running") {
    return;
  }
  const now = context.currentTime;
  playTone(220, now, 0.16, "sawtooth", 0.055);
  playTone(174.61, now + 0.13, 0.2, "sawtooth", 0.05);
  vibrate([30, 45, 30]);
}

function parseXml(text) {
  if (window.Blockly?.utils?.xml?.textToDom) {
    return Blockly.utils.xml.textToDom(text);
  }
  return Blockly.Xml.textToDom(text);
}

function safeText(text) {
  return String(text).replace(/[&<>"']/g, (char) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return replacements[char];
  });
}

function nextProgramId() {
  programIdCounter += 1;
  return `p${programIdCounter}`;
}

function cloneProgramItem(item) {
  return {
    id: item.id || nextProgramId(),
    type: item.type,
    times: item.times,
    condition: item.condition,
    children: (item.children || []).map(cloneProgramItem),
    elseChildren: (item.elseChildren || []).map(cloneProgramItem),
  };
}

function childSequences(item) {
  return [item.children || [], item.elseChildren || []];
}

function targetParts(id) {
  if (id !== "root" && id.endsWith(":else")) {
    return { itemId: id.slice(0, -5), branch: "else" };
  }
  return { itemId: id, branch: "then" };
}

function countProgramBlocks(sequence = programStructure) {
  return sequence.reduce(
    (total, item) =>
      total + 1 + countProgramBlocks(item.children || []) + countProgramBlocks(item.elseChildren || []),
    0,
  );
}

function findProgramItem(id, sequence = programStructure) {
  const { itemId } = targetParts(id);
  for (const item of sequence) {
    if (item.id === itemId) {
      return item;
    }
    for (const childSequence of childSequences(item)) {
      const child = findProgramItem(itemId, childSequence);
      if (child) {
        return child;
      }
    }
  }
  return null;
}

function findProgramParentId(id, sequence = programStructure, parentId = "root") {
  const { itemId, branch } = targetParts(id);
  for (const item of sequence) {
    if (item.id === itemId) {
      return parentId;
    }
    const childParentId = findProgramParentId(itemId, item.children || [], item.id);
    if (childParentId) {
      return branch === "else" && childParentId === item.id ? `${item.id}:else` : childParentId;
    }
    const elseParentId = findProgramParentId(itemId, item.elseChildren || [], `${item.id}:else`);
    if (elseParentId) {
      return elseParentId;
    }
  }
  return null;
}

function getTargetSequence() {
  if (selectedContainerId === "root") {
    return programStructure;
  }
  const { branch } = targetParts(selectedContainerId);
  const target = findProgramItem(selectedContainerId);
  if (!target) {
    selectedContainerId = "root";
    return programStructure;
  }
  if (target.type === "if_else_condition" && branch === "else") {
    target.elseChildren ||= [];
    return target.elseChildren;
  }
  if (!("children" in target)) {
    selectedContainerId = "root";
    return programStructure;
  }
  return target.children;
}

function getTargetLabel() {
  if (selectedContainerId === "root") {
    return t("addToRoot");
  }
  const { branch } = targetParts(selectedContainerId);
  const target = findProgramItem(selectedContainerId);
  if (!target) {
    selectedContainerId = "root";
    return t("addToRoot");
  }
  if (target.type === "repeat_times") {
    return t("addToRepeat", { times: target.times || 1 });
  }
  if (target.type === "while_loop") {
    return t("addToWhile");
  }
  return branch === "else" ? t("addToElse") : t("addToIf");
}

function removeProgramItem(id, sequence = programStructure) {
  const index = sequence.findIndex((item) => item.id === id);
  if (index >= 0) {
    sequence.splice(index, 1);
    return true;
  }
  return sequence.some(
    (item) => removeProgramItem(id, item.children || []) || removeProgramItem(id, item.elseChildren || []),
  );
}

function keyOf(point) {
  return `${point.x},${point.y}`;
}

function samePoint(a, b) {
  return a.x === b.x && a.y === b.y;
}

function cloneStart(level) {
  return {
    x: level.start.x,
    y: level.start.y,
    dir: level.start.dir,
    collected: new Set(),
  };
}

function resetState() {
  const level = LEVELS[currentLevelIndex];
  state = cloneStart(level);
  setStatus(t("ready"), "neutral");
  setResult(t("defaultResult"), "neutral");
  renderBoard();
}

function setStatus(text, mode) {
  els.runStatus.textContent = text;
  els.runStatus.classList.toggle("is-good", mode === "good");
  els.runStatus.classList.toggle("is-bad", mode === "bad");
}

function setResult(text, mode) {
  els.resultLine.textContent = text;
  els.resultLine.classList.toggle("is-good", mode === "good");
  els.resultLine.classList.toggle("is-bad", mode === "bad");
}

function getBlockLimit(level = LEVELS[currentLevelIndex]) {
  return level.maxBlocks || level.targetBlocks;
}

function isOverBlockLimit() {
  return countLessonBlocks() > getBlockLimit();
}

function renderLevels() {
  els.levelSelect.innerHTML = STAGES.map((stage) => {
    const stageLevels = LEVELS
      .map((level, index) => ({ level, index }))
      .filter(({ level }) => level.stage === stage.id);

    if (!stageLevels.length) {
      return "";
    }

    const options = stageLevels.map(({ level, index }) => {
      const stars = progress[level.id]?.stars || 0;
      const title = t("levelCardTitle", { number: index + 1, title: levelText(level, "title") });
      const meta = `${levelText(level, "concept")} · ${t("limitShort", { limit: getBlockLimit(level) })} · ${"★".repeat(stars)}${"☆".repeat(3 - stars)}`;
      return `<option value="${index}">${safeText(`${title} - ${meta}`)}</option>`;
    }).join("");

    return `<optgroup label="${safeText(stageText(stage, "title"))}">${options}</optgroup>`;
  }).join("");

  if (currentLevelIndex >= 0) {
    els.levelSelect.value = String(currentLevelIndex);
  }

  const total = LEVELS.reduce((sum, level) => sum + (progress[level.id]?.stars || 0), 0);
  els.totalStars.textContent = `${total} / ${LEVELS.length * 3}`;
}

function renderBoard() {
  const level = LEVELS[currentLevelIndex];
  const walls = new Set(level.walls.map(keyOf));
  const gems = new Map(level.gems.map((gem) => [keyOf(gem), gem]));

  els.board.style.setProperty("--cols", level.grid.cols);
  els.board.style.setProperty("--rows", level.grid.rows);
  els.board.innerHTML = "";

  for (let y = 0; y < level.grid.rows; y += 1) {
    for (let x = 0; x < level.grid.cols; x += 1) {
      const point = { x, y };
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = x;
      cell.dataset.y = y;

      if (walls.has(keyOf(point))) {
        cell.classList.add("is-wall");
      }

      if (samePoint(point, level.goal)) {
        const goal = document.createElement("span");
        goal.className = "goal";
        goal.setAttribute("aria-hidden", "true");
        cell.append(goal);
      }

      if (gems.has(keyOf(point))) {
        const gem = document.createElement("span");
        gem.className = `gem${state.collected.has(keyOf(point)) ? " is-collected" : ""}`;
        gem.setAttribute("aria-hidden", "true");
        cell.append(gem);
      }

      if (state.x === x && state.y === y) {
        const bot = document.createElement("span");
        bot.className = `bot dir-${state.dir.toLowerCase()}`;
        bot.setAttribute("aria-hidden", "true");
        cell.append(bot);
      }

      els.board.append(cell);
    }
  }
}

function defineBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      type: "start",
      message0: t("startBlock"),
      nextStatement: null,
      colour: 145,
      tooltip: t("startTooltip"),
    },
    {
      type: "move_forward",
      message0: blockLabel("move_forward"),
      previousStatement: null,
      nextStatement: null,
      colour: 205,
      tooltip: t("moveTooltip"),
    },
    {
      type: "turn_left",
      message0: blockLabel("turn_left"),
      previousStatement: null,
      nextStatement: null,
      colour: 260,
      tooltip: t("turnLeftTooltip"),
    },
    {
      type: "turn_right",
      message0: blockLabel("turn_right"),
      previousStatement: null,
      nextStatement: null,
      colour: 260,
      tooltip: t("turnRightTooltip"),
    },
    {
      type: "collect_gem",
      message0: blockLabel("collect_gem"),
      previousStatement: null,
      nextStatement: null,
      colour: 38,
      tooltip: t("collectTooltip"),
    },
    {
      type: "repeat_times",
      message0: t("repeatMessage"),
      args0: [
        {
          type: "field_dropdown",
          name: "TIMES",
          options: repeatCountOptions(),
        },
      ],
      message1: t("repeatDoMessage"),
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 42,
      tooltip: t("repeatTooltip"),
    },
    {
      type: "while_loop",
      message0: t("whileMessage"),
      args0: [
        {
          type: "field_dropdown",
          name: "COND",
          options: conditionOptions(),
        },
      ],
      message1: t("whileDoMessage"),
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 165,
      tooltip: t("whileTooltip"),
    },
    {
      type: "if_condition",
      message0: t("ifBlockMessage"),
      args0: [
        {
          type: "field_dropdown",
          name: "COND",
          options: conditionOptions(),
        },
      ],
      message1: t("ifDoMessage"),
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 12,
      tooltip: t("ifTooltip"),
    },
    {
      type: "if_else_condition",
      message0: t("ifBlockMessage"),
      args0: [
        {
          type: "field_dropdown",
          name: "COND",
          options: conditionOptions(),
        },
      ],
      message1: t("ifDoMessage"),
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      message2: t("elseDoMessage"),
      args2: [
        {
          type: "input_statement",
          name: "ELSE",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 12,
      tooltip: t("ifElseTooltip"),
    },
  ]);
}

function toolboxFor(level) {
  const actionBlocks = level.blocks
    .filter((type) => type !== "repeat_times" && type !== "while_loop" && type !== "if_condition" && type !== "if_else_condition")
    .map((type) => `<block type="${type}"></block>`)
    .join("");
  const hasRepeat = level.blocks.includes("repeat_times");
  const hasWhile = level.blocks.includes("while_loop");
  const loopInner = [
    hasRepeat ? `<block type="repeat_times"><field name="TIMES">2</field></block>` : "",
    hasWhile ? `<block type="while_loop"></block>` : "",
  ].filter(Boolean).join("");
  const loopBlocks = loopInner
    ? `<category name="${safeText(t("loopCategory"))}" colour="#f4b63f">${loopInner}</category>`
    : "";
  const conditionBlocks = level.blocks.includes("if_condition")
    ? `<block type="if_condition"></block>`
    : "";
  const ifElseBlocks = level.blocks.includes("if_else_condition")
    ? `<block type="if_else_condition"></block>`
    : "";
  const conditionCategory = conditionBlocks || ifElseBlocks
    ? `<category name="${safeText(t("conditionCategory"))}" colour="#ef5962">${conditionBlocks}${ifElseBlocks}</category>`
    : "";

  return parseXml(`
    <xml xmlns="https://developers.google.com/blockly/xml">
      <category name="${safeText(t("actionCategory"))}" colour="#1d8fea">
        ${actionBlocks}
      </category>
      ${loopBlocks}
      ${conditionCategory}
    </xml>
  `);
}

function createStartBlock() {
  const xml = parseXml(`
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="start" x="28" y="28" deletable="false" movable="true"></block>
    </xml>
  `);
  Blockly.Xml.domToWorkspace(xml, workspace);
}

function getStartBlock() {
  if (!workspace) {
    return null;
  }
  return workspace.getTopBlocks(true).find((block) => block.type === "start") || null;
}

function appendBlockToProgram(type) {
  if (!workspace || isRunning) {
    return;
  }

  if (countProgramBlocks() + 1 > getBlockLimit()) {
    playFailSound();
    setStatus(t("tooManyBlocks"), "bad");
    setResult(t("tooManyBlocksAdd", { limit: getBlockLimit() }), "bad");
    return;
  }

  const item = { id: nextProgramId(), type };
  if (type === "repeat_times") {
    item.times = 2;
    item.children = [];
  }
  if (type === "while_loop") {
    item.condition = "FRONT_CLEAR";
    item.children = [];
  }
  if (type === "if_condition") {
    item.condition = type === "if_condition" ? "FRONT_BLOCKED" : undefined;
    item.children = [];
  }
  if (type === "if_else_condition") {
    item.condition = "FRONT_BLOCKED";
    item.children = [];
    item.elseChildren = [];
  }

  getTargetSequence().push(item);
  if (item.children) {
    selectedContainerId = item.id;
  }

  syncWorkspaceFromProgram();
  setResult(
    item.children
      ? t("addedContainer", { label: blockLabel(type) })
      : t("addedBlock", { label: blockLabel(type) }),
    "neutral",
  );
}

function renderQuickBlocks() {
  const level = LEVELS[currentLevelIndex];
  els.quickBlocks.innerHTML = level.blocks
    .map((type) => `<button class="quick-block-button" type="button" data-block-type="${type}">${safeText(blockLabel(type))}</button>`)
    .join("");

  els.quickBlocks.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => appendBlockToProgram(button.dataset.blockType));
  });
}

function sequenceToXml(sequence) {
  if (!sequence.length) {
    return "";
  }

  const [current, ...rest] = sequence;
  const nextXml = rest.length ? `<next>${sequenceToXml(rest)}</next>` : "";

  if (current.type === "repeat_times") {
    return `
      <block type="repeat_times" id="${safeText(current.id)}">
        <field name="TIMES">${current.times || 1}</field>
        <statement name="DO">${sequenceToXml(current.children || [])}</statement>
        ${nextXml}
      </block>
    `;
  }

  if (current.type === "while_loop") {
    return `
      <block type="while_loop" id="${safeText(current.id)}">
        <field name="COND">${current.condition || "FRONT_CLEAR"}</field>
        <statement name="DO">${sequenceToXml(current.children || [])}</statement>
        ${nextXml}
      </block>
    `;
  }

  if (current.type === "if_condition") {
    return `
      <block type="if_condition" id="${safeText(current.id)}">
        <field name="COND">${current.condition || "FRONT_BLOCKED"}</field>
        <statement name="DO">${sequenceToXml(current.children || [])}</statement>
        ${nextXml}
      </block>
    `;
  }

  if (current.type === "if_else_condition") {
    return `
      <block type="if_else_condition" id="${safeText(current.id)}">
        <field name="COND">${current.condition || "FRONT_BLOCKED"}</field>
        <statement name="DO">${sequenceToXml(current.children || [])}</statement>
        <statement name="ELSE">${sequenceToXml(current.elseChildren || [])}</statement>
        ${nextXml}
      </block>
    `;
  }

  return `<block type="${current.type}" id="${safeText(current.id)}">${nextXml}</block>`;
}

function programFromBlocks(block) {
  const sequence = [];
  let cursor = block;
  while (cursor) {
    const item = { id: cursor.id, type: cursor.type };
    if (cursor.type === "repeat_times") {
      item.times = Math.max(1, Math.min(12, Number(cursor.getFieldValue("TIMES")) || 1));
      item.children = programFromBlocks(cursor.getInputTargetBlock("DO"));
    } else if (cursor.type === "while_loop") {
      item.condition = cursor.getFieldValue("COND") || "FRONT_CLEAR";
      item.children = programFromBlocks(cursor.getInputTargetBlock("DO"));
    } else if (cursor.type === "if_condition") {
      item.condition = cursor.getFieldValue("COND") || "FRONT_BLOCKED";
      item.children = programFromBlocks(cursor.getInputTargetBlock("DO"));
    } else if (cursor.type === "if_else_condition") {
      item.condition = cursor.getFieldValue("COND") || "FRONT_BLOCKED";
      item.children = programFromBlocks(cursor.getInputTargetBlock("DO"));
      item.elseChildren = programFromBlocks(cursor.getInputTargetBlock("ELSE"));
    }
    sequence.push(item);
    cursor = cursor.getNextBlock();
  }
  return sequence;
}

function syncProgramFromWorkspace() {
  if (!workspace || syncingWorkspace) {
    return;
  }
  const start = getStartBlock();
  programStructure = programFromBlocks(start?.getNextBlock() || null);
  if (selectedContainerId !== "root" && !findProgramItem(selectedContainerId)) {
    selectedContainerId = "root";
  }
  renderProgramBuilder();
}

function syncWorkspaceFromProgram() {
  if (!workspace) {
    renderProgramBuilder();
    updateBlockCount();
    return;
  }

  syncingWorkspace = true;
  const xml = parseXml(`
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="start" x="28" y="28" deletable="false" movable="true">
        <next>${sequenceToXml(programStructure)}</next>
      </block>
    </xml>
  `);
  Blockly.Events.disable();
  try {
    workspace.clear();
    Blockly.Xml.domToWorkspace(xml, workspace);
    Blockly.svgResize(workspace);
  } finally {
    Blockly.Events.enable();
    syncingWorkspace = false;
  }
  renderProgramBuilder();
  updateBlockCount();
}

function renderProgramItem(item, depth = 0) {
  const isContainer =
    item.type === "repeat_times" || item.type === "while_loop" || item.type === "if_condition" || item.type === "if_else_condition";
  const selected = item.id === selectedContainerId ? " is-selected" : "";
  const depthStyle = ` style="--depth: ${depth}"`;
  const removeButton = `<button class="program-icon-button danger" type="button" data-remove-id="${item.id}" aria-label="${safeText(t("removeBlock", { label: blockLabel(item.type) }))}">×</button>`;

  if (item.type === "repeat_times") {
    return `
      <div class="program-item${selected}"${depthStyle}>
        <button class="program-chip is-container" type="button" data-select-container="${item.id}">${safeText(t("repeatChip", { times: item.times || 1 }))}</button>
        <button class="program-icon-button" type="button" data-repeat-dec="${item.id}" aria-label="${safeText(t("decreaseRepeat"))}">−</button>
        <button class="program-icon-button" type="button" data-repeat-inc="${item.id}" aria-label="${safeText(t("increaseRepeat"))}">＋</button>
        ${removeButton}
      </div>
      ${(item.children || []).map((child) => renderProgramItem(child, depth + 1)).join("")}
    `;
  }

  if (item.type === "while_loop") {
    return `
      <div class="program-item${selected}"${depthStyle}>
        <button class="program-chip is-container" type="button" data-select-container="${item.id}">${safeText(t("whileChip"))}</button>
        <label class="condition-select">
          <span>${safeText(t("condition"))}</span>
          <select data-condition-id="${item.id}">
            <option value="FRONT_BLOCKED"${item.condition === "FRONT_BLOCKED" ? " selected" : ""}>${safeText(t("frontBlocked"))}</option>
            <option value="FRONT_CLEAR"${item.condition === "FRONT_CLEAR" ? " selected" : ""}>${safeText(t("frontClear"))}</option>
            <option value="ON_GEM"${item.condition === "ON_GEM" ? " selected" : ""}>${safeText(t("onGem"))}</option>
          </select>
        </label>
        ${removeButton}
      </div>
      ${(item.children || []).map((child) => renderProgramItem(child, depth + 1)).join("")}
    `;
  }

  if (item.type === "if_condition") {
    return `
      <div class="program-item${selected}"${depthStyle}>
        <button class="program-chip is-container" type="button" data-select-container="${item.id}">${safeText(t("ifChip"))}</button>
        <label class="condition-select">
          <span>${safeText(t("condition"))}</span>
          <select data-condition-id="${item.id}">
            <option value="FRONT_BLOCKED"${item.condition === "FRONT_BLOCKED" ? " selected" : ""}>${safeText(t("frontBlocked"))}</option>
            <option value="FRONT_CLEAR"${item.condition === "FRONT_CLEAR" ? " selected" : ""}>${safeText(t("frontClear"))}</option>
            <option value="ON_GEM"${item.condition === "ON_GEM" ? " selected" : ""}>${safeText(t("onGem"))}</option>
          </select>
        </label>
        ${removeButton}
      </div>
      ${(item.children || []).map((child) => renderProgramItem(child, depth + 1)).join("")}
    `;
  }

  if (item.type === "if_else_condition") {
    const thenSelected = item.id === selectedContainerId ? " is-selected" : "";
    const elseSelected = `${item.id}:else` === selectedContainerId ? " is-selected" : "";
    return `
      <div class="program-item${thenSelected || elseSelected}"${depthStyle}>
        <button class="program-chip is-container${thenSelected}" type="button" data-select-container="${item.id}">${safeText(t("ifElseChip"))}</button>
        <button class="program-chip is-container${elseSelected}" type="button" data-select-container="${item.id}:else">${safeText(t("elseTarget"))}</button>
        <label class="condition-select">
          <span>${safeText(t("condition"))}</span>
          <select data-condition-id="${item.id}">
            <option value="FRONT_BLOCKED"${item.condition === "FRONT_BLOCKED" ? " selected" : ""}>${safeText(t("frontBlocked"))}</option>
            <option value="FRONT_CLEAR"${item.condition === "FRONT_CLEAR" ? " selected" : ""}>${safeText(t("frontClear"))}</option>
            <option value="ON_GEM"${item.condition === "ON_GEM" ? " selected" : ""}>${safeText(t("onGem"))}</option>
          </select>
        </label>
        ${removeButton}
      </div>
      ${(item.children || []).map((child) => renderProgramItem(child, depth + 1)).join("")}
      ${(item.elseChildren || []).map((child) => renderProgramItem(child, depth + 1)).join("")}
    `;
  }

  return `
    <div class="program-item"${depthStyle}>
      <span class="program-chip">${safeText(blockLabel(item.type))}</span>
      ${removeButton}
    </div>
  `;
}

function renderProgramBuilder() {
  const { branch } = targetParts(selectedContainerId);
  const selectedItem = selectedContainerId === "root" ? null : findProgramItem(selectedContainerId);
  if (selectedContainerId !== "root" && !selectedItem) {
    selectedContainerId = "root";
  }
  els.quickTarget.textContent = getTargetLabel();
  const isNestedTarget = selectedContainerId !== "root";
  els.parentTargetButton.hidden = !isNestedTarget;
  els.rootTargetButton.hidden = !isNestedTarget;
  const canSwitchBranch = selectedItem?.type === "if_else_condition";
  els.branchTargetButton.hidden = !canSwitchBranch;
  if (canSwitchBranch) {
    els.branchTargetButton.textContent = branch === "else" ? t("ifTarget") : t("elseTarget");
  }
}

function loadDemoProgram() {
  if (!workspace || isRunning) {
    return;
  }

  const level = LEVELS[currentLevelIndex];
  programStructure = level.solution.map(cloneProgramItem);
  selectedContainerId = "root";
  syncWorkspaceFromProgram();
  resetState();
  setResult(t("demoLoaded"), "neutral");
}

function initBlockly() {
  defineBlocks();

  const theme = Blockly.Theme.defineTheme("blockyEasy", {
    base: Blockly.Themes.Classic,
    componentStyles: {
      workspaceBackgroundColour: "#101828",
      toolboxBackgroundColour: "#0f172a",
      toolboxForegroundColour: "#f8fbff",
      flyoutBackgroundColour: "#172033",
      flyoutForegroundColour: "#f8fbff",
      flyoutOpacity: 1,
      scrollbarColour: "#39a3ff",
      insertionMarkerColour: "#22c55e",
      insertionMarkerOpacity: 0.45,
      cursorColour: "#22c55e",
    },
  });

  workspace = Blockly.inject("blocklyDiv", {
    toolbox: toolboxFor(LEVELS[currentLevelIndex]),
    trashcan: true,
    scrollbars: true,
    sounds: false,
    renderer: "zelos",
    theme,
    grid: {
      spacing: 24,
      length: 3,
      colour: "#2e3a4f",
      snap: true,
    },
    zoom: {
      controls: true,
      wheel: true,
      startScale: 0.92,
      maxScale: 1.25,
      minScale: 0.65,
      scaleSpeed: 1.1,
    },
  });

  workspace.addChangeListener(() => {
    if (!syncingWorkspace) {
      syncProgramFromWorkspace();
    }
    updateBlockCount();
  });
  createStartBlock();
  renderProgramBuilder();
  updateBlockCount();

  window.addEventListener("resize", () => {
    Blockly.svgResize(workspace);
  });
}

function countLessonBlocks() {
  if (!workspace) {
    return 0;
  }
  return workspace.getAllBlocks(false).filter((block) => block.type !== "start").length;
}

function updateBlockCount() {
  const count = countLessonBlocks();
  const limit = getBlockLimit();
  els.blockCount.textContent = t("blockCount", { count, limit });
  els.blockCount.classList.toggle("is-over-limit", count > limit);
}

function updateNextLevelButtons() {
  const isLastLevel = currentLevelIndex >= LEVELS.length - 1;
  [els.nextLevelButton, els.nextLevelStatusButton].forEach((button) => {
    button.disabled = isRunning || isLastLevel;
    setButtonText(button, isLastLevel ? t("lastLevel") : t("nextLevel"));
    button.setAttribute("aria-label", isLastLevel ? t("lastLevel") : t("nextLevel"));
  });
}

function blockSequenceFrom(block, commands = []) {
  let cursor = block;
  while (cursor) {
    if (commands.length > 120) {
      throw new Error(t("runaway"));
    }

    if (cursor.type === "move_forward") {
      commands.push({ type: "move", blockId: cursor.id });
    } else if (cursor.type === "turn_left") {
      commands.push({ type: "turn", value: -1, blockId: cursor.id });
    } else if (cursor.type === "turn_right") {
      commands.push({ type: "turn", value: 1, blockId: cursor.id });
    } else if (cursor.type === "collect_gem") {
      commands.push({ type: "collect", blockId: cursor.id });
    } else if (cursor.type === "if_condition") {
      commands.push({
        type: "if",
        condition: cursor.getFieldValue("COND"),
        children: blockSequenceFrom(cursor.getInputTargetBlock("DO"), []),
        blockId: cursor.id,
      });
    } else if (cursor.type === "if_else_condition") {
      commands.push({
        type: "if_else",
        condition: cursor.getFieldValue("COND"),
        children: blockSequenceFrom(cursor.getInputTargetBlock("DO"), []),
        elseChildren: blockSequenceFrom(cursor.getInputTargetBlock("ELSE"), []),
        blockId: cursor.id,
      });
    } else if (cursor.type === "repeat_times") {
      const times = Math.max(1, Math.min(12, Number(cursor.getFieldValue("TIMES")) || 1));
      const child = cursor.getInputTargetBlock("DO");
      for (let i = 0; i < times; i += 1) {
        commands.push({ type: "highlight", blockId: cursor.id });
        blockSequenceFrom(child, commands);
      }
    } else if (cursor.type === "while_loop") {
      commands.push({
        type: "while",
        condition: cursor.getFieldValue("COND"),
        children: blockSequenceFrom(cursor.getInputTargetBlock("DO"), []),
        blockId: cursor.id,
      });
    }

    cursor = cursor.getNextBlock();
  }
  return commands;
}

function getCommands() {
  const starts = workspace.getTopBlocks(true).filter((block) => block.type === "start");
  const start = starts[0];
  if (!start) {
    throw new Error(t("noStart"));
  }
  return blockSequenceFrom(start.getNextBlock(), []);
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function insideGrid(level, point) {
  return point.x >= 0 && point.y >= 0 && point.x < level.grid.cols && point.y < level.grid.rows;
}

function wallSet(level) {
  return new Set(level.walls.map(keyOf));
}

function pointAhead() {
  const delta = DELTAS[state.dir];
  return { x: state.x + delta.x, y: state.y + delta.y };
}

function conditionMatches(condition) {
  const level = LEVELS[currentLevelIndex];
  if (condition === "ON_GEM") {
    const gems = new Set(level.gems.map(keyOf));
    const here = keyOf(state);
    return gems.has(here) && !state.collected.has(here);
  }

  const next = pointAhead();
  const blocked = !insideGrid(level, next) || wallSet(level).has(keyOf(next));
  if (condition === "FRONT_CLEAR") {
    return !blocked;
  }
  return blocked;
}

function countCommands(commands) {
  return commands.reduce((total, command) => {
    if (command.type === "while") {
      return total + 1 + countCommands(command.children || []);
    }
    if (command.type === "if") {
      return total + 1 + countCommands(command.children || []);
    }
    if (command.type === "if_else") {
      return total + 1 + countCommands(command.children || []) + countCommands(command.elseChildren || []);
    }
    return total + 1;
  }, 0);
}

async function executeCommand(command) {
  const level = LEVELS[currentLevelIndex];
  if (command.type === "turn") {
    const nextIndex = (DIRS.indexOf(state.dir) + command.value + DIRS.length) % DIRS.length;
    state.dir = DIRS[nextIndex];
    setStatus(command.value > 0 ? t("turnRightStatus") : t("turnLeftStatus"), "neutral");
    renderBoard();
    return;
  }

  if (command.type === "move") {
    const delta = DELTAS[state.dir];
    const next = { x: state.x + delta.x, y: state.y + delta.y };
    const walls = wallSet(level);
    if (!insideGrid(level, next) || walls.has(keyOf(next))) {
      throw new Error(t("hitWall"));
    }
    state.x = next.x;
    state.y = next.y;
    setStatus(t("moveStatus"), "neutral");
    renderBoard();
    return;
  }

  if (command.type === "collect") {
    const here = keyOf(state);
    const gemKeys = new Set(level.gems.map(keyOf));
    if (!gemKeys.has(here)) {
      throw new Error(t("noGem"));
    }
    if (state.collected.has(here)) {
      throw new Error(t("gemAlready"));
    }
    state.collected.add(here);
    setStatus(t("collectStatus"), "neutral");
    renderBoard();
  }
}

function evaluateWin() {
  const level = LEVELS[currentLevelIndex];
  const allGems = level.gems.every((gem) => state.collected.has(keyOf(gem)));
  const reachedGoal = samePoint(state, level.goal);

  if (!reachedGoal) {
    return { ok: false, message: t("noGoal") };
  }
  if (!allGems) {
    return { ok: false, message: t("missingGems") };
  }

  const blockCount = countLessonBlocks();
  const efficient = blockCount <= level.targetBlocks;
  const stars = efficient ? 3 : 1;

  return {
    ok: true,
    stars,
    message: t("passedStars", { stars }),
  };
}

function finishSuccess(result) {
  const level = LEVELS[currentLevelIndex];
  const best = Math.max(progress[level.id]?.stars || 0, result.stars);
  progress[level.id] = { stars: best, completedAt: new Date().toISOString() };
  writeProgress();
  renderLevels();
  playSuccessSound();
  setStatus(t("complete"), "good");
  setResult(result.message, "good");
}

async function runCommandList(commands, commandTotal) {
  for (const command of commands) {
    if (workspace && command.blockId) {
      workspace.highlightBlock(command.blockId);
    }
    if (command.type === "highlight") {
      await delay(Math.min(100, Number(els.speedRange.value) || 50));
      continue;
    }

    if (command.type === "while") {
      let whileGuard = 0;
      while (conditionMatches(command.condition)) {
        whileGuard += 1;
        if (whileGuard > 200) {
          throw new Error(t("runaway"));
        }
        const nestedResult = await runCommandList(command.children || [], commandTotal);
        if (nestedResult) {
          return nestedResult;
        }
        await delay(Number(els.speedRange.value));
      }
      renderBoard();
    } else if (command.type === "if") {
      const matched = conditionMatches(command.condition);
      setStatus(matched ? t("conditionTrue") : t("conditionFalse"), "neutral");
      if (matched) {
        const nestedResult = await runCommandList(command.children || [], commandTotal);
        if (nestedResult) {
          return nestedResult;
        }
      }
      renderBoard();
    } else if (command.type === "if_else") {
      const matched = conditionMatches(command.condition);
      setStatus(matched ? t("conditionTrue") : t("conditionFalse"), "neutral");
      const branch = matched ? command.children || [] : command.elseChildren || [];
      const nestedResult = await runCommandList(branch, commandTotal);
      if (nestedResult) {
        return nestedResult;
      }
      renderBoard();
    } else {
      await executeCommand(command);
    }

    const stepResult = evaluateWin(commandTotal);
    if (stepResult.ok) {
      return stepResult;
    }
    await delay(Number(els.speedRange.value));
  }
  return null;
}

async function runProgram() {
  if (isRunning || !workspace) {
    return;
  }

  const level = LEVELS[currentLevelIndex];
  await prepareAudio();
  let commands = [];
  try {
    if (isOverBlockLimit()) {
      throw new Error(t("cannotRunLimit", { limit: getBlockLimit() }));
    }
    commands = getCommands();
    if (commands.length === 0) {
      throw new Error(t("addBlocksFirst"));
    }
  } catch (error) {
    playFailSound();
    setStatus(t("cannotRun"), "bad");
    setResult(error.message, "bad");
    return;
  }

  isRunning = true;
  els.runButton.disabled = true;
  updateNextLevelButtons();
  resetState();
  setStatus(t("running"), "neutral");
  setResult(t("runningResult"), "neutral");

  try {
    const commandTotal = countCommands(commands);
    const earlyResult = await runCommandList(commands, commandTotal);
    if (earlyResult) {
      finishSuccess(earlyResult);
      return;
    }

    const result = evaluateWin(commandTotal);
    if (!result.ok) {
      playFailSound();
      setStatus(t("adjust"), "bad");
      setResult(result.message, "bad");
      return;
    }

    finishSuccess(result);
  } catch (error) {
    playFailSound();
    setStatus(t("adjust"), "bad");
    setResult(error.message, "bad");
  } finally {
    if (workspace) {
      workspace.highlightBlock(null);
    }
    isRunning = false;
    els.runButton.disabled = false;
    updateNextLevelButtons();
  }
}

function goToNextLevel() {
  if (isRunning || currentLevelIndex >= LEVELS.length - 1) {
    return;
  }
  loadLevel(currentLevelIndex + 1);
}

function loadLevel(index) {
  if (isRunning || index === currentLevelIndex) {
    return;
  }

  currentLevelIndex = index;
  try {
    localStorage.setItem(CURRENT_LEVEL_KEY, String(index));
  } catch {
    // Progress still works without persistent storage.
  }
  const level = LEVELS[currentLevelIndex];
  els.levelKicker.textContent = t("levelKicker", { number: index + 1 });
  els.levelTitle.textContent = levelText(level, "title");
  els.levelGoal.textContent = levelText(level, "goalText");
  els.levelConcept.textContent = levelText(level, "concept");
  els.blockLimit.textContent = t("blockLimit", { limit: getBlockLimit(level) });
  els.mapTitle.textContent = levelText(level, "title") || t("mapTitleFallback");
  els.hint.textContent = levelText(level, "hint");
  els.hint.hidden = true;
  els.hintToggle.setAttribute("aria-expanded", "false");
  setButtonText(els.hintToggle, t("showHint"));
  renderQuickBlocks();
  programStructure = [];
  selectedContainerId = "root";

  if (workspace) {
    workspace.clear();
    workspace.updateToolbox(toolboxFor(level));
    createStartBlock();
    Blockly.svgResize(workspace);
  }

  resetState();
  renderProgramBuilder();
  renderLevels();
  updateBlockCount();
  updateNextLevelButtons();
}

function bindEvents() {
  els.runButton.addEventListener("click", runProgram);
  els.resetButton.addEventListener("click", () => {
    resetState();
    if (workspace) {
      programStructure = [];
      selectedContainerId = "root";
      syncWorkspaceFromProgram();
    }
  });
  els.demoButton.addEventListener("click", loadDemoProgram);
  els.nextLevelButton.addEventListener("click", goToNextLevel);
  els.nextLevelStatusButton.addEventListener("click", goToNextLevel);
  els.levelSelect.addEventListener("change", () => {
    loadLevel(Number(els.levelSelect.value));
  });
  els.parentTargetButton.addEventListener("click", () => {
    selectedContainerId = findProgramParentId(selectedContainerId) || "root";
    renderProgramBuilder();
  });
  els.branchTargetButton.addEventListener("click", () => {
    const { itemId, branch } = targetParts(selectedContainerId);
    const item = findProgramItem(itemId);
    if (item?.type !== "if_else_condition") {
      selectedContainerId = "root";
    } else {
      selectedContainerId = branch === "else" ? item.id : `${item.id}:else`;
    }
    renderProgramBuilder();
  });
  els.rootTargetButton.addEventListener("click", () => {
    selectedContainerId = "root";
    renderProgramBuilder();
  });

  els.hintToggle.addEventListener("click", () => {
    const open = els.hint.hidden;
    els.hint.hidden = !open;
    els.hintToggle.setAttribute("aria-expanded", String(open));
    setButtonText(els.hintToggle, open ? t("hideHint") : t("showHint"));
  });

  els.langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextLang = button.dataset.lang === "en" ? "en" : "zh";
      if (nextLang === currentLang) {
        return;
      }
      try {
        localStorage.setItem(LANGUAGE_KEY, nextLang);
      } catch {
        // The language switch can fall back to the current page language.
      }
      window.location.reload();
    });
  });
}

function boot() {
  applyStaticTranslations();
  bindEvents();
  const initialLevelIndex = readCurrentLevelIndex();
  renderLevels();
  loadLevel(initialLevelIndex);

  if (!window.Blockly) {
    els.loadWarning.hidden = false;
    els.runButton.disabled = true;
    setStatus(t("missingBlockly"), "bad");
    return;
  }

  initBlockly();
  loadLevel(initialLevelIndex);
}

window.addEventListener("DOMContentLoaded", boot);
