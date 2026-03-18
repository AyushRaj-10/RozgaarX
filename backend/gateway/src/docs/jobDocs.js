
/**
 * @openapi
 * /jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: List jobs
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Job list
 *   post:
 *     tags: [Jobs]
 *     summary: Create a new job posting (recruiter role required)
 *     description: Requires a valid JWT; recruiter authorization is enforced in the jobs service.
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
 * /jobs/search:
 *   get:
 *     tags: [Jobs]
 *     summary: Search jobs
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 *
 * /jobs/{id}:
 *   get:
 *     tags: [Jobs]
 *     summary: Get a single job by id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job
 *   put:
 *     tags: [Jobs]
 *     summary: Update an existing job posting (recruiter role required)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *   delete:
 *     tags: [Jobs]
 *     summary: Delete a job posting (recruiter role required)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */