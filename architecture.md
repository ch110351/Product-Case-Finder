# architecture.md

# CYP Product Case Finder Architecture

## 1. System Overview

```text
Windows Desktop App
│
├── Electron Main Process
│   ├── File System Access
│   ├── PPT Scan Service
│   ├── SQLite Service
│   └── OS File Open Service
│
├── Renderer Process
│   ├── HTML UI
│   ├── CSS Style
│   └── JavaScript Interaction
│
└── Local Data
    ├── SQLite Database
    └── App Config
```

## 2. Module Description

### 2.1 UI Layer

負責顯示：

- Folder Path
- Search Input
- Search Result
- Scan Progress
- Open PPT Button

### 2.2 PPT Scan Service

負責：

- 掃描資料夾
- 找出 `.pptx`
- 讀取簡報文字
- 回傳 Slide Content

### 2.3 Index Service

負責：

- 建立索引
- 更新 SQLite
- 查詢產品名稱
- 回傳搜尋結果

### 2.4 File Open Service

負責：

- 根據 file path 開啟 PPT
- 呼叫 Windows 預設應用程式

## 3. Data Flow

```text
PPT Folder
→ PPT Scan Service
→ Text Extraction
→ SQLite Index
→ Search UI
→ Result List
→ Open PPT
```
