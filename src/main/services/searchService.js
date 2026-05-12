const dbService = require('./dbService');

function normalizeKeyword(keyword) {
  return String(keyword || '').trim().toLowerCase();
}

function search(keyword) {
  const normalizedKeyword = normalizeKeyword(keyword);

  if (!normalizedKeyword) {
    return {
      total: 0,
      results: []
    };
  }

  const rows = dbService.selectAll(
    `SELECT
       pf.file_name AS fileName,
       pf.file_path AS filePath,
       sc.slide_number AS slideNumber,
       sc.text_content AS textContent
     FROM slide_contents sc
     INNER JOIN ppt_files pf ON pf.id = sc.ppt_id
     WHERE sc.normalized_text LIKE ?
     ORDER BY pf.file_name COLLATE NOCASE ASC, sc.slide_number ASC
     LIMIT 200`,
    [`%${normalizedKeyword}%`]
  );

  const results = rows.map((row) => ({
    ...row,
    matchedText: buildSnippet(row.textContent, normalizedKeyword)
  }));

  return {
    total: results.length,
    results
  };
}

function buildSnippet(text, normalizedKeyword) {
  if (!text) {
    return '';
  }

  const normalizedText = text.toLowerCase();
  const index = normalizedText.indexOf(normalizedKeyword);

  if (index === -1) {
    return text.slice(0, 180);
  }

  const start = Math.max(0, index - 70);
  const end = Math.min(text.length, index + normalizedKeyword.length + 110);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < text.length ? '...' : '';

  return `${prefix}${text.slice(start, end)}${suffix}`;
}

module.exports = {
  search
};
