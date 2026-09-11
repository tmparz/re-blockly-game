export const levels19 = [
{
    id: "if-else-first-choice",
    stage: "if",
    title: "Else：第一次二選一",
    concept: "If/Else + While + For",
    goalText: "如果前方可走就前進；否則先轉向，再用 While 走到出口。",
    hint: "這關同時有 If/Else、While、重複。先用 If/Else 決定方向，再用 While 走到底；While 裡用重複 1 次包住前進。",
    grid: { cols: 4, rows: 4 },
    start: { x: 1, y: 3, dir: "E" },
    goal: { x: 1, y: 1 },
    walls: [{ x: 2, y: 3 }],
    gems: [],
    blocks: ["move_forward", "turn_left", "repeat_times", "while_loop", "if_else_condition"],
    targetBlocks: 6,
    solution: [
      {
        type: "if_else_condition",
        condition: "FRONT_CLEAR",
        children: [{ type: "move_forward" }],
        elseChildren: [{ type: "turn_left" }],
      },
      {
        type: "while_loop",
        condition: "FRONT_CLEAR",
        children: [
          {
            type: "repeat_times",
            times: 1,
            children: [{ type: "move_forward" }],
          },
        ],
      },
    ],
  },
{
    id: "if-else-left-zigzag",
    stage: "if",
    title: "Else：左轉自動路線",
    concept: "While + For + If / Else",
    goalText: "用 While 控制還沒到傳送門時持續執行，再用重複包住 If/Else 規則。",
    hint: "外層用 While（還沒到傳送門），裡面重複 2 次：如果前方有牆就左轉，否則前進一步。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 4, dir: "E" },
    goal: { x: 2, y: 1 },
    walls: [
      { x: 4, y: 4 },
      { x: 3, y: 0 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "repeat_times", "while_loop", "if_else_condition"],
    targetBlocks: 5,
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
                type: "if_else_condition",
                condition: "FRONT_BLOCKED",
                children: [{ type: "turn_left" }],
                elseChildren: [{ type: "move_forward" }],
              },
            ],
          },
        ],
      },
    ],
  },
{
    id: "if-else-right-zigzag",
    stage: "if",
    title: "Else：右轉自動路線",
    concept: "While + For + If / Else",
    goalText: "換成右轉規則，讓程式在還沒到傳送門時自動重複判斷。",
    hint: "和上一關相同，外層用 While、內層用重複 2 次；差別是遇牆時改成右轉。",
    grid: { cols: 5, rows: 5 },
    start: { x: 0, y: 0, dir: "E" },
    goal: { x: 2, y: 3 },
    walls: [
      { x: 4, y: 0 },
      { x: 3, y: 4 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_right", "repeat_times", "while_loop", "if_else_condition"],
    targetBlocks: 5,
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
                type: "if_else_condition",
                condition: "FRONT_BLOCKED",
                children: [{ type: "turn_right" }],
                elseChildren: [{ type: "move_forward" }],
              },
            ],
          },
        ],
      },
    ],
  },
{
    id: "if-else-final-gem-maze",
    stage: "if",
    title: "最終 If：自動轉彎收集",
    concept: "While + For + If + Else 綜合",
    goalText: "用 While 持續執行，搭配重複、If/Else 自動轉彎，並用 If 收集沿路寶石。",
    hint: "外層用 While（還沒到傳送門），裡面重複 2 次：先 If/Else 自動轉彎或前進，再 If 檢查寶石。",
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
    blocks: ["move_forward", "turn_left", "repeat_times", "while_loop", "if_condition", "if_else_condition", "collect_gem"],
    targetBlocks: 7,
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
    ],
  },
{
    id: "maze-right-turn-rule",
    stage: "maze",
    title: "迷宮：右側有路就轉",
    concept: "While + 右側感測",
    goalText: "每一步都檢查右側是否有路；有路就右轉，否則繼續往前走。",
    hint: "外層用 While（還沒到傳送門）。裡面先判斷「右邊沒牆」就右轉，最後前進一步。",
    grid: { cols: 4, rows: 4 },
    start: { x: 0, y: 1, dir: "E" },
    goal: { x: 2, y: 3 },
    walls: [
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_right", "while_loop", "if_condition"],
    targetBlocks: 4,
    solution: [
      {
        type: "while_loop",
        condition: "NOT_DONE",
        children: [
          {
            type: "if_condition",
            condition: "RIGHT_CLEAR",
            children: [{ type: "turn_right" }],
          },
          { type: "move_forward" },
        ],
      },
    ],
  },
{
    id: "maze-left-right-sensors",
    stage: "maze",
    title: "迷宮：左右路口",
    concept: "多個 If 感測",
    goalText: "同一輪規則中先檢查左邊，再檢查右邊，最後前進。",
    hint: "外層用 While（還沒到傳送門）。裡面依序放：如果左邊沒牆就左轉；如果右邊沒牆就右轉；前進一步。",
    grid: { cols: 3, rows: 5 },
    start: { x: 1, y: 4, dir: "N" },
    goal: { x: 0, y: 1 },
    walls: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 0, y: 3 },
      { x: 2, y: 3 },
      { x: 0, y: 4 },
      { x: 2, y: 4 },
    ],
    gems: [],
    blocks: ["move_forward", "turn_left", "turn_right", "while_loop", "if_condition"],
    targetBlocks: 6,
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
            type: "if_condition",
            condition: "RIGHT_CLEAR",
            children: [{ type: "turn_right" }],
          },
          { type: "move_forward" },
        ],
      },
    ],
  },
];
