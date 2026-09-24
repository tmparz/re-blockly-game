// Unit 1 · Bug Hunt: every mission starts with code that has a bug. Find it, fix it, test again.
export const bugHunt = [
  {
    id: "bug-1",
    title: { en: "Wrong Turn", zh: "轉錯彎" },
    story: {
      en: "Robo wants to reach the flag, but it keeps bumping into a wall. Run the code, watch where it goes wrong, then fix ONE block.",
      zh: "Robo 想走到旗子，卻一直撞牆。先執行看看哪裡出錯，再修好「一個」方塊。",
    },
    hint: { en: "Watch the corner. Which way should Robo turn there?", zh: "注意轉角。Robo 在那裡應該往哪邊轉？" },
    maps: [[">..#", "##.#", "##G#"]],
    blocks: ["move", "left", "right"],
    starter: { main: ["move", "move", "left", "move", "move"] },
    solution: { main: ["move", "move", "right", "move", "move"] },
  },
  {
    id: "bug-2",
    title: { en: "Almost There", zh: "差一點點" },
    story: {
      en: "The loop is almost right, but Robo stops one square too early. Change a number to fix it.",
      zh: "迴圈幾乎正確，但 Robo 早一格就停下來了。改一個數字把它修好。",
    },
    hint: { en: "Count the squares between Robo and the flag.", zh: "數一數 Robo 和旗子之間有幾格。" },
    maps: [[">....G"]],
    blocks: ["move", "repeat"],
    starter: { main: [{ repeat: 4, do: ["move"] }] },
    solution: { main: [{ repeat: 5, do: ["move"] }] },
  },
  {
    id: "bug-3",
    title: { en: "Mixed-Up Order", zh: "順序亂掉了" },
    story: {
      en: "All the right blocks are here, but two of them are in the wrong order. Swap them!",
      zh: "需要的方塊都在，但有兩個順序放反了。把它們交換！",
    },
    hint: { en: "What should Robo do first: move or turn?", zh: "Robo 應該先前進，還是先轉彎？" },
    maps: [[">.#", "#.#", "#.G"]],
    blocks: ["move", "left", "right"],
    starter: { main: ["right", "move", "move", "move", "left", "move"] },
    solution: { main: ["move", "right", "move", "move", "left", "move"] },
  },
  {
    id: "bug-4",
    title: { en: "Stuck in the Loop", zh: "卡在迴圈裡" },
    story: {
      en: "Robo climbs the stairs, but one block is inside the loop when it should come after it.",
      zh: "Robo 要爬樓梯，但有一個方塊放在迴圈裡面，它其實應該放在迴圈後面。",
    },
    hint: {
      en: "Blocks inside the loop happen every time. The last step only happens once.",
      zh: "迴圈裡的方塊每一圈都會做。最後一步只需要做一次。",
    },
    maps: [[">.####", "#..###", "##..##", "###..#", "####.G"]],
    blocks: ["move", "left", "right", "repeat"],
    starter: { main: [{ repeat: 4, do: ["move", "right", "move", "left", "move"] }] },
    solution: { main: [{ repeat: 4, do: ["move", "right", "move", "left"] }, "move"] },
  },
  {
    id: "bug-5",
    title: { en: "Grab, Then Go?", zh: "先撿還是先走？" },
    story: {
      en: "Robo should pick up every gem, but it tries to grab a gem where there is none.",
      zh: "Robo 要撿起每一顆寶石，但它在沒有寶石的地方就伸手去撿。",
    },
    hint: { en: "Look at the order of the two blocks inside the loop.", zh: "看看迴圈裡兩個方塊的順序。" },
    maps: [[">****G"]],
    blocks: ["move", "pick", "repeat"],
    starter: { main: [{ repeat: 4, do: ["pick", "move"] }, "move"] },
    solution: { main: [{ repeat: 4, do: ["move", "pick"] }, "move"] },
  },
  {
    id: "bug-6",
    title: { en: "The Loop That Never Ends", zh: "停不下來的迴圈" },
    story: {
      en: "Robo walks to the corner and then freezes forever. What should Robo do when there is no path ahead?",
      zh: "Robo 走到轉角就永遠停住了。前面沒有路的時候，Robo 應該做什麼？",
    },
    hint: {
      en: "Try the if / else block: if there is a path ahead, move. Else, turn.",
      zh: "試試「如果／否則」：前方有路就前進，否則就轉彎。",
    },
    maps: [[">...#", "###.#", "###G#"]],
    blocks: ["move", "left", "right", "until", "if", "ifElse"],
    starter: { main: [{ until: true, do: [{ if: "pathAhead", do: ["move"] }] }] },
    solution: { main: [{ until: true, do: [{ if: "pathAhead", do: ["move"], else: ["right"] }] }] },
  },
  {
    id: "bug-7",
    title: { en: "Left or Right?", zh: "左轉還是右轉？" },
    story: {
      en: "This code works for many mazes, but not this one. Robo keeps spinning in circles.",
      zh: "這段程式在很多迷宮都能用，但這個不行。Robo 一直在原地繞圈。",
    },
    hint: { en: "Trace the path with your finger. Which way does it bend?", zh: "用手指沿著路走一次。路是往哪邊彎？" },
    maps: [["#G..", "###.", ">..."]],
    blocks: ["move", "left", "right", "until", "ifElse"],
    starter: { main: [{ until: true, do: [{ if: "pathAhead", do: ["move"], else: ["right"] }] }] },
    solution: { main: [{ until: true, do: [{ if: "pathAhead", do: ["move"], else: ["left"] }] }] },
  },
  {
    id: "bug-8",
    title: { en: "Only If There Is a Gem", zh: "有寶石才撿" },
    story: {
      en: "Some squares have gems and some do not. Robo tries to pick up a gem on every square. Fix it so Robo checks first.",
      zh: "有些格子有寶石，有些沒有。Robo 每一格都去撿。修好它，讓 Robo 先檢查。",
    },
    hint: { en: "Put the pick-up block inside an if block.", zh: "把「撿起」方塊放進「如果」方塊裡。" },
    maps: [[">.*.**.G"]],
    blocks: ["move", "pick", "until", "if"],
    starter: { main: [{ until: true, do: ["move", "pick"] }] },
    solution: { main: [{ until: true, do: ["move", { if: "gemHere", do: ["pick"] }] }] },
  },
  {
    id: "bug-9",
    title: { en: "Loop Inside a Loop", zh: "迴圈裡的迴圈" },
    story: {
      en: "Robo should walk two squares, then turn. The turn block is in the wrong loop.",
      zh: "Robo 應該走兩格再轉彎。轉彎方塊放錯迴圈了。",
    },
    hint: {
      en: "The inner loop is for walking. The turn belongs to the outer loop.",
      zh: "裡面的迴圈負責走路，轉彎應該屬於外面的迴圈。",
    },
    maps: [[">..", "##.", "G.."]],
    blocks: ["move", "right", "repeat"],
    starter: { main: [{ repeat: 3, do: [{ repeat: 2, do: ["move", "right"] }] }] },
    solution: { main: [{ repeat: 3, do: [{ repeat: 2, do: ["move"] }, "right"] }] },
  },
  {
    id: "bug-10",
    title: { en: "Double Bug", zh: "兩隻蟲" },
    story: {
      en: "Boss level! This code has TWO bugs. Fix one, run it again, then find the next one.",
      zh: "魔王關！這段程式有「兩個」錯誤。修好一個，再執行一次，然後找下一個。",
    },
    hint: {
      en: "Bug 1: picking up when there is no gem. Bug 2: turning the wrong way.",
      zh: "錯誤 1：沒有寶石也去撿。錯誤 2：轉錯方向。",
    },
    maps: [[">*.*", "###*", "###G"]],
    blocks: ["move", "left", "right", "pick", "until", "if", "ifElse"],
    starter: {
      main: [{ until: true, do: [{ if: "pathAhead", do: ["move"], else: ["left"] }, "pick"] }],
    },
    solution: {
      main: [{ until: true, do: [
        { if: "pathAhead", do: ["move"], else: ["right"] },
        { if: "gemHere", do: ["pick"] },
      ] }],
    },
  },
];
