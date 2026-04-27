const db = require("../config/db");

exports.getMyContent = async (req, res, next) => {
  try {
    const teacherId = req.user.id; 
    const { subject } = req.query;

    let query = `
      SELECT 
        id,
        title,
        subject,
        status,
        rejection_reason,
        approved_at,
        start_time,
        end_time
      FROM content
      WHERE uploaded_by = ?
    `;

    let values = [teacherId];

    if (subject) {
      query += " AND subject = ?";
      values.push(subject);
    }

    query += " ORDER BY id DESC";

    const [rows] = await db.execute(query, values);

    res.json(rows);

  } catch (err) {
    console.error(err);
    next(err);
  }
};