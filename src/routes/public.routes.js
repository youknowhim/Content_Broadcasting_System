const r = require("express").Router();
const c = require("../controllers/public.controller");
const { publicLimiter } = require("../middlewares/rateLimit.middleware");

r.get("/live/:teacherId", publicLimiter, c.live);

module.exports = r;
/**
 * @swagger
 * /public/live/{teacherId}:
 *   get:
 *     summary: Get live approved content for a teacher (public)
 *     tags: [Public]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         description: Teacher ID
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: subject
 *         required: false
 *         description: Filter content by subject
 *         schema:
 *           type: string
 *           example: maths
 *     responses:
 *       200:
 *         description: List of live content
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "id": 1,
 *                   "title": "Maths Notes",
 *                   "subject": "maths",
 *                   "file_path": "uploads/file.png"
 *                 }
 *               ]
 */