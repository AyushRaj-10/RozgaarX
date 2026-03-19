import express from 'express';
import { startConsumer } from "./kafka/consumer.js";

const app = express();
const port = process.env.PORT || 8085;

app.get('/', (req, res) => {
    res.send('Notification Service is running');
});

app.listen(port, async () => {
    console.log(`Notification Service is listening on port ${port}`);

    try {
        await startConsumer();
        console.log("✅ Kafka Consumer started successfully");
    } catch (error) {
        console.error("❌ Failed to start Kafka Consumer:", error);
    }
});