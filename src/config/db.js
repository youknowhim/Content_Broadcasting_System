const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "../../certs/ca.pem"))
  }
});

module.exports = db;
