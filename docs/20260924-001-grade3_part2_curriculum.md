# 第二階段課程：Code Builders（Grade 3，12 週）

## 背景
學生（美國國小三年級）已完成：自製 100 關（順序、For、巢狀迴圈、While、If/Else、迷宮演算法）、Bird、Turtle。
對照 CSTA K–12 1B（Grades 3–5）標準，尚未系統練習的是：除錯（AP-15）、拆解與函式（AP-11）、變數（AP-09）、事件（AP-10）、改編與專題開發流程（AP-12、AP-13、AP-16、AP-17）。

## 單元順序與理由
| 週 | 單元 | 實作位置 | 關卡數 |
|---|---|---|---|
| 1–2 | 🐞 Bug Hunt 除錯 | `quest.html?unit=bugs` | 10 |
| 3–5 | 🧩 Function Factory 函式 | `quest.html?unit=functions` ＋ Blockly Games Music | 10 |
| 6–7 | 🔢 Counting Robots 變數 | `quest.html?unit=counting` | 9 |
| 8–9 | 🎬 Story Lab 事件 | `story.html`（新增「當點擊角色」「重複」） | 挑戰卡 4 張 |
| 10–12 | 🚀 期末專題：我的互動故事 | `story.html` | 規劃單＋評量規準 |

1. **先除錯**：100 關之後最常見的卡關是「不知道哪裡錯」，除錯流程是後面所有單元的基礎。
2. **再函式**：程式變長後才感受到命名一段步驟的價值；Function 5 關刻意設計成間距不規則，迴圈做不到、函式才好用。
3. **接著變數**：計數器（set / change / say）；多數關卡同時用 2–3 張地圖測試，寫死答案會失敗，讓學生理解「為什麼需要變數」與「好程式每次都要對」。
4. **最後事件與創作**：把前面學的用在自己的互動故事。

## 技術設計（Quest Lab）
- `src/quest/program.js`：任務用精簡 DSL 撰寫；Blockly JSON 與 DSL 互轉；計算方塊數與使用量。
- `src/quest/engine.js`：純函式模擬器，輸出動畫 frames；判斷撞牆、無窮迴圈（1000 步）、遞迴過深、漏撿寶石、說錯數字等。
- `src/quest/missions/*.js`：三個單元的任務資料（中英雙語）。
- `scripts/test-quests.mjs`：驗證每關解答（經 Blockly JSON 往返）在所有地圖通過並得 3 星、起始程式必定失敗、雙語文字完整、解答只用到工具箱內的方塊。已加入 `npm run check` 與 GitHub Pages workflow。
- 所有欄位皆為下拉選單（含函式名稱），不會跳出 iPad 鍵盤；預設英文，可切換中文。
- 星星：通過 ⭐⭐；方塊數 ≤ 解答方塊數 ⭐⭐⭐；上限為解答 +3 個方塊。
