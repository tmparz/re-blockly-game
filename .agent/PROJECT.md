# Blocky Easy

## 專案目標
提供針對兒童與初學者設計的離線/單機網頁版 Blockly 程式積木學習與關卡遊戲平台。

## 專案類型
web-frontend

## 適用 Skills
- project-memory
- git-pr-description
- git-smart-commit
- review-clean-code

## 技術棧
- **語言**：HTML, CSS, JavaScript (ES Modules)
- **框架 / 工具**：Blockly, Node.js (開發與驗證腳本)
- **託管與部署**：GitHub Pages (.github/workflows/deploy-pages.yml), Cloudflare Pages (wrangler.toml)
- **環境**：Browser Standard, Node.js 24

## 目錄說明
- `.agent/` - AI 工作核心
- `docs/plans/` - 計畫書存檔
- `SQL/` - SQL 異動腳本
- `tasks/` - 任務規範
- [其他專案特定目錄]

---

## AI 工作規則

### 1. 任務管理
- 新任務必須詢問是否加入 TASKS.md
- 開始工作前必須讀取 CURRENT.md
- 計畫書完成後存檔到 docs/plans/
- 任務完成後更新 PROGRESS.md 與 TASKS.md

### 2. SQL 異動管理
- **所有 SQL 異動必須存檔到 `SQL/` 目錄**
- 檔名格式：`YYYYMMDD_目標摘要.sql`
- 包含建表、改表、資料異動等所有 SQL

### 3. Skill 使用規則
[根據專案類型填寫]
- 後端開發 → 遵循 backend-crud
- 前端開發 → 遵循 frontend-mvc
- 資料庫操作 → 使用 mysql-database（僅 Docker 環境）

### 4. 專案特定規則
[填寫專案特定的開發規範、命名慣例等]

---

## 重要注意事項
[填寫專案特定的重要提醒]

---

## 建立日期
2026-09-19
