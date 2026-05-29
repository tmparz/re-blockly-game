# Blocky Easy

Blocky Easy 是一個給小朋友練習程式邏輯的 Blockly 遊戲站台。第一版包含 50 個關卡，分成五個階段：基礎移動與轉彎、For 重複、巢狀 For 入門、進階 For 工廠、If 條件判斷。

上方有關卡下拉選單，可以依階段快速切換關卡。任務目標、方塊限制與提示會跟著目前關卡更新。

工作區上方有「接方塊」快捷列，點一下就會把目前關卡可用的方塊接到 Blockly 的開始方塊下面。點「重複」或「如果」後，快捷列會切到該容器裡，接下來的方塊會放進去；可用「上一層」或「主程式」切回外層。也可以點 Blockly 左側分類，從原本的方塊抽屜拖出來。重複次數與 If 條件直接在 Blockly 方塊上調整。

平板版已移除額外的程式列區塊，把空間留給 Blockly 工作區。iPad 直向會先顯示關卡資訊與 Blockly，遊戲地圖接在下方；橫向則是地圖與 Blockly 並排。

執行成功會播放成功音效，失敗或撞牆會播放失敗音效；支援平板瀏覽器的觸控操作。

每關都有方塊數限制。重複練習關卡會限制到必須使用 For 方塊，避免只堆很多「前進一步」通過。

巢狀 For 入門新增 8 個中段關卡，放在 For 重複與進階 For 工廠之間。這一段先讓玩家習慣兩個 For 串接、三個 For 串接，再逐步練習「For 裡面放 For」與「巢狀 For 後面再接一個 For」，避免直接跳到大型進階路線。

進階 For 工廠新增 10 個關卡，主題是能量站巡線、採礦、巡檢與矩陣掃描。這一階段會大量使用二層以上的 For：例如「重複一組路線」、「每條線重複相同掃描流程」、「外圈與內圈跑道」等，後段關卡會比原本 For 階段更需要先觀察規律再組合迴圈。

If 階段改成更平緩的 14 關 progression：最前面先用多個小關卡練習「前方沒牆才走」、「前方有牆才轉彎」、「站在寶石上才收集」，再把 For 放進 If，接著用 For 反覆執行 If 規則，最後引入 If/Else，讓玩家用「遇牆轉彎，否則前進」的規則自動通過路線並收集寶石。

每一關都有「示範」按鈕，可以讓老師快速放入參考方塊，再按「執行」展示路線。

站台支援中文與英文切換，語言選擇會記在瀏覽器裡。關卡名稱、目標、提示、按鈕、快速方塊列與 Blockly 自訂積木都會跟著切換。

## 使用方式

直接用瀏覽器開啟 `index.html`，或用本機伺服器啟動：

```powershell
node .\server.mjs
```

然後打開 `http://127.0.0.1:4173`。

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
