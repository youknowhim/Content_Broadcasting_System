const db = require("../config/db");

const initDB = async () => {
  try {
    // usera
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password_hash TEXT,
        role ENUM('teacher', 'principal') DEFAULT 'teacher',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // content table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        subject VARCHAR(100),
        file_path TEXT,
        uploaded_by INT,
        status ENUM('pending','approved','rejected') DEFAULT 'pending',
        rejection_reason TEXT,
        approved_by INT,
        approved_at DATETIME,
        start_time DATETIME,
        end_time DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS content_slots (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subject VARCHAR(100) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // rotation
    await db.execute(`
      CREATE TABLE IF NOT EXISTS content_schedule (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content_id INT,
        slot_id INT,
        rotation_order INT,
        duration INT DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
        FOREIGN KEY (slot_id) REFERENCES content_slots(id) ON DELETE CASCADE
      )
    `);

    // analytivs
    await db.execute(`
      CREATE TABLE IF NOT EXISTS content_views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content_id INT,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
      )
    `);

    console.log("All tables created successfully");

  } catch (err) {
    console.error("DB INIT ERROR:", err);
  }
};

module.exports = initDB;