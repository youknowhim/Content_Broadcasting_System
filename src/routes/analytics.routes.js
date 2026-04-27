const r = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const c = require("../controllers/analytics.controller");

r.get("/most-active-subject", auth, role("principal"), c.mostActiveSubject);
r.get("/top-content", auth, role("principal"), c.topContent);

module.exports = r;

/**
 * @swagger
 * /analytics/most-active-subject:
 *   get:
 *     summary: Get most active subject
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         required: false
 *         description: Filter data from last N days
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Most active subject
 */
/**
 * @swagger
 * /analytics/top-content:
 *   get:
 *     summary: Get top viewed content
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of top results
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: days
 *         required: false
 *         description: Filter data from last N days
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Top viewed content
 */


