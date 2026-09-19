# 🚀 Blocky Easy 專案 GitHub Pages 佈署計畫書 (20260920-001)

## 📋 變更背景與目標
本次佈署主要交付「烏龜（Turtle）」關卡的角度選擇機制升級：
1. **烏龜關卡圓盤方位盤改造**：
   - 轉彎積木（向左轉／向右轉）由原先固定 6 項的下拉選單（`field_dropdown`），升級為與「鳥（Bird）」關卡相同的視覺化 SVG 圓盤方位盤（`FieldAngle`）。
   - 解決烏龜關卡特殊角度需求（正五邊形 72°、五角星 144°、滿月 1°），在圓盤下方整合 `[ 1° ] [ 45° ] [ 72° ] [ 90° ] [ 120° ] [ 144° ]` 常用角度快捷按鈕與智慧吸附機制。
   - 解決 Closure 混淆變數撞名問題與 Touch keypad 大數字鍵盤攔截衝突。
2. **自動化修補管線健全化**：
   - 建立 [scripts/patch-turtle.mjs](file:///d:/case/arzbar/20260512_blocky_easy/scripts/patch-turtle.mjs)，並串接至 [scripts/patch-blockly-games.mjs](file:///d:/case/arzbar/20260512_blocky_easy/scripts/patch-blockly-games.mjs)，確保 CI/CD 環境重建時完全冪等。
3. **靜態構建與文案更新**：
   - 更新 [blockly-games.html](file:///d:/case/arzbar/20260512_blocky_easy/blockly-games.html) 說明，並完成 `npm run build` 同步生成 `dist/`。

---

## 📊 專案經理與全端工程評估 (PM & Tech Assessment)

| 評估維度 | 評估內容與結論 |
|---|---|
| **商業／教學價值** | **極高**。烏龜關卡是幾何與迴圈概念教學核心，將轉向改為視覺化圓盤後，大幅提升小學生對旋轉外角、對稱角度的直觀理解。 |
| **技術可行性** | **極高**。本地已通過 `npm run check`（79 個檔案行數檢查 + 100 關驗證 + 696 項斷言測試）與真實瀏覽器端互動測試（零報錯）。 |
| **開發與營運成本** | **極低**。採用 GitHub Pages 自動構建與託管，零伺服器維護成本。 |
| **維護成本** | **低**。修補腳本具備防禦性命名與冪等性，重新跑 build 絕不破壞代碼。 |
| **資安風險** | **無**。無後端連線、無機密密鑰洩漏風險，為純靜態前端應用。 |
| **擴充性** | **極佳**。`field_angle` 已於烏龜模組成功註冊，未來擴充自訂幾何關卡可直接沿用。 |
| **測試難度** | **低**。本地已透過自動化腳本與 Headless Chrome 驗證所有互動與像素邏輯。 |
| **上線風險** | **極低**。GitHub Actions 具備自動檢驗步驟，驗證通過才會發布。 |

---

## 🛠 佈署步驟與流程

1. **檔案審核與暫存**：
   - 程式碼：`blockly-games.html`、`blockly-games/turtle/generated/compressed.js`、`scripts/patch-blockly-games.mjs`、`scripts/patch-turtle.mjs`
   - 文件：`docs/20260919-004-turtle_angle_picker_implementation_plan.md`、`docs/20260919-005-turtle_angle_picker_verification.md`、`docs/20260920-001-deployment_github_pages.md`
   - 專案記憶：`.agent/CURRENT.md`、`.agent/TASKS.md`
2. **Git Commit**：
   - 遵守 Conventional Commit 規範建立乾淨有意義的提交。
3. **Git Push**：
   - 推送至 `origin/main`（GitHub 儲存庫 `tmparz/re-blockly-game`）。
4. **GitHub Actions 觸發**：
   - 自動觸發 `.github/workflows/deploy-pages.yml`，自動執行 `npm run check`、`npm run build` 並發布至 GitHub Pages。
