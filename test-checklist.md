# test-checklist.md

# MVP Test Checklist

## 1. Folder Management

- [ ] 可以選擇本機資料夾
- [ ] 可以顯示目前資料夾路徑
- [ ] App 重開後仍可記住上次資料夾
- [ ] 可掃描子資料夾

## 2. PPT Scan

- [ ] 可以掃描 `.pptx`
- [ ] 可以跳過非 PPT 檔案
- [ ] 可以提取 Slide 文字
- [ ] 損壞檔案不會造成 App Crash

## 3. Index

- [ ] 可以建立 SQLite Database
- [ ] 可以儲存 PPT 檔名
- [ ] 可以儲存 Slide Number
- [ ] 可以儲存文字內容
- [ ] 可以重新建立索引

## 4. Search

- [ ] 可以輸入產品名稱搜尋
- [ ] 支援 Partial Match
- [ ] 支援大小寫不敏感
- [ ] 搜尋結果小於 1 秒回應

## 5. Result Viewer

- [ ] 顯示 PPT 名稱
- [ ] 顯示 Slide Number
- [ ] 顯示命中文字
- [ ] 顯示檔案路徑

## 6. Open PPT

- [ ] 點擊 Open PPT 可開啟原始檔案
- [ ] 找不到檔案時顯示錯誤訊息

## 7. Stability

- [ ] 掃描大量 PPT 不會當機
- [ ] 搜尋空字串時有提示
- [ ] 沒有索引時有提示
