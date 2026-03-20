export const SERVICES = {
  AUTH: process.env.AUTH_SERVICE_URL || "http://localhost:8080",
  USER: process.env.USER_SERVICE_URL || "http://localhost:8081",
  JOBS: process.env.JOBS_SERVICE_URL || "http://localhost:8082",
  APPLICATION: process.env.APPLICATION_SERVICE_URL || "http://localhost:8083",
  NOTIFICATION : process.env.NOTIFICATION_SERVICE_URL || "http://localhost:8085",
};