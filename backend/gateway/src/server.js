import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import proxyRoutes from "./routes/proxyRoutes.js";

dotenv.config();

const app = express();

/**
 * Security Middlewares
 */
app.use(helmet());
app.use(cors());

app.use("/", proxyRoutes);

/**
 * Logging
 */
app.use(morgan("dev"));

/**
 * Rate Limiting
 * Max 100 requests per 15 minutes per IP
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

app.use(limiter);

const PORT = process.env.PORT || 8084;

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});