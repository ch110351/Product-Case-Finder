const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const initSqlJs = require('sql.js');

let db;
let databasePath;

function getDatabasePath() {
  const dbDir = path.join(app.getPath('userData'), 'database');
  fs.mkdirSync(dbDir, { recursive: true });
  return path.join(dbDir, 'product-case-finder.sqlite');
}

async function initialize() {
  databasePath = getDatabasePath();
  const SQL = await initSqlJs();
  const databaseFile = fs.existsSync(databasePath) ? fs.readFileSync(databasePath) : null;

  db = databaseFile ? new SQL.Database(databaseFile) : new SQL.Database();
  db.run('PRAGMA foreign_keys = ON');

  const schemaPath = path.join(__dirname, '../../database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.run(schema);
  persist();
}

function getDb() {
  if (!db) {
    throw new Error('Database has not been initialized.');
  }

  return db;
}

function getIndexStats() {
  const pptCount = selectOne('SELECT COUNT(*) AS count FROM ppt_files').count;
  const slideCount = selectOne('SELECT COUNT(*) AS count FROM slide_contents').count;

  return {
    pptCount,
    slideCount
  };
}

function run(sql, params = []) {
  getDb().run(sql, params);
  persist();
}

function runWithoutPersist(sql, params = []) {
  getDb().run(sql, params);
}

function transaction(callback) {
  const database = getDb();

  database.run('BEGIN TRANSACTION');

  try {
    const result = callback();
    database.run('COMMIT');
    persist();
    return result;
  } catch (error) {
    database.run('ROLLBACK');
    throw error;
  }
}

function selectOne(sql, params = []) {
  const rows = selectAll(sql, params);
  return rows[0] || null;
}

function selectAll(sql, params = []) {
  const statement = getDb().prepare(sql);
  const rows = [];

  try {
    statement.bind(params);

    while (statement.step()) {
      rows.push(statement.getAsObject());
    }
  } finally {
    statement.free();
  }

  return rows;
}

function persist() {
  if (!db || !databasePath) {
    return;
  }

  const data = db.export();
  fs.writeFileSync(databasePath, Buffer.from(data));
}

function close() {
  if (db) {
    persist();
    db.close();
    db = null;
  }
}

module.exports = {
  initialize,
  getDb,
  getIndexStats,
  run,
  runWithoutPersist,
  transaction,
  selectOne,
  selectAll,
  close
};
