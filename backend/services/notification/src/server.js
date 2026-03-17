import express from 'express';
import { startConsumer } from "./kafka/consumer.js";


const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Notification Service is running');
});

await startConsumer();

app.listen(port, () => {
    console.log(`Notification Service is listening on port ${port}`);
});