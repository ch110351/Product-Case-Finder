# codex-prompt.md

# Codex Prompt

你是一位資深 Electron / Node.js 前端工程師，請根據以下文件建立 CYP Product Case Finder 的 MVP Windows Desktop App。

## 請讀取以下專案文件

- agent.md
- prd.md
- design.md
- flow.md
- architecture.md
- data-schema.md
- test-checklist.md

## 技術需求

- 使用 Electron
- 使用 Node.js
- 前端使用 HTML / CSS / Vanilla JavaScript
- 使用 SQLite 作為本機資料庫
- 不需要雲端
- 不需要登入
- 不需要 OCR
- 不需要 AI 分析
- CSS / JS 請分檔
- 程式碼結構需清楚，方便後續擴充

## MVP 功能

1. 選擇 PPT 資料夾
2. 掃描 `.pptx`
3. 提取簡報文字
4. 建立 SQLite Index
5. 搜尋產品名稱
6. 顯示 PPT 名稱、Slide Number、命中文字、檔案路徑
7. 點擊結果可開啟原始 PPT
8. 支援手動 Rebuild Index

## UI 要求

- 專業、簡潔、內部工具風格
- 主畫面包含：
  - Folder Path
  - Change Folder
  - Rebuild Index
  - Search Input
  - Search Button
  - Result Summary
  - Result List
  - Open PPT Button

## 輸出要求

請提供完整可執行專案，包含：

- package.json
- main.js
- preload.js
- index.html
- renderer.js
- style.css
- services/pptScanner.js
- services/indexService.js
- services/dbService.js
- README.md

若 PPT parser 套件有限制，請先用可替換的 parser service 架構實作，並清楚標註後續替換位置。
