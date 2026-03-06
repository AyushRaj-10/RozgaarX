import { getJobHandler, getJobs, createJobHandler, updateJobHandler, deleteJobHandler} from "../controllers/jobs.controllers.js";
import express from "express";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/", getJobs);

router.post(
  "/",
  verifyToken,
  roleMiddleware(["recruiter"]),
  createJobHandler
);

router.get("/:id", getJobHandler);

router.put(
  "/:id",
  verifyToken,
  roleMiddleware(["recruiter"]),
  updateJobHandler
);

router.delete(
  "/:id",
  verifyToken,
  roleMiddleware(["recruiter"]),
  deleteJobHandler
);

export default router;