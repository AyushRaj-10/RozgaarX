import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { SERVICES } from "../config/index.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * PUBLIC ROUTES
 * No token required
 */
router.use(
  "/auth",
  createProxyMiddleware({
    target: SERVICES.AUTH,
    changeOrigin: true,
    pathRewrite: { "": "/api/v1/auth" },
  })
);

/**
 * PROTECTED ROUTES
 * Token required
 */

router.use(
  "/users",
  verifyToken,
  createProxyMiddleware({
    target: SERVICES.USER,
    changeOrigin: true,
    pathRewrite: { "": "/api/v1/user" },

    onProxyReq: (proxyReq, req) => {
      proxyReq.setHeader("Authorization", req.headers.authorization);
    },
  })
);

router.use(
  "/jobs",
  verifyToken,
  createProxyMiddleware({
    target: SERVICES.JOBS,
    changeOrigin: true,
    pathRewrite: { "": "/api/v1/jobs" },
  })
);

router.use(
  "/applications",
  verifyToken,
  createProxyMiddleware({
    target: SERVICES.APPLICATION,
    changeOrigin: true,
    pathRewrite: { "": "/api/v1/applications" },
  })
);

export default router;