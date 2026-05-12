CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ppt_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  modified_time TEXT NOT NULL,
  file_size INTEGER,
  indexed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS slide_contents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ppt_id INTEGER NOT NULL,
  slide_number INTEGER NOT NULL,
  text_content TEXT NOT NULL,
  normalized_text TEXT NOT NULL,
  FOREIGN KEY (ppt_id) REFERENCES ppt_files(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS search_index (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  keyword TEXT NOT NULL,
  normalized_keyword TEXT NOT NULL,
  ppt_id INTEGER NOT NULL,
  slide_id INTEGER NOT NULL,
  matched_text TEXT,
  FOREIGN KEY (ppt_id) REFERENCES ppt_files(id) ON DELETE CASCADE,
  FOREIGN KEY (slide_id) REFERENCES slide_contents(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ppt_files_path ON ppt_files(file_path);
CREATE INDEX IF NOT EXISTS idx_slide_contents_ppt_id ON slide_contents(ppt_id);
CREATE INDEX IF NOT EXISTS idx_slide_contents_normalized_text ON slide_contents(normalized_text);
CREATE INDEX IF NOT EXISTS idx_search_index_keyword ON search_index(normalized_keyword);
