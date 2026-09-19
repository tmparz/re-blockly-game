# Bird 關卡角度圓形方位盤還原驗證報告

## 任務概述
依據需求，將重置的 Blockly Games Bird（飛鳥）關卡之角度（Heading）輸入方式還原為 Google 原生圓形方位盤（Circle Dial Picker），提供視覺化直觀旋轉與方位選擇功能；同時保留 X、Y 座標欄位專用的觸控大按鍵數字鍵盤輸入，避免行動裝置彈出原生軟體鍵盤干擾操作。

---

## 異動項目清單

| 檔案路徑 | 異動類型 | 說明 |
| :--- | :--- | :--- |
| `bird-game/bird/generated/compressed.js` | 修改 | 1. 還原 `Zj.prototype.Ie`（`FieldAngle.prototype.showEditor_`）原生圓形 SVG 方位盤掛載邏輯。<br>2. 於 `Wj.prototype.Ie`（`FieldTextInput.prototype.showEditor_`）加入 `this instanceof Zj` 判斷，僅對座標等非角度數字積木彈出 `window.BirdTouch.open` 鍵盤。 |
| `scripts/patch-bird.mjs` | 修改 | 更新修補字串與規則，移除對 `FieldAngle` 的強制鍵盤攔截，確保維護腳本具冪等性（Idempotency）。 |
| `bird.html` | 修改 | 更新頂部指引文字為「點角度積木可旋轉圓盤調整方向；點座標數字可使用螢幕鍵盤輸入」。 |
| `dist/` | 建置同步 | 執行 `node scripts/build-static.mjs`，同步更新靜態發布包中的對應檔案。 |

---

## 驗證結果

### 1. 程式碼與語法檢查
- `node --check bird-game/bird/generated/compressed.js`：通過（Exit Code 0）。
- `node --check scripts/patch-bird.mjs`：通過（Exit Code 0）。
- `node scripts/check-source-lines.mjs`：通過（78 個原始碼檔案均符合 300 行以內規範）。
- `node scripts/validate-levels.mjs`：通過（100 個示範關卡驗證通過）。
- `node scripts/build-static.mjs`：通過（dist 包含 6 個檔案與 4 個目錄）。

### 2. 核心邏輯與分流斷言檢查
- `Zj.prototype.Ie`（角度積木）：
  - 確認包含 `Zj.j.Ie.call(this, a, Ta||Na||Oa); this.Ek(); tc.appendChild(this.xn); ...`。
  - 確認已移除 `window.BirdTouch.open(..., true); return;`。
- `Wj.prototype.Ie`（基底輸入框）：
  - 確認當 `this instanceof Zj` 時，放行原生 quiet input 流程，不觸發觸控鍵盤彈窗。
  - 確認當 `this` 為座標數值欄位（非 `Zj`）時，正常呼叫 `window.BirdTouch.open` 彈出觸控數字鍵盤。
- `scripts/patch-bird.mjs` 重新執行：驗證腳本具冪等性，重新執行後依然精準維持預期分流結構。
