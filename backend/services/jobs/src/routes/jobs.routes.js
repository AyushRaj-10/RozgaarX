import { getJobHandler, getJobs, createJobHandler, updateJobHandler, deleteJobHandler} from "../controllers/jobs.controllers.js";
import express from "express";

const router = express.Router();

router.get("/", getJobs);
router.post("/", createJobHandler);
router.get("/:id", getJobHandler);
router.put("/:id", updateJobHandler);
router.delete("/:id", deleteJobHandler);

export default router;