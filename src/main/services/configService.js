const dbService = require('./dbService');

function get(key, fallbackValue = null) {
  const row = dbService.selectOne('SELECT value FROM app_config WHERE key = ?', [key]);

  return row ? row.value : fallbackValue;
}

function set(key, value) {
  dbService.run(
    `INSERT INTO app_config (key, value, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET
       value = excluded.value,
       updated_at = excluded.updated_at`,
    [key, value]
  );
}

module.exports = {
  get,
  set
};
