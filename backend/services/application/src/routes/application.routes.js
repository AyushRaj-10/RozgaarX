import { verifyToken } from "../middlewares/auth.middlewares.js";
import { getApplications, applyForJob } from "../controllers/application.controllers.js";
import express from "express";

const router = express.Router();

router.post("/apply", verifyToken, applyForJob);
router.get("/", getApplications);

export default router;