# Blockly Games 觸控版驗證（2026-09-11）

入口：`/blockly-games.html`。頁面列出 Bird、Turtle、Movie、Music、Pond
Tutor 與 Pond 六個遊戲；五個新增遊戲位於 `blockly-games/`。

## 已驗證

- 入口頁可載入六張遊戲卡片與正確連結。
- Turtle、Movie、Music、Pond Tutor、Pond 的第一關可載入，英文介面可顯示。
- Pond Tutor 的繁體中文第二關可載入，ACE 編輯器顯示 `cannon ( 0 , 70 ) ;`。
- Movie：拖入圓形方塊，點數字欄位開啟觸控數字鍵盤，輸入 `7` 並套用後，
  工作區欄位變成 `7`。
- Music：拖入音符方塊，點 `C4` 開啟音符選擇器，選 `D4` 並套用後，
  工作區欄位變成 `D4`。
- Pond：角度欄位可開啟 `Heading (degrees)` 鍵盤；數字欄位可開啟
  `Number` 鍵盤。
- Turtle 第一關的固定步數選單可正常顯示與操作；需要自由輸入的欄位由同一個
  觸控數字鍵盤補強。
- 所有頁面的相對 HTML、CSS、ACE、Blockly、音效、圖片與 Music soundfont
  資產均存在；靜態建置輸出包含 `dist/blockly-games/`。

## 指令檢查

- `node scripts/patch-blockly-games.mjs`：exit 0，五個遊戲補丁可重複套用。
- `node scripts/check-source-lines.mjs`：exit 0，72 個 authored source files
  通過 300 行限制。
- `node scripts/validate-levels.mjs`：exit 0，100 個既有關卡的雙語、示範解答
  與方塊限制通過。
- `node scripts/build-static.mjs`：exit 0，建立 5 個檔案與 4 個目錄。
- 所有遊戲 `generated/compressed.js` 與觸控腳本通過 `node --check`。

## 範圍與限制

這次是本機桌面瀏覽器的畫面與操作驗證，尚未使用對方的實體 iPad / Safari，
也尚未部署到 GitHub。正式上線前仍需在 iPad 驗證橫直向、觸控拖曳、鍵盤套用／
取消、第一關執行與下一關流程。
