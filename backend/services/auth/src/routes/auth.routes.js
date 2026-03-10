import { register , login , logout , getProfile} from "../controllers/auth.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import express from "express";
import { rateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", rateLimiter , register);
router.post("/login", rateLimiter , login);
router.post("/logout", verifyToken, logout);
router.get("/profile", verifyToken, rateLimiter , getProfile);

export default router;