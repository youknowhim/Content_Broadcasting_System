const r = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");

const c = require("../controllers/content.controller");

r.post("/", auth, role("teacher"), upload.single("file"), c.upload);
r.get("/my", auth, role("teacher"), c.myContent);

module.exports = r;
/**
 * @swagger
 * /content:
 *   post:
 *     summary: Upload content (Teacher only)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - subject
 *               - file
 *               - start_time
 *               - end_time
 *             properties:
 *               title:
 *                 type: string
 *                 example: Maths Notes
 *               subject:
 *                 type: string
 *                 example: maths
 *               file:
 *                 type: string
 *                 format: binary
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-04-26T10:00:00Z
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-04-26T12:00:00Z
 *               duration:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Content uploaded successfully
 */