import express from "express";
import { startConsumer } from "./kafka/consumer.js";

const app = express();
const port = process.env.PORT || 8085;

app.get("/", (req, res) => {
  res.send("Notification Service is running");
});

app.listen(port, async () => {
  console.log(`Notification Service is listening on port ${port}`);

  try {
    await startConsumer(); 
  } catch (err) {
    console.error("❌ Failed to start consumer:", err);
  }
});