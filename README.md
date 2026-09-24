<div align="center">

# 🧩 Blocky Easy

**專為兒童與初學者設計的觸控友善 Blockly 程式積木闖關平台**  
**子どもと初心者のためのタッチ特化型 Blockly プログラミング学習プラットフォーム**  
**A Touch-Friendly Blockly Visual Programming Adventure for Kids & Beginners**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Custom Levels](https://img.shields.io/badge/Custom_Levels-100_Stages-success.svg)](#-自製-100-關階梯式學習系統-100-custom-levels)
[![Total Stars](https://img.shields.io/badge/Total_Stars-300_%E2%AD%90-gold.svg)](#)
[![Touch Support](https://img.shields.io/badge/Touch_Optimized-iPad_%26_Tablets-orange.svg)](#-專為-ipad-與教室平板打造的極致觸控體驗)
[![Deployment](https://img.shields.io/badge/Deploy-GitHub_Pages_%26_Cloudflare-brightgreen.svg)](#-部署方式-deployment)

---

### 🌐 Language Navigation / 言語選択 / 語言切換
[ **繁體中文** (Traditional Chinese) ](#-繁體中文) &nbsp;•&nbsp; [ **日本語** (Japanese) ](#-日本語) &nbsp;•&nbsp; [ **English** ](#-english)

---
</div>

<br />

---

# 🇹🇼 繁體中文

## 📖 專案簡介

**Blocky Easy** 是一個專為國小學童、幼兒及程式初學者量身打造的純前端、離線友善程式積木闖關平台。

許多開源 Blockly 專案往往直接套用 Google 原生範例，操作上重度依賴鍵盤輸入與滑鼠精細拖曳，在學校 iPad 或觸控平板上課時，常因彈出虛擬鍵盤遮擋畫面、或幼童手指不易精準拖曳積木而大幅降低學習動機。

Blocky Easy 解決了這些教學痛點，不僅進行了全方位的**平板觸控介面重構**，更注入了專案的核心靈魂——**完全自主研發的 100 道階梯式原創程式邏輯關卡**，帶領孩子從零基礎循序漸進跨入演算法思維的殿堂！

---

## 🌟 核心靈魂：全新自製 100 關階梯式學習系統 (100 Custom Levels)

本專案絕非僅是介面套殼，而是設計了一套完整、嚴謹且寓教於樂的教學體系。全套自製關卡共分為 **9 大漸進學習階段**，總計 **100 關**，最高可收集 **300 顆星**：

| 階段 | 階段名稱 | 關卡數 | 核心學習概念與演算法 |
|:---:|:---|:---:|:---|
| **Phase 1** | **移動與轉彎 (Basic Movement)** | 8 關 | 順序結構 (Sequence)、前後方向感、空間幾何感知、避開障礙石牆 |
| **Phase 2** | **For 重複迴圈 (For Loops)** | 10 關 | 重複規律歸納、使用單層 For 迴圈精簡程式碼、直路與轉角搭橋 |
| **Phase 3** | **巢狀 For 入門 (Nested For Intro)** | 8 關 | 兩段式流程分解、迴圈內部再嵌套迴圈（For 內含 For）、長短步數交替組合 |
| **Phase 4** | **進階 For 工廠 (Advanced For Factory)** | 15 關 | 十字對稱折返、凸字城垛雙向巡檢、S型蛇形管道、三峰高難度陣列、雙軌迴圈矩陣 |
| **Phase 5** | **While 基礎 (While Loops Basic)** | 10 關 | 停止條件感知、未知步數探索、零次執行邊界測試、直到傳送門／遇到石牆 |
| **Phase 6** | **If / If-Else 條件 (If / Else Decisions)** | 14 關 | 感測器邏輯判斷（前方無牆/有牆）、條件收集寶石、遇障礙自動轉彎、二選一決策分支 |
| **Phase 7** | **While 路線與回程 (Advanced While)** | 27 關 | 走廊連續巡檢、三層巢狀 While 探測、死巷探索精準回程、左右雙翼橫越、旋轉鎖實驗 |
| **Phase 8** | **迷宮規則 (Maze Algorithms)** | 4 關 | 左右環境感測器、前方分支避障決策、經典「左手貼牆演算法」(Left-Hand Rule) |
| **Phase 9** | **大型綜合挑戰 (Grand Final Challenges)** | 4 關 | 地圖擴大至 10×10 超大型場景，融會貫通 While + For + If/Else 與感測器全方位演算法 |

### 💡 自製 100 關的 4 大教學與工程設計特色：
1. **嚴格方塊數量限制 (Block Limit)**  
   每一關都有精心計算的最佳積木數量上限，徹底防範學生使用「死記前進、硬堆積木」的方式蒙混過關，強制啟發使用迴圈與邏輯結構的最優解。
2. **內建一鍵示範解答 (One-Click Demo Solution)**  
   每關均內建通過驗證的參考解答。老師在投影機展示時可一鍵載入示範，即時播放角色動態路徑；學生思考卡關時亦能作為自學指引。
3. **100 關自動化單元測試防護 (Automated AST Verification)**  
   專案內建自動化驗證腳本（`node scripts/validate-levels.mjs`），以抽象語法樹 (AST) 逐一檢驗 100 關的解答正確性、方塊限制與中英雙語完整性，確保每一次發布皆零 Bug。
4. **三星評分機制與本地進度保存**  
   通關自動計算星級（滿分 300 顆星），搭配悅耳的過關音效，激發學生的挑戰慾；進度完全保存在本機瀏覽器 LocalStorage，免去複雜登入流程。
5. **每關都有可稽核的教學目的**  
   100 關各自定義學習目標、教學角色（新概念／練習／遷移／整合／泛化）、新能力鍵與複習能力；驗證器同時檢查目標不可重複，並對巢狀 For／While 與混合 If/Else 結構設定實際過關要求。

---

## 📱 專為 iPad 與教室平板打造的極致觸控體驗

在平板課堂環境中，操作體驗決定了教學成敗。Blocky Easy 針對觸控進行了深度客製：

- **快捷接方塊列 (Tap-to-Attach)**：免去在小螢幕上長距離拖曳的挫折感，點擊快捷方塊即可自動掛載至程式結尾，或指定放入「重複」與「如果」容器中。
- **完全杜絕虛擬鍵盤**：所有需要輸入數字、轉向角度（如烏龜繪圖）、音高（音樂積木）的地方，全面採用**大型觸控數字鍵盤**與**直覺圓盤角度選擇器**，畫面永不被系統鍵盤遮擋。
- **防誤觸控制列**：「回到起點」僅重置角色與寶石狀態，保留學生好不容易排好的積木；「重來」則清空重寫。
- **直橫雙向靈活適配**：iPad 直向模式自動將積木區置於上半部、地圖置於下半部；橫向模式則呈現清晰的雙欄並排佈局。

---

## 🎮 附加模組與延伸遊戲

1. **Bird 飛鳥任務（觸控強化版）** (`/bird.html`)  
   官方 Blockly Games Bird 的獨立重構版，座標與飛行角度改用大型觸控鍵盤。
2. **Blockly Games 觸控重構版** (`/blockly-games.html`)  
   整合經典六大遊戲（Bird, Turtle, Movie, Music, Pond Tutor, Pond）。包含：
   - 烏龜關卡：全新開發的**360度圓盤角度選擇器**與常用角度快捷鈕（45°、60°、90°、120°、144° 等）。
   - 音樂關卡：特製 C3 至 A4 音符觸控按鍵。
   - 池塘關卡：完全內置本機 ACE 程式編輯器，斷網也能順暢練習 JavaScript。
3. **老師使用手冊** (`teacher-guide.html` & `docs/20260918-老師使用手冊.md`)  
   包含課堂帶課建議、iPad 分配操作、常見問題排解與開源授權對照表。
4. **第二階段課程規劃 Code Builders** (`/course.html`)  
   給完成 100 關、Bird、Turtle 的國小三年級學生的 12 週課程：除錯 → 函式 → 變數 → 事件 → 期末專題，對照 CSTA 1B 標準，含每週進度、學習目標、不插電暖身、出場小卡與專題評量規準。
5. **Quest Lab 任務實驗室** (`/quest.html`)  
   29 個新任務、3 個單元：🐞 Bug Hunt（10 關，每關從有錯的程式開始修）、🧩 Function Factory（10 關，定義／呼叫函式）、🔢 Counting Robots（9 關，計數器變數，多數關卡同時用 2–3 張地圖測試）。預設英文、可切換中文，函式名稱與數字皆用下拉選單，不需鍵盤。以 `node scripts/test-quests.mjs` 驗證每關解答通過、起始程式必定失敗。
6. **Story Lab 事件版** (`/story.html`)  
   新增「👆 當點擊角色」事件積木與「🔁 重複」積木，作為事件單元與期末互動故事專題的創作環境。

---

## 🚀 快速開始與本機運行

專案採用原生 ES Modules 與純靜態架構，無繁複編譯步驟：

```bash
# 1. 下載專案
git clone https://github.com/tmparz/re-blockly-game.git
cd re-blockly-game

# 2. 啟動本機伺服器
node server.mjs
# 或使用 npm
npm run dev

# 3. 瀏覽器開啟
# 訪問 http://127.0.0.1:4173 即可暢玩自製 100 關！
```

### 關卡與建置驗證
```powershell
# 驗證全套 100 關解答與方塊限制
node .\scripts\validate-levels.mjs

# 建立發布用靜態包至 dist/
node .\scripts\build-static.mjs
```

---

## 🌐 部署方式 (Deployment)

- **GitHub Pages**：專案內建 `.github/workflows/deploy-pages.yml`，每次推送到 `main` 分支將自動執行靜態建置並發布至 GitHub Pages。
- **Cloudflare Pages**：執行 `npm run deploy:cloudflare` 或透過 Wrangler 直接部署 `dist/`。

---

<br />

---

# 🇯🇵 日本語

## 📖 プロジェクト概要

**Blocky Easy** は、小学校のプログラミング教育やプログラミング初心者のために開発された、完全オフライン対応のタッチ特化型ビジュアルプログラミング学習プラットフォームです。

一般的な Blockly オープンソース教材は、PC環境を前提としており、キーボード入力やマウスによるドラッグ＆ドロップに依存しています。そのため、小学校のタブレット授業（iPad や Android タブレット）では「ソフトキーボードが画面を覆い隠してしまう」「低学年の児童がブロックをうまくドラッグできない」といった課題が多く見られました。

Blocky Easy は、タブレット授業に最適化された**完全タッチUI**への刷新に加え、本プロジェクトの最大の強みである**完全自作の「100 ステージ段階的学習カリキュラム」**を実装。子どもたちが直感的に論理的思考力とアルゴリズムを身につけられる環境を提供します！

---

## 🌟 最大の特徴：完全オリジナル 100 ステージ段階的学習システム (100 Custom Levels)

単なる既存サンプルの見た目変更ではありません。プログラミングの基礎概念をゼロから体系的に学べるよう、**全 9 フェーズ・100 のオリジナルステージ**（獲得可能スター数 **300 個**）を独自に設計・開発しました：

| フェーズ | フェーズ名 | ステージ数 | 学習内容と習得アルゴリズム |
|:---:|:---|:---:|:---|
| **Phase 1** | **移動と回転 (Basic Movement)** | 8 問 | 順次処理 (Sequence)、空間認識、前進・方向転換、障害物の回避 |
| **Phase 2** | **For 繰り返し (For Loops)** | 10 問 | パターンの発見、単一ループによるコード圧縮、直進と角の規則化 |
| **Phase 3** | **入れ子 For 入門 (Nested For Intro)** | 8 問 | 複数プロセスの分解、ループ内のループ（二重ループ）、異なる歩数の組み合わせ |
| **Phase 4** | **応用 For ファクトリー (Advanced For)** | 15 問 | 十字型対称移動、城壁の巡回、S字パイプライン、3連ピークスキャン、二重軌道マトリクス |
| **Phase 5** | **While ループ基礎 (While Loops Basic)** | 10 問 | 終了条件の理解、歩数が不定な探索、0回実行の境界値、「ワープゾーン到着まで」「壁まで」 |
| **Phase 6** | **If / If-Else 条件分岐 (If / Decisions)** | 14 問 | センサー判定（前方に壁があるか）、宝石の条件付き収集、自律的障害物回避、二者択一判断 |
| **Phase 7** | **While ルート＆帰還 (Advanced While)** | 27 問 | 複雑な通路走査、三重入れ子 While 探索、行き止まり回収と正確な帰還、左右ウイング探査 |
| **Phase 8** | **迷路探索ルール (Maze Algorithms)** | 4 問 | 左右環境センサー、分岐点での自律判断、古典的「左手法アルゴリズム (Left-Hand Rule)」 |
| **Phase 9** | **超大型総合チャレンジ (Grand Challenges)** | 4 問 | 10×10 の巨大工場マップ。While、For、If/Else、センサー全知識を結集した最終課題 |

### 💡 オリジナル 100 ステージの 4 大教育・設計思想：
1. **厳密なブロック数制限 (Block Limit)**  
   全ステージで最適なブロック配置数を設定。「前進ブロックを大量に並べる力任せの解き方」を防ぎ、ループや条件分岐を活用した効率的なアルゴリズム設計を促します。
2. **ワンクリック模範解答デモ (One-Click Demo Solution)**  
   すべてのステージに検証済みの模範コードを内蔵。先生がプロジェクターで解説する際や、児童がつまずいた際のヒントとして瞬時にアニメーション実行が可能です。
3. **全 100 ステージの自動ユニットテスト検証 (Automated AST Verification)**  
   Node.js 実行スクリプト（`node scripts/validate-levels.mjs`）により、構文木（AST）レベルで 100 ステージすべての正解ルート、ブロック数制限、多言語テキストを自動検証。常にバグのない安定稼働を保証します。
4. **3つ星評価とローカル進捗保存**  
   クリア状況に応じて最大 3 つ星（合計 300 ⭐️）を獲得可能。達成感を刺激する効果音とともに、ブラウザの LocalStorage に自動保存されるため、面倒なアカウント登録不要ですぐに授業を開始できます。

---

## 📱 iPad・タブレット授業に特化したタッチ最適化

- **クイック配置バー (Tap-to-Attach)**：画面上のブロックをタップするだけで、プログラムの末尾や「くりかえし」「もし」の中に自動配置。小さな手でもストレスなく組み立てられます。
- **ソフトキーボード完全不要**：数値入力、角度変更（タートル描画）、音階指定（音楽ブロック）にはすべて専用の**大型テンキー**および**直感的なダイヤル式角度セレクター**を搭載。画面がキーボードで隠れません。
- **誤操作防止のコントロールバー**：「最初に戻る」はキャラクターと宝石の位置のみをリセットし、組み立てたブロックは保持。「最初からやり直す」で全消去と、安全に使い分けられます。
- **レスポンシブな縦横両対応レイアウト**：縦向き時は上にブロック、下にマップ。横向き時は見やすい2カラム並列表示に自動切り替え。

---

## 🎮 各種モジュール＆ツール

- **Bird 飛行ミッション（タッチ版）** (`/bird.html`)：角度・座標を大型タッチキーで入力できる単体ミッション。
- **Blockly Games 移植版** (`/blockly-games.html`)：Bird、Turtle、Movie、Music、Pond Tutor、Pond の6大ゲームを収録。タートルの360°アングルセレクターやオフライン ACE エディターを実装。
- **指導者用ガイド** (`teacher-guide.html` & `docs/20260918-老師使用手冊.md`)：授業の流れ、iPad 配置ノウハウ、トラブルシューティングを掲載。
- **第2段階カリキュラム** (`/course.html`)：小学3年生向け12週間計画（デバッグ → 関数 → 変数 → イベント → 最終プロジェクト）。
- **Quest Lab** (`/quest.html`)：Bug Hunt・Function Factory・Counting Robots の3ユニット、全29ミッション。

---

## 🚀 クイックスタート

```bash
# クローン
git clone https://github.com/tmparz/re-blockly-game.git
cd re-blockly-game

# ローカルサーバー起動
node server.mjs
# または
npm run dev

# ブラウザでアクセス
# http://127.0.0.1:4173 を開くとオリジナル 100 ステージをプレイできます！
```

---

<br />

---

# 🇺🇸 English

## 📖 Project Overview

**Blocky Easy** is a touch-friendly, offline-ready visual block coding adventure platform tailored specifically for young children, students, and beginners.

Many existing Blockly web apps rely heavily on standard desktop paradigms—requiring precise mouse drags and popping up intrusive on-screen software keyboards whenever a number or angle is clicked. In a tablet classroom (such as on iPads or Android tablets), this causes immense frustration and disrupts the learning flow.

Blocky Easy completely redesigns the mobile user experience with **touch-first interaction models** and introduces our core signature innovation: a meticulously crafted progression of **100 Custom-Designed Coding Levels**, guiding young minds from sequential reasoning to sophisticated algorithmic thinking!

---

## 🌟 The Flagship Feature: 100 Custom-Crafted Progressive Coding Levels

This platform goes far beyond existing demos. We engineered an entire curriculum consisting of **9 Developmental Phases**, comprising **100 Unique Levels** with up to **300 Stars** to collect:

| Phase | Phase Title | Levels | Core Concepts & Computational Thinking |
|:---:|:---|:---:|:---|
| **Phase 1** | **Basic Movement & Orientation** | 8 | Sequential execution, spatial perception, forward/turning kinematics, avoiding stone obstacles |
| **Phase 2** | **For Loops** | 10 | Pattern recognition, program compression using single loops, bridging long stretches and corners |
| **Phase 3** | **Nested For Intro** | 8 | Decomposition of multi-segment routes, loop nesting (loops inside loops), alternating step lengths |
| **Phase 4** | **Advanced For Factory** | 15 | Cross-patrol symmetry, battlement wave inspections, serpentine conduits, triple peaks, dual-track loops |
| **Phase 5** | **While Loops Basic** | 10 | Termination conditions, variable distance navigation, zero-iteration edge cases, until portal / wall detection |
| **Phase 6** | **If / If-Else Decisions** | 14 | Sensor evaluations (wall ahead / clear), conditional gem gathering, autonomous obstacle turning, binary branching |
| **Phase 7** | **Advanced While & Return** | 27 | Corridor sweeps, 3-layer nested while scans, dead-end gem retrieval with accurate turnaround return, dual-wing navigation |
| **Phase 8** | **Maze Algorithms** | 4 | Left/Right spatial sensors, fork decision routing, and the classic "Left-Hand Rule / Wall Follower" algorithm |
| **Phase 9** | **Grand Final Challenges** | 4 | Giant 10×10 factory scale maps integrating While, For, If/Else, sensors, and inventory algorithms |

### 💡 4 Hallmark Pedagogical & Engineering Strengths:
1. **Strict Block Limits**  
   Every level enforces a hard block limit. Students cannot cheat by simply chaining 15 "move forward" blocks; they are compelled to discover repetitions and formulate efficient logic.
2. **One-Click Reference Solutions (Demo Mode)**  
   Every single level contains a verified reference solution. Teachers can demonstrate solutions to the class with one click, showing animated execution in real-time.
3. **Automated Unit Testing & AST Verification**  
   With `node scripts/validate-levels.mjs`, all 100 levels undergo automated Abstract Syntax Tree (AST) validation—verifying that solution blocks, constraints, map coordinates, and bilingual texts are 100% sound.
4. **300-Star Gamified Reward System**  
   Earn up to 3 stars per stage (300 ⭐️ total). Game progress and star counts are stored locally in the browser's `LocalStorage`—no accounts or passwords required.

---

## 📱 Built for Classrooms: Tablet & Touch-First Optimization

- **Tap-to-Attach Quick Toolbar**: No frustrating drag-and-drop on small screens. Tap a block on the quick bar to automatically snap it to the bottom of the stack or inside a loop container.
- **Zero Software Keyboard Interference**: Angle pickers, coordinate fields, and numeric inputs use **custom on-screen touch keypads** and **360° radial dials**, preventing tablet virtual keyboards from obscuring the screen.
- **Accident-Proof Controls**: "Reset to Start" resets only character and gem states while preserving the student's assembled code; "Start Over" safely clears the canvas.
- **Adaptive Responsive Layout**: Automatically switches between stacked vertical views (code on top, map below) on portrait tablets and side-by-side split screens on landscape tablets.

---

## 🎮 Additional Modules

1. **Bird Game (Touch Edition)** (`/bird.html`): The classic Blockly Games Bird mission refactored with large touch-dial heading selectors.
2. **Blockly Games 6-in-1 Suite** (`/blockly-games.html`): Includes Bird, Turtle, Movie, Music, Pond Tutor, and Pond with localized offline ACE editor integration.
3. **Teacher's Guide** (`teacher-guide.html` & `docs/20260918-老師使用手冊.md`): Full classroom walkthroughs, iPad device management tips, and pedagogical FAQs.
4. **Course Plan, Part 2 — Code Builders** (`/course.html`): A 12-week Grade 3 plan for students who finished the 100 levels, Bird and Turtle: debugging → functions → variables → events → capstone, mapped to CSTA 1B standards.
5. **Quest Lab** (`/quest.html`): 29 new missions in 3 units — Bug Hunt (fix broken starter code), Function Factory (define and call functions), Counting Robots (a counter variable, tested on several maps at once). English by default with a 中文 toggle; validated by `node scripts/test-quests.mjs`.
6. **Story Lab with events** (`/story.html`): New “when clicked” event block and repeat block for interactive stories and the capstone project.

---

## 🚀 Quick Start & Local Development

```bash
# 1. Clone repository
git clone https://github.com/tmparz/re-blockly-game.git
cd re-blockly-game

# 2. Start local development server
node server.mjs
# or via npm
npm run dev

# 3. Open browser
# Navigate to http://127.0.0.1:4173 to play all 100 custom levels!
```

### Validation & Static Build
```bash
# Run automated validation for all 100 custom levels
node scripts/validate-levels.mjs

# Build production bundle to dist/
node scripts/build-static.mjs
```

---

## 🌐 Deployment

- **GitHub Pages**: Continuously built and deployed via `.github/workflows/deploy-pages.yml` upon push to `main`.
- **Cloudflare Pages**: Ready for static edge hosting with `npm run deploy:cloudflare`.

---

## 📜 License & Acknowledgments

- **Blocky Easy Custom Content**: Custom 100 levels, touch UI, sound effects, and documentation are licensed under the [Apache License 2.0](LICENSE).
- **Third-Party Libraries**: Based on Google [Blockly](https://developers.google.com/blockly) and [Blockly Games](https://github.com/google/blockly-games). All third-party rights and licenses are retained in [NOTICE](NOTICE), `bird-game/NOTICE.md`, and `blockly-games/NOTICE.md`.

<div align="center">
Made with ❤️ for young coders and educators worldwide.
</div>
