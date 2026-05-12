# flow.md

# CYP Product Case Finder User Flow

## Flow 1：首次建立索引

```text
Launch Application
→ Check Existing Folder Path
→ User Select PPT Folder
→ Start Scan
→ Read PPT Files
→ Extract Slide Text
→ Build SQLite Index
→ Scan Complete
→ Ready for Search
```

## Flow 2：搜尋產品

```text
User Input Product Keyword
→ Click Search
→ Query SQLite Index
→ Match Product Keyword
→ Display Result Summary
→ Display Result List
→ User Reviews Matched PPT
```

## Flow 3：開啟 PPT

```text
User Select Search Result
→ Click Open PPT
→ System Opens File Path
→ Windows Launches PowerPoint
→ User Reviews Original Slide
```

## Flow 4：重新建立索引

```text
User Click Rebuild Index
→ Confirm Rescan
→ Clear Existing Index
→ Rescan PPT Folder
→ Extract Text Again
→ Update SQLite Database
→ Show Complete Message
```

## Flow 5：資料夾變更

```text
User Click Change Folder
→ Select New Folder
→ Save Folder Path
→ Ask Whether to Rebuild Index
→ Start Rebuild Index
```
