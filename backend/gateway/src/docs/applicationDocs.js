


/**
 * @openapi
 * /applications:
 *   get:
 *     tags: [Applications]
 *     summary: List job applications
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Application list
 *
 * /applications/apply:
 *   post:
 *     tags: [Applications]
 *     summary: Apply for a job
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
*       200:
 *         description: Applied
 *       401:
 *         description: Missing/invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

