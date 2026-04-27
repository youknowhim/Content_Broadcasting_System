const db = require("../config/db");

exports.mostActiveSubject = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT subject, COUNT(*) as total
       FROM content
       GROUP BY subject
       ORDER BY total DESC
       LIMIT 1`
    );

    res.json(rows[0] || { msg: "No data" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error" });
  }
};

exports.topContent = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT c.id, c.title, c.subject, COUNT(v.id) as views
       FROM content c
       JOIN content_views v ON c.id = v.content_id
       GROUP BY c.id
       ORDER BY views DESC
       LIMIT 5`
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error" });
  }
};