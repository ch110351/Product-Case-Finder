# design.md

# CYP Product Case Finder UI Design

## 1. UI Style

整體風格需符合內部專業工具：

- 簡潔
- 清楚
- 高可讀性
- 偏企業工具風格
- 不需要過度視覺設計

## 2. Main Window Layout

```text
------------------------------------------------
| CYP Product Case Finder                      |
------------------------------------------------
| Folder: D:\Marketing\PPT                   |
| [Change Folder] [Rebuild Index]              |
------------------------------------------------
| Search Product: [________________] [Search]  |
------------------------------------------------
| Result Summary                               |
| Found 12 results in 5 PPT files              |
------------------------------------------------
| Result List                                  |
| -------------------------------------------- |
| PPT Name: CS11_CaseStudy.pptx                |
| Slide: 12                                    |
| Match: CDPS-CS11 used as AV controller...    |
| Path: D:\Marketing\PPT\CS11_CaseStudy.pptx |
| [Open PPT]                                   |
| -------------------------------------------- |
------------------------------------------------
```

## 3. UI Sections

### 3.1 Header

- 顯示工具名稱
- 顯示版本號

### 3.2 Folder Area

- 顯示目前掃描資料夾
- Change Folder Button
- Rebuild Index Button

### 3.3 Search Area

- Product Keyword Input
- Search Button
- Clear Button

### 3.4 Result Summary

- 顯示搜尋結果數量
- 顯示命中的 PPT 數量
- 顯示最後索引時間

### 3.5 Result List

每筆結果顯示：

- PPT 檔名
- Slide Number
- 命中文字
- 檔案路徑
- Open PPT Button

## 4. Interaction

- 點擊 Search 後更新結果列表
- 點擊 Open PPT 開啟原始檔案
- 點擊 Rebuild Index 重新掃描
- 掃描中顯示 loading / progress
