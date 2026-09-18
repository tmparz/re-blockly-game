# Blocky Easy

## 老師使用說明

給帶課老師的簡明操作版已整理在 `teacher-guide.html`，部署後可直接從首頁點
「老師使用說明」。Markdown 版本在 `docs/20260918-老師使用手冊.md`。
內容包含上課流程、iPad 操作、常見問題，以及 Blockly Games／第三方元件的
來源與授權說明。

## Bird 飛鳥任務（iPad 觸控版）

開啟 `/bird.html`（繁體中文）或 `/bird.html?lang=en`（英文），首頁也有入口。
這是官方 Blockly Games Bird 十關的本機獨立版本，角度和座標欄位改用
大型觸控數字鍵盤，無須呼叫 iPad 系統鍵盤。點數字後可逐位輸入、選常用值、
清除、退格、取消或確定；數值仍由原 Blockly 驗證器處理。

關卡、語系、圖片、音效與執行程式均存放在 `bird-game/`，建置會一起複製到
`dist`。授權和改動見 `bird-game/NOTICE.md`、`bird-game/LICENSE`。
此版本沒有原站的雲端分享服務。更新官方程式後必須重新審查
`scripts/patch-bird.mjs` 的補丁。

本機預覽：`node server.mjs`，開啟 `http://127.0.0.1:4173/bird.html`。
這個 localhost 網址只供本機使用；對方 iPad 需使用部署後的網站網址。
桌面瀏覽器驗證不能取代對方 iPad / Safari 真機驗收。

## Blockly Games 觸控版

開啟 `/blockly-games.html` 可進入六個遊戲：Bird、Turtle、Movie、Music、
Pond Tutor 與 Pond。Bird 使用既有的本機版本；其餘五個遊戲放在
`blockly-games/`，並保留原本十個關卡、英文與繁體中文介面及遊戲規則。

需要輸入的欄位已改成適合 iPad 的觸控介面：數字和角度使用大型數字鍵盤，
Music 的音高使用 C3 到 A4 的音符按鈕。Pond Tutor 和 Pond 原本的 JavaScript
編輯器仍可直接使用，並已改成載入專案內的 ACE 資產，避免依賴外部編輯器檔案。

本機預覽：`node server.mjs`，開啟
`http://127.0.0.1:4173/blockly-games.html`。靜態建置會把五個遊戲及所有
必要資產複製到 `dist/blockly-games/`；可用以下命令檢查：

```powershell
node .\scripts\patch-blockly-games.mjs
node .\scripts\build-static.mjs
```

來源、授權與本機修改見 `blockly-games/NOTICE.md`。這些遊戲目前只提供本機
儲存與執行，不含原站的雲端分享或 Gallery 服務。GitHub Pages 使用
`.github/workflows/deploy-pages.yml` 自動執行驗證、建立 `dist/`，再發布到
GitHub Pages。

Blocky Easy 是一個給小朋友練習程式邏輯的 Blockly 遊戲站台。目前包含 100 個關卡，分成八個階段：基礎移動與轉彎、For 重複、巢狀 For 入門、進階 For 工廠、While 迴圈、If 條件判斷、迷宮規則、大型綜合挑戰。

上方有關卡下拉選單，可以依階段快速切換關卡。任務目標、方塊限制與提示會跟著目前關卡更新。

工作區上方有「接方塊」快捷列，點一下就會把目前關卡可用的方塊接到 Blockly 的開始方塊下面。點「重複」或「如果」後，快捷列會切到該容器裡，接下來的方塊會放進去；可用「上一層」或「主程式」切回外層。也可以點 Blockly 左側分類，從原本的方塊抽屜拖出來。重複次數與 If 條件直接在 Blockly 方塊上調整。

平板版已移除額外的程式列區塊，把空間留給 Blockly 工作區。iPad 直向會先顯示關卡資訊與 Blockly，遊戲地圖接在下方；橫向則是地圖與 Blockly 並排。

執行成功會播放成功音效，失敗或撞牆會播放失敗音效；支援平板瀏覽器的觸控操作。

控制列中的「回到起點」只會把小隊員、方向與寶石狀態恢復到目前關卡初始狀態，不會移除或重排 Blockly 積木；「重來」則會清空目前程式。

每關都有方塊數限制。重複練習關卡會限制到必須使用 For 方塊，避免只堆很多「前進一步」通過。

巢狀 For 入門新增 8 個中段關卡，放在 For 重複與進階 For 工廠之間。這一段先讓玩家習慣兩個 For 串接、三個 For 串接，再逐步練習「For 裡面放 For」與「巢狀 For 後面再接一個 For」，避免直接跳到大型進階路線。

進階 For 工廠新增 10 個關卡，主題是能量站巡線、採礦、巡檢與矩陣掃描。這一階段會大量使用二層以上的 For：例如「重複一組路線」、「每條線重複相同掃描流程」、「外圈與內圈跑道」等，後段關卡會比原本 For 階段更需要先觀察規律再組合迴圈。

While 階段擴充為 37 關，聚焦在「不知道要走幾步，直到條件不成立為止」。前中段不提供 If、If/Else，也不依賴固定次數；先用更多小關卡練習「還沒到傳送門」「前方沒牆」「前方有牆」與「站在寶石上」，再進到多段走廊、條件收集、巢狀 While、大型蛇形清掃、回程路線、旋轉鎖與外層 While 路由。最後幾關才加入一個 While + Repeat 混合題，作為進入後續綜合題前的高難度挑戰。

If 階段改成更平緩的 14 關 progression：最前面先用多個小關卡練習「前方沒牆才走」、「前方有牆才轉彎」、「站在寶石上才收集」，再把 For 放進 If，接著用 For 反覆執行 If 規則，最後引入 If/Else，讓玩家用「遇牆轉彎，否則前進」的規則自動通過路線並收集寶石。

迷宮規則階段新增 4 關，參考 Blockly Games Maze 後段的教學思路：加入「左邊沒牆」「右邊沒牆」「還沒到傳送門」等感測條件，讓玩家從單一 If/Else 進一步練習右轉規則、左右路口、前方不通時選路，最後完成左手貼牆法。

大型綜合挑戰新增 4 關，地圖從 7x7 放大到 10x10，要求玩家把 Repeat、While、If、If/Else、左右感測與收集規則組合起來。這一段不是學新積木，而是練習把前面學過的規則整理成能處理大地圖的流程。

每一關都有「示範」按鈕，可以讓老師快速放入參考方塊，再按「執行」展示路線。

關卡資料可以用以下命令驗證示範解答、方塊限制與可用方塊清單：

```powershell
node .\scripts\validate-levels.mjs
```

站台支援中文與英文切換，語言選擇會記在瀏覽器裡。關卡名稱、目標、提示、按鈕、快速方塊列與 Blockly 自訂積木都會跟著切換。

## 使用方式

專案使用 ES Modules，開發時請從本機伺服器啟動：

```powershell
node .\server.mjs
```

然後打開 `http://127.0.0.1:4173`。

也可以使用 `npm run dev`。開發時需要本機伺服器不影響部署；`npm run build` 仍會產生可直接部署到 Cloudflare Pages 的 `dist`。

## Cloudflare Pages 部署

這個專案是純靜態站台，可以部署到 Cloudflare Pages。

```powershell
node .\scripts\build-static.mjs
wrangler pages deploy dist --project-name blocky-easy
```

如果環境的 npm 正常，也可以直接使用：

```powershell
npm run deploy:cloudflare
```

第一次部署前需要先執行 `wrangler login`。如果使用 Cloudflare Pages 後台連 Git 倉庫，Build command 設為 `node scripts/build-static.mjs`，Build output directory 設為 `dist`。

## 注意

目前 Blockly 透過 `https://unpkg.com/blockly/blockly.min.js` 載入，所以教室電腦需要能連網。若要完全離線使用，下一步應改成把 Blockly 套件打包到專案內。
