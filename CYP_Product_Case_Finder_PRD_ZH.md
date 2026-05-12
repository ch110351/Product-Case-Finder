# CYP Product Case Finder PRD
Version: 0.1
Date: 2026/05/12

---

# 1. 產品介紹

## 1.1 Overview

本文件定義「CYP Product Case Finder」產品需求文件（PRD）。

本產品為一套 Windows 平台的內部工具，主要協助業務、產品經理、FAE 與行銷團隊快速搜尋：

> 某個 CYP 產品曾出現在哪些 PowerPoint 應用案例簡報中。

系統可掃描指定資料夾中的 `.pptx` 檔案，提取簡報中的文字內容，建立可搜尋的產品索引資料庫，並提供產品名稱搜尋功能，以快速定位相關簡報與頁面位置。

產品目標為：
- 提升提案效率
- 降低尋找簡報時間
- 建立內部產品應用知識庫

---

## 1.2 產品功能

- 掃描並索引 PowerPoint 簡報檔案（`.pptx`）
- 提取簡報中的文字內容
- 建立產品關鍵字索引
- 支援產品名稱搜尋
- 顯示命中的 PPT 與頁碼
- 直接開啟原始 PPT
- 支援遞迴掃描子資料夾
- 使用 SQLite 儲存索引資料
- 支援重新建立索引
- 支援 Partial Match 搜尋
- 支援 Ignore Case 搜尋
- Windows Desktop Application 執行

---

## 1.3 目標使用者

- Product Manager
- Sales Team
- FAE
- Marketing Team
- System Integrator

---

## 1.4 使用情境

### Use Case 1 — 搜尋產品案例

業務輸入「CDPS-CS11」，快速找到所有包含該產品的應用案例 PPT。

### Use Case 2 — 提案準備

PM 搜尋「Hyshare Pro」，快速找到既有簡報作為提案參考。

### Use Case 3 — 產品知識學習

新人搜尋「AV over IP」相關產品，快速閱讀既有應用案例。

---

# 2. 應用場景

## 2.1 應用方向

- 內部產品知識管理
- 產品應用案例搜尋
- 行銷簡報管理
- 提案資料查詢
- 技術教育訓練

---

# 3. 系統架構

## 3.1 系統模組

### UI Layer
- Search Interface
- Result Viewer
- Folder Selector
- Index Management

### PPT Scan Engine
- PPT Parser
- Text Extraction Engine

### Index Engine
- Product Keyword Index
- SQLite Database

### File Integration Layer
- Open PPT File
- File Path Management

---

# 4. 功能需求

# 4.1 Folder Management

## 功能描述

讓使用者選擇與管理 PowerPoint 掃描資料夾。

## 功能內容

- 選擇本機資料夾
- 記憶上次使用路徑
- 支援遞迴掃描子資料夾
- 顯示目前資料夾路徑

---

# 4.2 PPT Scan Engine

## 功能描述

掃描 PowerPoint 並提取文字內容。

## 功能內容

- 掃描 `.pptx`
- 提取：
  - Slide Title
  - Text Box
  - Shape Text
  - Table Text
- 忽略不支援格式
- 跳過損壞檔案

---

# 4.3 Product Index Management

## 功能描述

建立與管理產品索引資料。

## 功能內容

- 建立產品關鍵字索引
- 儲存：
  - 檔名
  - Slide 頁碼
  - 命中文字
  - 檔案路徑
- 使用 SQLite 儲存
- 支援手動重建索引

---

# 4.4 Product Search

## 功能描述

搜尋產品名稱。

## 功能內容

- Keyword Search
- Partial Match
- Ignore Case

---

# 4.5 Search Result Viewer

## 功能描述

顯示搜尋結果。

## 功能內容

- 顯示 PPT 名稱
- 顯示 Slide 頁碼
- 顯示命中文字
- 顯示檔案路徑

---

# 4.6 Open PPT File

## 功能描述

開啟原始 PowerPoint。

## 功能內容

- 使用 PowerPoint 開啟
- 從搜尋結果直接開啟

---

# 4.7 Index Rebuild

## 功能描述

重新建立索引資料。

## 功能內容

- 手動重建索引
- 顯示掃描進度
- 更新 SQLite Database

---

# 5. 使用者流程

## 5.1 Initial Setup Flow

```text
Launch Application
→ Select PPT Folder
→ Start Scan
→ Build Index
→ Scan Complete
→ Ready for Search
```

---

## 5.2 Product Search Flow

```text
Input Product Keyword
→ Execute Search
→ Display Result List
→ Select PPT Result
→ Open PPT File
```

---

## 5.3 Rebuild Index Flow

```text
Click Rebuild Index
→ Rescan PPT Folder
→ Update SQLite Database
→ Rebuild Complete
```

---

# 6. UI Requirement

## 6.1 Main Window

### Top Area
- Folder Path
- Change Folder Button
- Rebuild Index Button

### Search Area
- Search Input
- Search Button

### Result Area
- PPT Result List
- Slide Number
- Match Text

---

# 7. Database Requirement

## 7.1 SQLite Database

### PPT File Table

| Field | Description |
|---|---|
| file_name | PPT 檔名 |
| file_path | 檔案路徑 |
| modified_time | 修改時間 |

---

### Slide Content Table

| Field | Description |
|---|---|
| ppt_id | PPT ID |
| slide_number | Slide 頁碼 |
| text_content | 提取文字 |

---

### Product Index Table

| Field | Description |
|---|---|
| product_keyword | 產品名稱 |
| matched_file | 命中檔案 |
| matched_slide | 命中頁碼 |
| matched_text | 命中文字 |

---

# 8. Non-Functional Requirement

## 8.1 Performance

| Item | Requirement |
|---|---|
| Search Response | 小於 1 秒 |
| Index Rebuild | 支援 1000+ PPT |
| Startup Time | 小於 5 秒 |

---

## 8.2 Stability

| Item | Requirement |
|---|---|
| Continuous Operation | 7 天穩定運行 |
| Database Recovery | 自動恢復 |

---

## 8.3 Compatibility

| Item | Requirement |
|---|---|
| OS | Windows 10 / 11 |
| File Type | `.pptx` |

---

# 9. MVP Scope

## Included

- PPT 掃描
- 產品搜尋
- 結果顯示
- 開啟 PPT
- SQLite 索引
- 手動重建索引

---

## Excluded

- OCR 辨識
- AI 分析
- Cloud Sync
- User Login
- Chrome Plugin
- SharePoint Integration

---

# 10. Future Enhancement

## Phase 2

- OCR 圖片辨識
- AI 案例推薦
- Product Relationship Graph
- Chrome Extension
- NAS / SharePoint 整合
- PPT Thumbnail Preview
- Multi-user Access Management

---

# 11. Recommended Technology Stack

| Layer | Technology |
|---|---|
| Desktop Framework | Electron |
| Frontend | HTML / CSS / JavaScript |
| Backend | Node.js |
| Database | SQLite |
| PPT Parser | pptx-parser / officeparser |

---

# 12. Product Value

CYP Product Case Finder 的核心價值在於：

將分散的 PowerPoint 應用案例，轉換成可搜尋的產品知識系統。

提升：
- 提案效率
- 產品知識重用率
- 教育訓練效率
- 團隊協作能力

並作為未來 AI Solution Recommendation System 的基礎。
