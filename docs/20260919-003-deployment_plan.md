# 🚀 Blocky Easy 專案佈署計畫書 (20260919-003)

## 📋 專案與變更背景
本專案為針對兒童設計的 Blockly 程式積木學習遊戲，近期完成以下重要修復與擴充：
1. **飛鳥關卡（Bird）方位盤修復**：還原 `FieldAngle (Zj)` 原生圓形 SVG 方位盤掛載與即時角度拖曳計算，並保留 Touch 座標輸入支援。
2. **課程與關卡驗證**：新增與優化 100 個關卡的邏輯驗證與關卡模擬測試（696 項斷言測試全數通過）。
3. **教學手冊與授權說明**：更新 `docs/20260918-老師使用手冊.md` 及 `NOTICE` / `LICENSE`。

---

## 📊 專案經理與全端工程評估 (PM & Tech Assessment)

| 評估維度 | 評估內容與結論 |
|---|---|
| **商業價值 (Business Value)** | 高。修正飛鳥關卡角度操作與擴充關卡測試後，可大幅提升學生在平板與電腦上的操作體驗與學習順暢度。 |
| **技術可行性 (Technical Feasibility)** | 極高。`npm run check` 與 `npm run build` 均已在本地測試無誤，靜態 Bundle 產出於 `dist/`。 |
| **開發與營運成本 (Cost)** | 低。靜態 Web 應用，利用 GitHub Pages / Cloudflare Pages 免費託管即可支援大量學生連線。 |
| **維護成本 (Maintainability)** | 低。具備完整的 `check-source-lines` 與 `validate-levels` 自動化校驗腳本。 |
| **資安風險 (Security Risk)** | 極低。無敏感 API Key、無後端資料庫存取，全前端離線/單機可執行架構。 |
| **擴充性 (Scalability)** | 高。已完成模組化關卡 `src/data/levels/` 與多國語言分區 `src/i18n/`。 |
| **測試難度 (Testing)** | 低。已編寫完整 Simulator 與邏輯校驗工具。 |
| **上線風險 (Deployment Risk)** | 低。目前代碼位於 `codex/refactor-app-js` 分支且有未提交變更，需完成 Git Commit 與分支合併後發布。 |

---

## 🛠 建議佈署流程方案

### 方案 A：GitHub Pages 自動部署（推薦）
1. 將當前未提交變更進行 Commit（搭配 Conventional Commit 規範）。
2. 將 `codex/refactor-app-js` 變更合併至 `main` 分支並 Push 至 GitHub。
3. GitHub Actions (`.github/workflows/deploy-pages.yml`) 將自動執行校驗、構建 `dist/` 並發布至 GitHub Pages。

### 方案 B：Cloudflare Pages 部署
1. 執行 `npm run build`（已於本地驗證通過）。
2. 使用 Cloudflare CLI 或 Direct Upload 部署 `dist` 目錄至 Cloudflare Pages 專案 `blocky-easy`。

---

## 🔍 驗證計畫 (Verification Plan)

### 自動化驗證 (Automated Verification)
- [x] `npm run check` (代碼行數檢查 + 關卡驗證 + 課程模擬 696 項測試) -> **PASS**
- [x] `npm run build` (靜態打包至 `dist/`) -> **PASS**

### 手動與視覺驗證 (Manual Verification)
- 上線後造訪正式網址，抽查 Bird 關卡角度方位盤視覺與拖曳互動。
- 檢查關卡進度與選單載入狀況。
