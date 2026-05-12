# prd.md

# CYP Product Case Finder PRD

## 1. Overview

CYP Product Case Finder 是一套 Windows 平台內部工具，用於掃描大量 PowerPoint 簡報，並讓使用者輸入產品名稱後，快速查詢該產品出現在哪些 PPT 與 Slide 中。

## 2. Target Users

- Product Manager
- Sales Team
- FAE
- Marketing Team
- System Integrator

## 3. Product Goal

協助內部人員快速查找產品應用案例，提升提案、教育訓練與產品資料重用效率。

## 4. Feature List

### 4.1 Folder Management

- 選擇本機 PPT 資料夾
- 顯示目前資料夾路徑
- 記憶上次使用路徑
- 支援子資料夾掃描

### 4.2 PPT Scan Engine

- 掃描 `.pptx` 檔案
- 讀取簡報文字內容
- 提取 Slide Title、Text Box、Shape Text、Table Text
- 跳過損壞或不支援的檔案

### 4.3 Product Index

- 建立產品關鍵字索引
- 儲存檔名、路徑、Slide 頁碼、命中文字
- 使用 SQLite 儲存索引資料

### 4.4 Product Search

- 輸入產品名稱進行搜尋
- 支援 Partial Match
- 支援 Ignore Case
- 顯示搜尋結果

### 4.5 Search Result Viewer

- 顯示 PPT 名稱
- 顯示 Slide Number
- 顯示命中文字片段
- 顯示檔案路徑

### 4.6 Open PPT

- 從搜尋結果開啟原始 PPT
- 使用 Windows 預設 PowerPoint 應用程式開啟

### 4.7 Rebuild Index

- 手動重新掃描資料夾
- 顯示掃描進度
- 更新 SQLite 資料庫

## 5. MVP Scope

### Included

- PPT 掃描
- 文字提取
- SQLite 索引
- 產品搜尋
- 結果顯示
- 開啟原始 PPT
- 手動重建索引

### Excluded

- OCR
- AI 分析
- Chrome Plugin
- Cloud Sync
- User Login
- SharePoint Integration
