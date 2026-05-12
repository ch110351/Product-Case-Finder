const path = require('path');

const dbService = require('./dbService');

function clearIndex() {
  dbService.runWithoutPersist('DELETE FROM search_index');
  dbService.runWithoutPersist('DELETE FROM slide_contents');
  dbService.runWithoutPersist('DELETE FROM ppt_files');
}

function insertPptFile(filePath, stats) {
  dbService.runWithoutPersist(
    `INSERT INTO ppt_files (file_name, file_path, modified_time, file_size, indexed_at)
     VALUES (?, ?, ?, ?, datetime('now'))`,
    [path.basename(filePath), filePath, stats.mtime.toISOString(), stats.size]
  );

  return dbService.selectOne('SELECT last_insert_rowid() AS id').id;
}

function insertSlideContent(pptId, slide) {
  dbService.runWithoutPersist(
    `INSERT INTO slide_contents (ppt_id, slide_number, text_content, normalized_text)
     VALUES (?, ?, ?, ?)`,
    [pptId, slide.slideNumber, slide.textContent, slide.textContent.toLowerCase()]
  );

  return dbService.selectOne('SELECT last_insert_rowid() AS id').id;
}

function insertSearchIndex(pptId, slideId, slide) {
  const keywords = extractKeywords(slide.textContent);

  for (const keyword of keywords) {
    dbService.runWithoutPersist(
      `INSERT INTO search_index (keyword, normalized_keyword, ppt_id, slide_id, matched_text)
       VALUES (?, ?, ?, ?, ?)`,
      [keyword, keyword.toLowerCase(), pptId, slideId, buildMatchedText(slide.textContent, keyword)]
    );
  }
}

function extractKeywords(text) {
  const matches = text.match(/[A-Za-z0-9][A-Za-z0-9._/-]{1,}/g) || [];
  const uniqueKeywords = new Set();

  for (const match of matches) {
    const keyword = match.trim();

    if (keyword.length >= 2) {
      uniqueKeywords.add(keyword);
    }
  }

  return Array.from(uniqueKeywords).slice(0, 500);
}

function buildMatchedText(text, keyword) {
  const normalizedText = text.toLowerCase();
  const index = normalizedText.indexOf(keyword.toLowerCase());

  if (index === -1) {
    return text.slice(0, 180);
  }

  const start = Math.max(0, index - 70);
  const end = Math.min(text.length, index + keyword.length + 110);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < text.length ? '...' : '';

  return `${prefix}${text.slice(start, end)}${suffix}`;
}

module.exports = {
  clearIndex,
  insertPptFile,
  insertSlideContent,
  insertSearchIndex
};
