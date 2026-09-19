import { wallsOutsidePath } from "../walls.js";

export const levels20 = [
{
    id: "maze-front-else-turn",
    stage: "maze",
    title: "迷宮：前方不通就選路",
    concept: "While + If/Else",
    goalText: "前方可走就前進；前方被擋住時，再決定左轉或右轉。",
    hint: "外層用 While（任務還沒完成）。主規則是 If/Else：前方沒牆就前進；否則用另一個 If/Else 判斷左邊是否可走。",
    grid: { cols: 5, rows: 3 },
    start: { x: 0, y: 2, dir: "E" },
    goal: { x: 4, y: 0 },
    walls: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 4, y: 1 },
      { x: 3, y: 2 },
      { x: 4, y: 2 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "turn_right", "while_loop", "if_else_condition"],
    targetBlocks: 6,
    solution: [
      {
        type: "while_loop",
        condition: "NOT_DONE",
        children: [
          {
            type: "if_else_condition",
            condition: "FRONT_CLEAR",
            children: [{ type: "move_forward" }],
            elseChildren: [
              {
                type: "if_else_condition",
                condition: "LEFT_CLEAR",
                children: [{ type: "turn_left" }],
                elseChildren: [{ type: "turn_right" }],
              },
            ],
          },
        ],
      },
    ],
  },
{
    id: "maze-left-hand-rule",
    stage: "maze",
    title: "迷宮：左手貼牆與死巷",
    concept: "感測、轉身與回程",
    goalText: "用左手貼牆法走過含死巷的迷宮；遇死巷要轉身回來。",
    hint: "能左轉先左轉；接著前方可走就前進，否則右轉。死巷中連續兩次右轉會完成回頭。",
    grid: {"cols":5,"rows":5},
    start: {"x":0,"y":4,"dir":"E"},
    goal: {"x":4,"y":0},
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
      { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 },
    ],
    gems: [],
    blocks: ["move_forward","turn_left","turn_right","while_loop","if_condition","if_else_condition"],
    targetBlocks: 6,
    solution: [
      { type: "while_loop", condition: "NOT_DONE",
        children: [
          { type: "if_condition", condition: "LEFT_CLEAR",
            children: [
              { type: "turn_left" },
            ],
          },
          { type: "if_else_condition", condition: "FRONT_CLEAR",
            children: [
              { type: "move_forward" },
            ],
            elseChildren: [
              { type: "turn_right" },
            ],
          },
        ],
      },
    ],
  },
{
    id: "challenge-perimeter-relay",
    stage: "challenge",
    title: "大型：外圈巡檢",
    concept: "Repeat + While + If",
    goalText: "沿著 7x7 外圈走三段，每到角落就啟動能量站，最後停在左上角傳送門。",
    hint: "把「While 走到底、If 收集、左轉」放進重複 3 次。這是把前面學過的 For、While、If 組成一個巡檢流程。",
    grid: { cols: 7, rows: 7 },
    start: { x: 0, y: 6, dir: "E" },
    goal: { x: 0, y: 0 },
    walls: wallsOutsidePath(7, 7, [
      { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 },
      { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 6, y: 3 }, { x: 6, y: 2 }, { x: 6, y: 1 }, { x: 6, y: 0 },
      { x: 5, y: 0 }, { x: 4, y: 0 }, { x: 3, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 },
    ]),
    gems: [
      { x: 6, y: 6 },
      { x: 6, y: 0 },
      { x: 0, y: 0 },
    ],
    blocks: ["move_forward", "turn_left", "repeat_times", "while_loop", "if_condition", "collect_gem"],
    targetBlocks: 6,
    solution: [
      {
        type: "repeat_times",
        times: 3,
        children: [
          {
            type: "while_loop",
            condition: "FRONT_CLEAR",
            children: [{ type: "move_forward" }],
          },
          {
            type: "if_condition",
            condition: "ON_GEM",
            children: [{ type: "collect_gem" }],
          },
          { type: "turn_left" },
        ],
      },
    ],
  },
{
    id: "challenge-serpentine-production",
    stage: "challenge",
    title: "大型：蛇形生產線",
    concept: "While + Repeat + 收集",
    goalText: "掃描 8x7 生產線，依序走完三條長廊並啟動每條線末端的能量站。",
    hint: "長直線用 While，換線用重複 2 步和轉彎。這關練習把大地圖切成幾段可控流程。",
    grid: { cols: 8, rows: 7 },
    start: { x: 0, y: 6, dir: "E" },
    goal: { x: 7, y: 2 },
    walls: wallsOutsidePath(8, 7, [
      { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 },
      { x: 7, y: 5 }, { x: 7, y: 4 },
      { x: 6, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 4 }, { x: 3, y: 4 }, { x: 2, y: 4 }, { x: 1, y: 4 }, { x: 0, y: 4 },
      { x: 0, y: 3 }, { x: 0, y: 2 },
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 },
    ]),
    gems: [
      { x: 7, y: 6 },
      { x: 0, y: 4 },
      { x: 7, y: 2 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "while_loop", "if_condition", "collect_gem"],
    targetBlocks: 20,
    solution: [
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
      },
      {
        type: "if_condition",
        condition: "ON_GEM",
        children: [{ type: "collect_gem" }],
      },
      { type: "turn_left" },
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
      { type: "turn_left" },
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
      },
      {
        type: "if_condition",
        condition: "ON_GEM",
        children: [{ type: "collect_gem" }],
      },
      { type: "turn_right" },
      {
        type: "repeat_times",
        times: 2,
        children: [{ type: "move_forward" }],
      },
      { type: "turn_right" },
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
      },
      {
        type: "if_condition",
        condition: "ON_GEM",
        children: [{ type: "collect_gem" }],
      },
    ],
  },
];
