

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a user profile record linked to an auth user
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
 *         description: Created
 *       401:
 *         description: Missing/invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /users/{auth_id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user profile by auth user id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: auth_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Missing/invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     tags: [Users]
 *     summary: Update user profile by auth user id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: auth_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 *       401:
 *         description: Missing/invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags: [Users]
 *     summary: Delete user profile by auth user id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: auth_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       401:
 *         description: Missing/invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */