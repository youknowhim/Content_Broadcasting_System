const db = require("../config/db");
const redis = require("../config/redis");
const { getLiveContent } = require("../services/scheduling.service");

exports.live = async (req, res, next) => {
  try {
    const teacherId = Number(req.params.teacherId);
    const { subject } = req.query;

    const cacheKey = `live:${teacherId}:${subject || "all"}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    let query = `
      SELECT c.*, cs.rotation_order, cs.duration 
      FROM content c
      JOIN content_schedule cs ON c.id = cs.content_id
      WHERE c.uploaded_by = ?
      AND c.status = 'approved'
      AND NOW() BETWEEN c.start_time AND c.end_time
    `;

    let values = [teacherId];

    // UBJECT FILTER
    if (subject) {
      query += " AND c.subject = ?";
      values.push(subject);
    }

    const [rows] = await db.execute(query, values);

    if (!rows.length) {
      return res.json({ msg: "No content available" });
    }

    const result = getLiveContent(rows);

    if (!result || !result.length) {
      return res.json({ msg: "No content available" });
    }

    const clean = result.map(c => ({
      id: c.id,
      title: c.title,
      subject: c.subject,
      file_path: c.file_path
    }));
if (clean.length) {
  const values = clean.map(c => [c.id]);

  await db.query(
    "INSERT INTO content_views (content_id) VALUES ?",
    [values]
  );
}

    const ttl = rows[0]?.duration * 60 || 300;

await redis.set(cacheKey, JSON.stringify(clean), "EX", ttl);

    res.json(clean);

  } catch (err) {
    console.error("PUBLIC LIVE ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};