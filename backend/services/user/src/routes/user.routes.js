import { createUser, getUserProfile , updateUser , deleteUser  } from "../controllers/user.controllers.js";
import express from "express";

const router = express.Router();

router.post("/", createUser);
router.get("/:auth_id", getUserProfile);
router.put("/:auth_id", updateUser);
router.delete("/:auth_id", deleteUser);


export default router;