# 烏龜關卡轉彎角度圓盤選擇器驗證報告

## 任務摘要
將 Blockly Games「烏龜（Turtle）」關卡的向左轉／向右轉角度選擇器，改造成與「鳥（Bird）」關卡相同的**圓盤方位盤（Circle Dial Angle Picker）**。針對烏龜關卡特有的非 15° 核心解題角度（72°、144°、1°），整合了專屬常用角度快捷點選列與智慧吸附機制，並徹底消除了原型鏈屬性衝突與數字鍵盤強制攔截問題。

---

## 實作內容回顧

1. **核心類別注入與註冊**：
   - 於 `blockly-games/turtle/generated/compressed.js` 中注入 `TurtleAngleField` 類別，繼承自 `FieldTextInput`（`Sn`）。
   - 採用無衝突命名空間屬性（`clockwise`, `angleOffset`, `angleWrap`, `angleRound`, `angleGauge`, `angleLine`, `angleCircle`, `angleWrapper` 等），防禦性避免覆蓋 Blockly 原生序列化函式（如 `toXml` 的 `Lr`）與原型方法。
   - 注入專屬 SVG 樣式（`.blocklyAngleCircle`, `.blocklyAngleMarks`, `.blocklyAngleGauge`, `.blocklyAngleLine`）。
   - 註冊 `field_angle` 至欄位註冊表 `Pb`。

2. **烏龜關卡特殊角度專屬設計**：
   - 在彈出面板（`DropDownDiv`）中，除了提供可點擊旋轉與拖曳的 100x100 SVG 圓盤外，下方整合 6 個核心角度快捷按鈕：
     `[ 1° ] [ 45° ] [ 72° ] [ 90° ] [ 120° ] [ 144° ]`
   - 點擊快捷按鈕時，數值即時更新、紅色指針與粉色扇形區域動態旋轉至目標角度。
   - 點擊或拖曳圓盤時，支援自由旋轉與特殊角度（72°、144°、1°）的智慧吸附。

3. **積木與工具箱定義更新**：
   - 將 `turtle_turn_internal` 的第二個欄位從固定 6 項的下拉選單（`field_dropdown`）升級為 `{type: "field_angle", name: "VALUE", angle: 90}`。
   - 在第 10 關（自由畫廊）工具箱中亦提供支援圓盤角度調整的轉向積木。
   - 在 `Sn.prototype.Qd`（`showEditor_`）加入 `instanceof TurtleAngleField` 豁免分流，防止被觸控大數字鍵盤攔截。

4. **建置管線與自動化修補**：
   - 建立獨立修補腳本 `scripts/patch-turtle.mjs`。
   - 更新 `scripts/patch-blockly-games.mjs` 串接執行，確保專案重新建置或修補時不會回退。
   - 更新 `blockly-games.html` 遊戲簡介文案。
   - 執行 `npm run build` 同步至正式發布目錄 `dist/`。

---

## 驗證結果

### 1. 自動化測試與靜態檢查
- `npm run validate:source`：79 個原始碼檔案均符合 <= 300 行之規範。
- `npm run check`：
  - 100 關主關卡設定完整通過。
  - 696 項課程回歸斷言全部通過。
  - 語法檢查 `node --check` 100% 通過。

### 2. 真實瀏覽器端互動測試（Headless Chrome / browser_subagent）

| 測試項目 | 驗證操作 | 預期結果 | 實際結果 | 狀態 |
| :--- | :--- | :--- | :--- | :--- |
| **頁面載入與提示關閉** | 進入 `turtle.html?lang=zh-hant&level=1`，點擊「確定」 | 提示關閉，工作區與工具箱正常呈現 | 正常呈現 | **PASS** |
| **工具箱展開** | 點擊工具箱「烏龜」分類 | Flyout 展開積木列表，無 `TypeError` | 成功展開，無錯誤日誌 | **PASS** |
| **圓盤彈窗開啟** | 點擊「向右轉」積木上的 `90°` 數值 | 彈出圓形方位盤（含指針、扇形、刻度）與 6 個快捷按鈕 | 完美彈出，與鳥關卡風格一致 | **PASS** |
| **快捷按鈕 `72°`** | 點擊彈窗中的 `72°` 按鈕 | 積木數值變更為 72°，指針動態旋轉至 72° | 數值更新為 72，指針指向 72° | **PASS** |
| **快捷按鈕 `144°`** | 點擊彈窗中的 `144°` 按鈕 | 積木數值變更為 144°，指針動態旋轉至 144° | 數值更新為 144，指針指向 144° | **PASS** |
| **圓盤直接點擊** | 滑鼠點選圓盤 180° 與 45° 位置 | 指針與扇形隨點選位置旋轉，積木數值同步更新 | 指針與數值完美連動 | **PASS** |
| **控制台錯誤日誌** | 檢查 Console Logs | 零報錯、無未捕獲異常 | 乾淨無任何錯誤 | **PASS** |

---

## 結論
烏龜關卡的轉向角度選擇器已成功改造成與鳥關卡一致的圓盤方位盤體驗，並成功兼顧了正五邊形（72°）與五角星（144°）等特殊角度的操作便利性，功能已達到生產交付標準。
