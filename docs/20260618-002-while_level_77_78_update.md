# WHILE 關卡序號與內容更新說明

## 日期：2026-06-18
## 文件編號：20260618-002

---

## 一、更新背景

在先前的 WHILE 關卡擴充中，新增了最高難度的 4 個關卡（原第 74 至 77 關）。然而，經審查與實際解答路徑追蹤後發現：
1. 原本的「雙死巷分支回程」（原第 77 關，十字路口）在解答走回中央時，由於 `While(FRONT_CLEAR)` 條件會穿過十字路口中心而無法停下，導致玩家無法依預期邏輯回程。
2. 為了將此「雙死巷回程與分支」的高難度概念保留，我們將其優化為 **T 字型地圖**，並調整為**第 78 關**。
3. 為了讓玩家有更好的難度過渡，我們在前面新增了一個更基礎的「雙向死巷探索」作為**第 77 關（左右翼探索）**。

這使得整體關卡總數增加至 **100 關**，總星數為 **300 星**。

---

## 二、關卡序號調整與設計詳情

### 第 77 關：While：左右翼探索 (while-wing-explore)
- **概念**: While + 雙向死巷（橫向）
- **地圖**: 5×5 簡化 T 字型
- **解決路徑**: 往上走到路口停住 -> 左轉 While 走到左端收集 -> 轉身 While 橫跨到右端傳送門收集。
- **目標**: 建立基礎的「走到路口、左走、右轉身走到底」的雙翼操作概念。

### 第 78 關：While：雙死巷分支回程 (while-dual-deadend-branch)
- **概念**: While + 回程 + 分支
- **地圖**: 7×5 精密 T 字型（含右上轉彎出口）
- **解決路徑**: 往上走到 T 字口 -> 右轉 While 走到右端收集 -> 轉身 While 回中央並繼續走到左端收集 -> 轉身 While 回中央 -> 左轉 While 往上走到傳送門收集。
- **目標**: 真正的雙翼來回探索與精準回程，為 While 難度最高點。

---

## 三、關卡序列完整檢視 (第 70 至 80 關)

| 關卡序號 | 關卡 ID | 標題 | 概念與關聯 |
|---|---|---|---|
| **第 70 關** | `while-deadend-return` | While：死巷取物再回程 | 基礎死巷來回 |
| **第 71 關** | `while-blocked-turn` | While：遇牆轉到有路 | 巢狀遇牆轉彎 |
| **第 72 關** | `while-rotation-lock` | While：旋轉鎖實驗室 | 複雜迷宮轉向 |
| **第 73 關** | `while-final-crossroad` | While：最終回程十字路 | 綜合十字路口回程 |
| **第 74 關** | `while-for-mixed-patrol` | While：走停收集混合迴圈 | While + For 混合（新增 W1） |
| **第 75 關** | `while-triple-nested-scan` | While：三層深井探測 | 三層巢狀 While（新增 W2） |
| **第 76 關** | `while-multi-condition-cross` | While：多條件交叉巡檢 | 多條件交叉運用（新增 W3） |
| **第 77 關** | `while-wing-explore` | While：左右翼探索 | 雙向翼橫越（新增 W4） |
| **第 78 關** | `while-dual-deadend-branch` | While：雙死巷分支回程 | 雙死巷分支回程（新增 W5） |
| **第 79 關** | `if-clear-step` | If：前方沒牆才走 | 進入 IF 階段入門 |
| **第 80 關** | `if-blocked-turn-only` | If：有牆才轉彎 | IF 條件轉向 |

---

## 四、中英文雙語支援

所有的標題、說明文字、概念及提示皆已同步更新至 `LEVEL_TRANSLATIONS`，確保翻譯正確無缺漏：
- `while-wing-explore`: "While: Left-Right Wing Exploration"
- `while-dual-deadend-branch`: "While: Dual Dead-End Branch Return"

---

## 五、驗證結果

- **語法正確性**: 經 Node.js 執行期解析無任何 Syntax Error。
- **UI 整合度**: 100 個關卡完全對齊，無序號跳躍或重疊。
- **解答正確性**: 第 77 關與第 78 關的內建示範解法皆在 `agent-browser` 中實際執行並順利獲取 3 顆星通關，地圖與寶石配置完全契合。
