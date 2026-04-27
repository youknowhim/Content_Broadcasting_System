const db = require("../config/db");
const redis = require("../config/redis");

// FORMAT DATE FOR MYSQLl
const formatDate = (iso) => {
  const d = new Date(iso);

  if (isNaN(d)) return null;

  return d.toISOString().slice(0, 19).replace("T", " ");
};


// UPLOAD CONTENT
exports.upload = async (req, res, next) => {
  try {
    const { title, subject, start_time, end_time, duration } = req.body;

    // BASIC VALIDATION
    if (!title || !subject) {
      return res.status(400).json({ msg: "Title & subject required" });
    }

    if (!start_time || !end_time) {
      return res.status(400).json({ msg: "Start & end time required" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "File required" });
    }

    // FIX DATETIME FORMAT
    const start = formatDate(start_time);
    const end = formatDate(end_time);

    if (!start || !end) {
      return res.status(400).json({ msg: "Invalid date format" });
    }

    // INSERT CONTENT
    const [result] = await db.execute(
      `INSERT INTO content 
      (title, subject, file_path, uploaded_by, start_time, end_time)
      VALUES (?,?,?,?,?,?)`,
      [title, subject, req.file.path, req.user.id, start, end]
    );

    const contentId = result.insertId;

    //  GET OR CREATE SLOT
    let [slot] = await db.execute(
      "SELECT * FROM content_slots WHERE subject=?",
      [subject]
    );

    let slotId;

    if (!slot.length) {
      const [newSlot] = await db.execute(
        "INSERT INTO content_slots (subject) VALUES (?)",
        [subject]
      );
      slotId = newSlot.insertId;
    } else {
      slotId = slot[0].id;
    }

    //  ROTATION ORDER
    const [order] = await db.execute(
      "SELECT MAX(rotation_order) as max FROM content_schedule WHERE slot_id=?",
      [slotId]
    );

    const nextOrder = (order[0].max || 0) + 1;

    //  INSERT SCHEDULE
    await db.execute(
      `INSERT INTO content_schedule 
      (content_id, slot_id, rotation_order, duration)
      VALUES (?,?,?,?)`,
      [contentId, slotId, nextOrder, duration || 5]
    );

    // CACHE INVALIDATION (IMPORTANT)
    await redis.del(`live:${req.user.id}`);

    res.json({ msg: "Uploaded successfully" });

  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    next(err);
  }
};


//  TEACHER VIEW (MY CONTENT)
exports.myContent = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
        id,
        title,
        subject,
        status,
        rejection_reason,
        approved_at
      FROM content
      WHERE uploaded_by=?`,
      [req.user.id]
    );

    res.json(rows);

  } catch (err) {
    console.log("MY CONTENT ERROR:", err);
    next(err);
  }
};