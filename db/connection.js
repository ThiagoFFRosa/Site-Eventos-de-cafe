const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'coffetau',
  port: 3306
});

module.exports = db;
