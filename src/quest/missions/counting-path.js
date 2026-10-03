// The Counting Robots learning path: one new idea about variables per mission, in this order.
// Each entry: [mission id, tier, lesson shown to students as "🎯 ..."].
export const COUNTING_PATH = [
  // 🟢 What is a variable?
  ["var-1", "easy", { en: "A variable is a box that remembers one number.", zh: "變數就像一個盒子，可以記住一個數字。" }],
  ["var-2", "easy", { en: "\"change\" adds to the number in the box.", zh: "「改變」會在盒子裡的數字上加。" }],
  ["var-3", "easy", { en: "\"set\" replaces the number; \"change\" adds to it.", zh: "「設為」是換掉數字，「改變」是加上去。" }],
  ["count-1", "easy", { en: "Say the answer once, after the counting is done.", zh: "數完之後，再說一次答案。" }],
  ["count-2", "easy", { en: "Inside a loop, add 1 every time it happens.", zh: "在迴圈裡，每發生一次就加 1。" }],
  ["count-3", "easy", { en: "Always set the starting number first.", zh: "一定要先設定起始數字。" }],
  // 🟡 Put the blocks in the right place
  ["var-4", "medium", { en: "Set the counter BEFORE the loop, not inside it.", zh: "計數器要在迴圈「之前」設定，不是在裡面。" }],
  ["var-5", "medium", { en: "Put \"change\" inside \"if\" to count only some things.", zh: "把「改變」放進「如果」裡，就只數某些東西。" }],
  ["count-4", "medium", { en: "One program, different answers on different maps.", zh: "同一個程式，在不同地圖說出不同答案。" }],
  ["count-5", "medium", { en: "You can count anything: steps, not just gems.", zh: "什麼都能數：步數也可以，不只寶石。" }],
  ["var-6", "medium", { en: "A variable can grow by more than 1.", zh: "變數一次可以加不只 1。" }],
  ["count-6", "medium", { en: "Start high and change by -1 to count down.", zh: "從大的數字開始，改變 -1 就是倒數。" }],
  ["var-7", "medium", { en: "The counter tells the loop when to stop.", zh: "計數器數到幾，迴圈就停在那裡。" }],
  ["count-7", "medium", { en: "Stop when you have enough, even if more are left.", zh: "數到夠了就停，就算後面還有。" }],
  // 🔴 Variables working with loops, ifs and functions
  ["var-8", "hard", { en: "Count down, and stop when you reach 0.", zh: "從大的數字倒數，數到 0 就停。" }],
  ["count-8", "hard", { en: "Count something that happens in \"else\".", zh: "數「否則」裡發生的事。" }],
  ["var-9", "hard", { en: "Choose exactly where \"change\" goes.", zh: "仔細決定「改變」要放在哪裡。" }],
  ["var-10", "hard", { en: "A function can count, too.", zh: "函式也可以幫忙數。" }],
  ["count-9", "hard", { en: "Count while finding your way through a maze.", zh: "一邊走迷宮，一邊數。" }],
  ["var-11", "hard", { en: "Use everything together.", zh: "全部學到的一起用。" }],
];
