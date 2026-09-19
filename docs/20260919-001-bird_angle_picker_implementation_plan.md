# Bird 關卡角度圓形方位盤還原實作計畫書

## 需求背景與目標
在目前的 Blockly Games Bird（鳥）關卡中，前次更新為了無實體鍵盤的觸控環境，將「角度積木」與「座標積木」皆強制攔截為大按鈕數字鍵盤彈窗。
使用者希望：
1. **角度（Heading）部分**：維持原生 Google Blockly Games Bird 的體驗，使用者可在**圓形方位盤（Circle Dial Picker）**上直接點擊或拖曳選擇角度／方位，而不是用文字填寫或數字鍵盤逐位輸入。
2. **座標（X, Y）部分**：繼續維持專用的數字輸入方式（避免行動裝置彈出原生軟體鍵盤，維持觸控友善體驗）。

---

## 專案評估與審查分析（依專案管理規範）

| 評估面向 | 分析內容與結論 |
| :--- | :--- |
| **商業／教學價值** | **極高**。在幾何與方位教學中，圓形方位盤能提供直觀的空間旋轉與角度概念（0° 向東、90° 向北、180° 向西、270° 向南），相較於純文字鍵盤輸入數字，大幅降低初學者對角度抽象數值的理解門檻。 |
| **技術可行性** | **完全可行**。原生 Google Blockly 的 `FieldAngle`（`Zj`）與 `DropDownDiv` 圓形 SVG 標記、指針與事件監聽器（支援滑鼠與 touch/pointer）仍完整存在於 `compressed.js` 中，僅因前次修補腳本在 `showEditor_` 最前端插入 `window.BirdTouch.open(..., true); return;` 而被阻斷。 |
| **開發成本** | **極低**。僅需修改 `compressed.js` 的原型條件攔截、更新 `scripts/patch-bird.mjs`，並同步靜態發布包 `dist/`。 |
| **維護成本** | **低**。將邏輯收斂為「僅針對非角度之數字欄位（座標等）啟用 Touch Keypad，角度欄位回歸原生 SVG 圓形方位盤」，程式碼更為精簡且架構職責分明。 |
| **資安風險** | **無**。全為前端 SVG 渲染與本地事件計算，無外部依賴與網路通訊風險。 |
| **擴充性** | **良好**。未來若其他遊戲模組（如 Pond 鴨子導引）需同步調整圓形角度選擇器，可沿用相同的 `instanceof` 分流模式。 |
| **測試難度** | **中低**。需針對桌面滑鼠點選／拖曳角度盤、觸控模擬、座標欄位點擊（確認仍開啟數字鍵盤）、以及關卡執行（第一關至第十關角度計算）進行全面迴歸驗證。 |
| **上線風險** | **極低**。保留了完整的座標觸控支援，僅放行角度原生圓盤，不影響關卡判斷核心邏輯與存檔。 |

---

## 關鍵技術細節分析

### 1. 攔截點與繼承鏈問題
在 Google Blockly 的閉包編譯結果中：
- `Wj` 為 `FieldTextInput`（文字輸入框基底），也是 `ek`（`FieldNumber`，座標數值輸入）的父類別。
- `Zj` 為 `FieldAngle`（角度欄位），繼承自 `Wj`。
- 目前 `Wj.prototype.Ie`（即 `showEditor_`）開頭為：
  ```javascript
  g.Ie = function(a, b) {
    window.BirdTouch.open(uh(this), function(v){ Id(this, v); }.bind(this));
    return;
    // 原生輸入框建立與事件綁定...
  }
  ```
- `Zj.prototype.Ie`（`FieldAngle.prototype.showEditor_`）原本會呼叫 `Zj.j.Ie.call(this, a, Ta||Na||Oa)`，若 `Wj.prototype.Ie` 未判斷 `this` 是否為 `Zj`，即使還原了 `Zj.prototype.Ie`，當角度欄位呼叫父類別時，依然會被 `Wj` 頂層強制開啟鍵盤彈窗。

### 2. 解決方案
1. **分流判定**：在 `Wj.prototype.Ie` 中加入判斷：
   ```javascript
   if (this instanceof Zj) {
     // 執行原生靜音輸入初始化（供 DropDownDiv 內部關聯與同步使用）
     this.h = this.m.l;
     a = b || !1;
     !a && (Ta || Na || Oa) ? Yj(this) : (kh(this, this.m.o, this.Jr.bind(this)), this.Kb = this.wm(), this.Cf = !0, a || (this.Kb.focus({ preventScroll: !0 }), this.Kb.select()));
     return;
   }
   // 座標數字積木（非角度）才開啟觸控鍵盤
   window.BirdTouch.open(uh(this), function(v){ Id(this, v); }.bind(this));
   return;
   ```
2. **還原 `Zj.prototype.Ie`**：移除 `window.BirdTouch.open(..., true); return;`，讓角度積木完整執行：
   ```javascript
   Zj.j.Ie.call(this, a, Ta || Na || Oa);
   this.Ek();
   tc.appendChild(this.xn);
   a = this.m.style.Ac;
   sc.style.backgroundColor = this.m.style.Yc;
   sc.style.borderColor = a;
   Dc(this, this.Fk.bind(this));
   ak(this);
   ```
3. **修訂自動修補腳本**：同步更新 `scripts/patch-bird.mjs`，確保後續執行建置或維護腳本時不會倒退回全鍵盤模式。

---

## 變更計畫

### 1. 核心程式碼修正
- [MODIFY] `bird-game/bird/generated/compressed.js`
  - 還原 `FieldAngle.prototype.showEditor_` 原生圓形方位盤掛載邏輯。
  - 在 `FieldTextInput.prototype.showEditor_` 加入 `instanceof Zj` 防禦性分流，僅對座標等純數字積木彈出 `BirdTouch.open`。
- [MODIFY] `scripts/patch-bird.mjs`
  - 更新修補替換邏輯，使其符合上述分流架構。

### 2. 說明文案與指引同步
- [MODIFY] `bird.html`
  - 更新頂部提示說明，明確指出「點擊角度積木可旋轉圓盤調整方向；點擊座標數字可使用螢幕鍵盤輸入」。

### 3. 建置與打包
- [MODIFY] `dist/`
  - 執行 `node scripts/build-static.mjs` 同步產出正式靜態檔。

---

## 驗證計畫

### 1. 語法與建置檢查
- 執行 `node --check bird-game/bird/generated/compressed.js`。
- 執行 `node --check scripts/patch-bird.mjs`。
- 執行 `node scripts/build-static.mjs`。

### 2. 瀏覽器互動驗證
- **關卡 1（單純角度）**：
  - 點擊 `heading 90` 的角度積木。
  - 驗證畫面彈出的是**圓形方位盤（帶有刻度、紅線與指針）**，而非數字鍵盤。
  - 點選或拖曳至 45°，驗證積木數值即時變更為 45°。
  - 執行程式，確認小鳥成功吃蟲並飛回鳥巢過關。
- **關卡 4 或關卡 5（座標條件關卡）**：
  - 檢查帶有 `x < 50` 或 `y < 50` 的數字積木。
  - 點擊數字 `50`，驗證彈出的依然是**觸控數字鍵盤**。
  - 輸入新數值（例如 75）並點擊「確定」，確認積木數字正確更新為 75。
  - 點擊同關卡中的 `heading` 角度積木，確認依然正常彈出圓形方位盤。
