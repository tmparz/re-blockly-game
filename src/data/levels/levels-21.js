import { wallsOutsidePath } from "../walls.js";

export const levels21 = [
{
    id: "challenge-left-hand-maze",
    stage: "challenge",
    title: "大型：左手法支線採集",
    concept: "通用規則與回程空檢查",
    goalText: "探索 8x8 迷宮的死巷支線，收齊四顆寶石，再到右上方出口。",
    hint: "沿用左手貼牆法，再加上 If（站在寶石上）。回到走過的格子時，已收集的寶石不會再成立。",
    grid: {"cols":8,"rows":8},
    start: {"x":0,"y":7,"dir":"E"},
    goal: {"x":7,"y":0},
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 6, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
      { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
      { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 },
      { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 },
      { x: 4, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 },
      { x: 4, y: 5 }, { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 },
      { x: 6, y: 6 },
    ],
    gems: [{"x":7,"y":7},{"x":5,"y":5},{"x":7,"y":0},{"x":3,"y":5}],
    blocks: ["move_forward","turn_left","turn_right","while_loop","if_condition","if_else_condition","collect_gem"],
    targetBlocks: 8,
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
          { type: "if_condition", condition: "ON_GEM",
            children: [
              { type: "collect_gem" },
            ],
          },
        ],
      },
    ],
  },
{
    id: "challenge-final-factory",
    stage: "challenge",
    title: "大型：多支線工廠驗收",
    concept: "規則泛化與完整採集",
    goalText: "在 10x10 工廠探索三條死巷，收齊七顆寶石，再到右上方出口。",
    hint: "不必依地圖長度數步數。沿用左手貼牆與有寶石才收集的規則；每條支線都會回程，走過出口也要先確認寶石收齊。",
    grid: {"cols":10,"rows":10},
    start: {"x":0,"y":9,"dir":"E"},
    goal: {"x":9,"y":0},
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 6, y: 0 },
      { x: 7, y: 0 }, { x: 8, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
      { x: 4, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 6, y: 2 }, { x: 7, y: 2 }, { x: 8, y: 2 }, { x: 9, y: 2 }, { x: 0, y: 3 }, { x: 1, y: 3 },
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 },
      { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 }, { x: 0, y: 5 },
      { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 6, y: 5 }, { x: 0, y: 6 },
      { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 },
      { x: 8, y: 6 }, { x: 9, y: 6 }, { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 4, y: 7 },
      { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 0, y: 8 }, { x: 1, y: 8 }, { x: 2, y: 8 }, { x: 4, y: 8 },
      { x: 5, y: 8 }, { x: 6, y: 8 }, { x: 7, y: 8 }, { x: 8, y: 8 },
    ],
    gems: [
      { x: 9, y: 9 }, { x: 7, y: 5 }, { x: 5, y: 1 }, { x: 9, y: 0 }, { x: 3, y: 7 }, { x: 5, y: 5 },
      { x: 5, y: 0 },
    ],
    blocks: ["move_forward","turn_left","turn_right","repeat_times","while_loop","if_condition","if_else_condition","collect_gem"],
    targetBlocks: 8,
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
          { type: "if_condition", condition: "ON_GEM",
            children: [
              { type: "collect_gem" },
            ],
          },
        ],
      },
    ],
  },
];
