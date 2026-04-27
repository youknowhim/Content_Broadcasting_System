const r = require("express").Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const c = require("../controllers/teacher.controller");
/**
 * @swagger
 * /teacher/content:
 *   get:
 *     summary: Get all content uploaded by logged-in teacher
 *     tags: [Teacher]
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *           example: maths
 *         description: Filter by subject (optional)
 *     responses:
 *       200:
 *         description: Teacher content list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
r.get("/content", auth, role("teacher"), c.getMyContent);

module.exports = r;