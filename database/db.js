const sqlite3 = require('sqlite3').verbose(); // verbose log for debugging purpose
const db = new sqlite3.Database('./database/mydb.sqlite'); // Opens or creates the DB Compliments



db.run(`
  CREATE TABLE IF NOT EXISTS compliments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    flagged INTEGER DEFAULT 0
  )
`);


module.exports = db; // Exports the database connection