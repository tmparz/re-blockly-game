import { wallsOutsidePath } from "../walls.js";

export const levels21 = [
{
    id: "challenge-left-hand-maze",
    stage: "challenge",
    title: "大型：左手法長迷宮",
    concept: "While + If/Else + 感測",
    goalText: "在 8x8 長迷宮中用左手貼牆法前進，沿路啟動三座能量站。",
    hint: "外層用 While（還沒到傳送門）。每回合先看左邊，接著用 If/Else 決定前進或右轉，最後檢查寶石。",
    grid: { cols: 8, rows: 8 },
    start: { x: 0, y: 7, dir: "E" },
    goal: { x: 7, y: 0 },
    walls: wallsOutsidePath(8, 8, [
      { x: 0, y: 7 }, { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 },
      { x: 7, y: 6 }, { x: 7, y: 5 },
      { x: 6, y: 5 }, { x: 5, y: 5 },
      { x: 5, y: 4 }, { x: 5, y: 3 },
      { x: 6, y: 3 }, { x: 7, y: 3 },
      { x: 7, y: 2 }, { x: 7, y: 1 }, { x: 7, y: 0 },
    ]),
    gems: [
      { x: 7, y: 7 },
      { x: 5, y: 5 },
      { x: 7, y: 0 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "while_loop", "if_condition", "if_else_condition", "collect_gem"],
    targetBlocks: 8,
    solution: [
      {
        type: "while_loop",
        condition: "NOT_DONE",
        children: [
          {
            type: "if_condition",
            condition: "LEFT_CLEAR",
            children: [{ type: "turn_left" }],
          },
          {
            type: "if_else_condition",
            condition: "FRONT_CLEAR",
            children: [{ type: "move_forward" }],
            elseChildren: [{ type: "turn_right" }],
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
    id: "challenge-final-factory",
    stage: "challenge",
    title: "大型：最終綜合工廠",
    concept: "全積木綜合",
    goalText: "在 10x10 工廠迷宮中，使用重複、While、If、If/Else 與收集規則抵達最右上方傳送門。",
    hint: "這關把規則包成一組：左邊可走先左轉；前方可走就前進，否則右轉；站到寶石就收集。外層 While 持續執行，內層重複 2 次。",
    grid: { cols: 10, rows: 10 },
    start: { x: 0, y: 9, dir: "E" },
    goal: { x: 9, y: 0 },
    walls: wallsOutsidePath(10, 10, [
      { x: 0, y: 9 }, { x: 1, y: 9 }, { x: 2, y: 9 }, { x: 3, y: 9 }, { x: 4, y: 9 }, { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 }, { x: 9, y: 9 },
      { x: 9, y: 8 }, { x: 9, y: 7 },
      { x: 8, y: 7 }, { x: 7, y: 7 },
      { x: 7, y: 6 }, { x: 7, y: 5 },
      { x: 8, y: 5 }, { x: 9, y: 5 },
      { x: 9, y: 4 }, { x: 9, y: 3 },
      { x: 8, y: 3 }, { x: 7, y: 3 }, { x: 6, y: 3 }, { x: 5, y: 3 },
      { x: 5, y: 2 }, { x: 5, y: 1 },
      { x: 6, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 1 }, { x: 9, y: 1 },
      { x: 9, y: 0 },
    ]),
    gems: [
      { x: 9, y: 9 },
      { x: 7, y: 5 },
      { x: 5, y: 1 },
      { x: 9, y: 0 },
    ],
    blocks: ["move_forward", "turn_left", "turn_right", "repeat_times", "while_loop", "if_condition", "if_else_condition", "collect_gem"],
    targetBlocks: 9,
    solution: [
      {
        type: "while_loop",
        condition: "NOT_DONE",
        children: [
          {
            type: "repeat_times",
            times: 2,
            children: [
              {
                type: "if_condition",
                condition: "LEFT_CLEAR",
                children: [{ type: "turn_left" }],
              },
              {
                type: "if_else_condition",
                condition: "FRONT_CLEAR",
                children: [{ type: "move_forward" }],
                elseChildren: [{ type: "turn_right" }],
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
    ],
  },
];
