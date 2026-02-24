import { register , login , logout , getProfile} from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/profile", verifyToken, getProfile);

export default router;