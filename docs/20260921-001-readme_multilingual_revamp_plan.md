# Blocky Easy - GitHub README 中日英三語重構與 100 自製關卡強化計畫書

## 文件資訊
- **文件編號**：20260921-001
- **日期**：2026-09-21
- **狀態**：規劃中 (Planning)
- **負責人**：AI 專案經理兼資深全端工程師

---

## 1. 任務背景與目標

使用者要求：
> 「github 上 readme 上要中日英文 然後要強調自製的100關」

目前 `README.md` 主要為繁體中文，內容結構較為鬆散，重點混合了本機除錯說明與部分功能描述，未能在第一時間抓住國際開源社群、教育工作者與開發者的目光。

本計畫的核心目標：
1. **中日英三語完整架構 (Multilingual SSOT)**：
   - 提供繁體中文（Traditional Chinese）、日本語（Japanese）、英文（English）三種完整語系的獨立展示區塊。
   - 頂部設置流暢的語言錨點導覽（Language Switcher），方便全球使用者快速跳轉。
2. **重中之重：強力凸顯「自製 100 關原創階梯式學習系統」**：
   - 詳細解析 9 大循序進階階段（從順序、For 迴圈、巢狀 For、進階雙層巡檢、While 條件、If/Else 決策、走迷宮感測到 10x10 大地圖綜合挑戰）。
   - 強調教學防呆機制：嚴格方塊數量限制（Block Limits）、內建示範解答（Demo Solution）、自動化單元測試驗證（100 關 AST 全部通過驗證）。
3. **突出 iPad / 教室平板觸控深度優化**：
   - 積木快捷列（Tap-to-Attach）、防誤觸控制列、大型數字/角度觸控面板、免彈出系統鍵盤。
4. **附加模組與部署生態**：
   - 觸控改版 Blockly Games（Turtle 圓盤角度選擇器、Music 音符鍵盤、Pond 離線編輯器）、Bird 飛鳥任務、老師使用手冊（teacher-guide.html）。
   - GitHub Pages 自動化 CI/CD 與 Cloudflare Pages 部署說明。

---

## 2. 全方位專案與工程評估 (Rule 5)

依據專案管理與工程標準評估如下：

### ① 商業與推廣價值 (High)
- **開源影響力**：多語言（中、日、英）覆蓋全球絕大多數 Scratch / Blockly 兒童程式教育市場（台灣、香港、日本、歐美）。
- **產品定位明確**：明確區隔「官方 Blockly Games 示範」與「Blocky Easy 自製 100 關學習系統」，展現扎實的原創教學設計與工程深度。

### ② 技術可行性 (Excellent)
- 純 Markdown 靜態文件更新，不影響底層程式碼邏輯與執行效能。
- 專案已具備完整之關卡資料結構（`src/data/`）與驗證腳本（`node scripts/validate-levels.mjs`），內容具 100% 事實依據。

### ③ 維護成本 (Low)
- 結構採模組化三語對照，日後若新增關卡或功能，各語言維護邊界清楚。

### ④ 資安風險 (Zero)
- 無敏感資訊暴露，純公開文檔。

---

## 3. 預計實施步驟

1. **更新專案記憶管理 (.agent/)**：
   - 更新 `CURRENT.md` 記錄任務 T003 啟動。
   - 更新 `TASKS.md` 加入任務 T003。
2. **撰寫正式 Implementation Plan**：
   - 存檔至 `<appDataDir>\brain\<conversation-id>/implementation_plan.md`。
3. **撰寫嶄新的高品質 `README.md`**：
   - 精確、專業、具說服力，包含中日英完整三語系與 100 關詳細解析。
4. **本機驗證**：
   - 檢查 Markdown 錨點、格式排版、關卡數據一致性。
5. **更新任務進度與產出 Walkthrough**。
