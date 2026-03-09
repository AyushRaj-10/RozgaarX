import { verifyToken } from "../middlewares/auth.middlewares.js";
import { getApplications, applyForJob , getApplicationsForJob, getApplicationsForUser, updateApplicationStatus } from "../controllers/application.controllers.js";
import express from "express";
import { roleMiddleware } from "../middlewares/role.middlewares.js";

const router = express.Router();

router.post("/apply", verifyToken, applyForJob);
router.get("/", getApplications);
router.get("/job/:jobId", getApplicationsForJob);
router.get("/user/:userId", getApplicationsForUser);
router.put("/:applicationId/status", verifyToken, roleMiddleware(["recruiter"]), updateApplicationStatus);

export default router;