const db = require("../config/db");

// APPROVE
exports.approve = async (req, res, next) => {
  try {
    const contentId = req.params.id;

    // check content
    const [rows] = await db.execute(
      "SELECT status FROM content WHERE id=?",
      [contentId]
    );

    if (!rows.length) {
      return res.status(404).json({ msg: "Content not found" });
    }

    const status = rows[0].status;

    // edge cases
    if (status === "approved") {
      return res.status(400).json({ msg: "Already approved" });
    }

    if (status === "rejected") {
      return res.status(400).json({ msg: "Cannot approve rejected content" });
    }

    // only pending allowed
    await db.execute(
      "UPDATE content SET status='approved', approved_by=?, approved_at=NOW() WHERE id=?",
      [req.user.id, contentId]
    );

    res.json({ msg: "Approved successfully" });

  } catch (err) {
    console.error("APPROVE ERROR:", err);
    next(err);
  }
};

// REJECT
exports.reject = async (req, res, next) => {
  try {
    const contentId = req.params.id;
    let { reason } = req.body;

    if (!reason || typeof reason !== "string" || reason.trim().length < 5) {
      return res.status(400).json({
        msg: "Valid rejection reason required (min 5 characters)"
      });
    }

    reason = reason.trim();

    // check content
    const [rows] = await db.execute(
      "SELECT status FROM content WHERE id=?",
      [contentId]
    );

    if (!rows.length) {
      return res.status(404).json({ msg: "Content not found" });
    }

    const status = rows[0].status;

    if (status === "rejected") {
      return res.status(400).json({ msg: "Already rejected" });
    }

    if (status === "approved") {
      return res.status(400).json({ msg: "Cannot reject approved content" });
    }

    // update
    await db.execute(
      `UPDATE content 
       SET status='rejected', 
           rejection_reason=?, 
           approved_by=?, 
           approved_at=NOW() 
       WHERE id=?`,
      [reason, req.user.id, contentId]
    );

    res.json({ msg: "Rejected successfully" });

  } catch (err) {
    console.error("REJECT ERROR:", err);
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { subject, teacherId, status, page, limit } = req.query;

    let query = "SELECT * FROM content WHERE 1=1";
    let values = [];

    // filters
    if (subject) {
      query += " AND subject = ?";
      values.push(subject);
    }

    if (teacherId) {
      const tid = Number(teacherId);
      if (!isNaN(tid)) {
        query += " AND uploaded_by = ?";
        values.push(tid);
      }
    }

    if (status) {
      query += " AND status = ?";
      values.push(status);
    }

    // pagination
    if (page && limit) {
      const pageNum = Number(page);
      const limitNum = Number(limit);

      if (!isNaN(pageNum) && !isNaN(limitNum)) {
        const offset = (pageNum - 1) * limitNum;

        query += ` LIMIT ${limitNum} OFFSET ${offset}`;
      }
    }


    const [rows] = await db.execute(query, values);

    res.json(rows);

  } catch (err) {
    console.error("GET ALL ERROR:", err);
    next(err);
  }
};