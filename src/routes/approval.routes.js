const r = require("express").Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const c = require("../controllers/approval.controller");

/**
 * @swagger
 * /approval/approve/{id}:
 *   post:
 *     summary: Approve content (Principal only)
 *     tags: [Approval]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Content ID to approve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Content approved successfully
 *         content:
 *           application/json:
 *             example:
 *               msg: Approved
 *       401:
 *         description: Unauthorized
 */
r.post("/approve/:id", auth, role("principal"), c.approve);


/**
 * @swagger
 * /approval/reject/{id}:
 *   post:
 *     summary: Reject content (Principal only)
 *     tags: [Approval]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Content ID to reject
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Invalid or inappropriate content
 *     responses:
 *       200:
 *         description: Content rejected successfully
 *         content:
 *           application/json:
 *             example:
 *               msg: Rejected
 *       400:
 *         description: Reason required
 *       401:
 *         description: Unauthorized
 */
r.post("/reject/:id", auth, role("principal"), c.reject);


/**
 * @swagger
 * /approval/all:
 *   get:
 *     summary: Get all content with filters (Principal only)
 *     tags: [Approval]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *           example: maths
 *         description: Filter by subject
 *       - in: query
 *         name: teacherId
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Filter by teacher ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: List of content
 *       401:
 *         description: Unauthorized
 */
r.get("/all", auth, role("principal"), c.getAll);

module.exports = r;