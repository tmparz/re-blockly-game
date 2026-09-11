# Bird 觸控版驗證（2026-09-11）

入口：`/bird.html`，英文：`/bird.html?lang=en`。
官方十關獨立靜態副本放在 `bird-game/`；原有工作樹變更保留。

## 已驗證

- 瀏覽器點工作區角度，逐位點 4、5、Apply，積木顯示 45°。
- 執行第一關後顯示 Congratulations，過關程式為 `heading(45);`。
- 繁中座標數字鍵盤可開啟，逐位輸入 75 後數字積木顯示 75。
- 第六關選 75 後取消，原本 50 保持不變。
- 頁面能載入原始關卡、繁中／英文語系、圖片與遊戲執行器。
- 工作區初始縮放 0.8；保留原 Blockly 拖曳操作。
- `node --check bird-game/touch-input.js`：exit 0。
- `node --check bird-game/bird/generated/compressed.js`：exit 0。
- `node scripts/check-source-lines.mjs`：exit 0。
- `node scripts/validate-levels.mjs`：exit 0，原有 100 關示範通過。
- `node scripts/build-static.mjs`：exit 0，Bird 頁面及資源包含於 dist。

## 範圍與限制

這是桌面內嵌瀏覽器的操作驗證，未持有對方 iPad，未宣稱已完成 Safari
真機驗收，也未逐一解完 Bird 全十關。尚未部署至正式網站。
正式驗收請在對方 iPad 測試：角度、座標、確定／取消、積木拖曳、
橫直向切換、第一關過關及下一關。

本機 npm 包裝器缺少 npm-cli.js，因此直接執行相同 Node 腳本完成檢查與建置。
