# data-schema.md

# Database Schema

## 1. ppt_files

| Field | Type | Description |
|---|---|---|
| id | INTEGER | Primary Key |
| file_name | TEXT | PPT 檔名 |
| file_path | TEXT | PPT 完整路徑 |
| modified_time | TEXT | 檔案修改時間 |
| indexed_at | TEXT | 建立索引時間 |

## 2. slide_contents

| Field | Type | Description |
|---|---|---|
| id | INTEGER | Primary Key |
| ppt_id | INTEGER | 對應 ppt_files.id |
| slide_number | INTEGER | Slide 頁碼 |
| text_content | TEXT | Slide 文字內容 |

## 3. search_index

| Field | Type | Description |
|---|---|---|
| id | INTEGER | Primary Key |
| keyword | TEXT | 關鍵字 |
| ppt_id | INTEGER | 對應 PPT |
| slide_id | INTEGER | 對應 Slide |
| matched_text | TEXT | 命中文字 |

## 4. app_config

| Field | Type | Description |
|---|---|---|
| key | TEXT | 設定名稱 |
| value | TEXT | 設定值 |
