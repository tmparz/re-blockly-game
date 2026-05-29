# Blocky Easy 本地執行與專案分析指南

本文件旨在詳細分析 Blocky Easy 專案的架構，並提供如何在本地環境順利啟動與執行的完整步驟。

---

## 1. 專案概覽

**Blocky Easy** 是一個專為兒童設計的程式邏輯練習遊戲站台。
- **技術核心**：基於 Google Blockly 視覺化積木程式庫。
- **關卡設計**：包含 50 個關卡，涵蓋以下五大階段：
  1. 基礎移動與轉彎
  2. For 重複
  3. 巢狀 For 入門
  4. 進階 For 工廠
  5. If 條件判斷
- **主要特色**：
  - 「接方塊」快捷列，方便快速組合關卡所需的基本方塊。
  - 平板最佳化（iPad 直向與橫向自動適應佈局，支援觸控）。
  - 音效回饋（成功與失敗音效）。
  - 教學支援（提供「示範」按鈕，快速填入參考解法）。
  - 雙語支援（繁體中文/英文，首選語言會儲存在瀏覽器的 `localStorage` 中）。

---

## 2. 專案架構分析

本專案是一個**零外部 Node 依賴**的純前端網頁應用程式。

### 檔案結構
```text
├── .agents/          # AI 代理工作流與技能配置
├── dist/             # 靜態打包輸出目錄（由 build-static.mjs 產生）
├── docs/             # 專案正式文件與指南目錄
├── index.html        # 主網頁結構，包含 Blockly 載入區與遊戲畫面
├── styles.css        # 遊戲介面樣式（包含平板響應式設計）
├── app.js            # 核心邏輯（關卡資料、地圖繪製、Blockly 自訂積木、執行器）
├── server.mjs        # 超輕量 Node.js 原生 HTTP 本地伺服器（零套件依賴）
├── wrangler.toml     # Cloudflare Pages 部署設定檔
├── package.json      # npm 執行腳本配置
└── scripts/
    └── build-static.mjs  # 靜態檔案打包腳本（純 Node.js 原生 API）
```

### 技術特點
1. **零套件依賴 (No `node_modules` required)**：
   - 專案的 `server.mjs` 和 `build-static.mjs` 全數使用 Node.js 原生模組（如 `node:http`, `node:fs`）。
   - 不需要執行 `npm install` 即可直接啟動本地伺服器或打包。
2. **Blockly 動態加載**：
   - Blockly 的核心庫目前透過 CDN (`https://unpkg.com/`) 動態下載。因此**執行此專案時需要連接網路**。
3. **Cloudflare Pages 親和性**：
   - 專案內置了打包與部署到 Cloudflare Pages 的腳本，能快速將 `dist` 目錄部署到雲端。

---

## 3. 本地執行步驟

要在本地運行 Blocky Easy，您有兩種方式。**強烈推薦「方式一：本地 Node.js 伺服器」**，以避免瀏覽器 `file://` 協定下的安全性限制（例如 LocalStorage 或某些 API 無法正常運作）。

### 必備環境
- 本地需要安裝 **Node.js** (建議 v18 以上版本)。

---

### 方式一：使用本地 Node.js 伺服器 (推薦 ✨)

由於本專案無任何第三方依賴，您不需要下載任何 `node_modules`！

1. **開啟終端機 (PowerShell 或 Command Prompt)**。
2. **切換到專案根目錄**。
3. **執行啟動命令**：
   您可以直接運行 Node.js：
   ```powershell
   node server.mjs
   ```
   或者使用 `npm` 腳本：
   ```powershell
   npm run dev
   ```
4. **瀏覽網頁**：
   伺服器啟動後，控制台會顯示：
   ```text
   Blocky Easy running at http://127.0.0.1:4173
   ```
   請在瀏覽器中打開 `http://127.0.0.1:4173` 即可開始遊玩！

---

### 方式二：直接雙擊打開 HTML 檔案 (離線或臨時查看)

1. 在檔案總管中，直接雙擊 `index.html`。
2. 瀏覽器會以 `file:///` 協定開啟此專案。
3. *注意：此方式在某些嚴格安全設定的瀏覽器中，可能會限制 LocalStorage 儲存語言偏好或關卡進度，且仍需保持網路連線以加載 Blockly CDN。*

---

## 4. 靜態打包與 Cloudflare Pages 部署

如果您希望將專案打包成單一 `dist` 資料夾，或部署至 Cloudflare：

### 本地打包靜態資源
這會將 `index.html`、`styles.css`、`app.js` 及對應的 Cloudflare Headers 複製到 `dist/` 目錄中：
```powershell
npm run build
```
*(或直接執行 `node scripts/build-static.mjs`)*

### 部署至 Cloudflare Pages
若您安裝了 Wrangler CLI，可以直接部署到 Cloudflare Pages：
1. 確保已登入 Cloudflare：
   ```powershell
   npx wrangler login
   ```
2. 執行部署命令：
   ```powershell
   npm run deploy:cloudflare
   ```
   這會自動執行打包，並將 `dist` 目錄上傳至名為 `blocky-easy` 的 Cloudflare 專案。

---

## 5. 開發與改進建議

如果您打算對本專案進行修改或深度開發：
1. **完全離線化 (Offline Mode)**：
   目前 Blockly 依然從 unpkg.com 加載。若要在無網環境的教室使用，建議下載 `blocky.min.js` 及相關語言套件（如 `zh-hant.js`），並將其放置於專案本地（如 `/lib` 目錄），並修改 `index.html` 中的引用路徑。
2. **本地保存進度**：
   可以擴充 `app.js` 的關卡儲存邏輯，透過 `localStorage` 記錄小朋友已通過的關卡，避免重整瀏覽器後進度消失。
3. **自訂關卡**：
   關卡定義位於 `app.js` 的最前方或關卡資料結構中，您可以隨時編輯該結構來新增全新的關卡或調整地圖配置。
