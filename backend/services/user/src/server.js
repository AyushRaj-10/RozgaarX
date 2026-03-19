import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import { db } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";

const PORT = process.env.PORT || 8081;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", userRoutes);


// Test DB connection
db.query("SELECT NOW()")
.then(() => {
 console.log("Connected to database successfully ✅");
})
.catch((err) => {
 console.error("Error connecting to database ❌:", err);
});



app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});