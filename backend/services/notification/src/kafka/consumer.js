import kafka from "./kafkaClient.js";
import { TOPICS } from "./topics.js";

import { handleUserCreated } from "../handler/userCreated.js";
import { handleJobCreated } from "../handler/jobCreated.js";
import { handleApplicationCreated } from "../handler/applicationCreated.js";

const consumer = kafka.consumer({ groupId: "notification-service-group" });

let isConsumerRunning = false;

export const startConsumer = async () => {
  if (isConsumerRunning) {
    console.log("⚠️ Consumer already running, skipping...");
    return;
  }

  while (true) {
    try {
      console.log("⏳ Connecting to Kafka...");

      await consumer.connect();

      console.log("✅ Connected to Kafka");

      await consumer.subscribe({
        topic: TOPICS.USER_CREATED,
        fromBeginning: true,
      });

      await consumer.subscribe({ topic: TOPICS.JOB_CREATED });
      await consumer.subscribe({ topic: TOPICS.APPLICATION_CREATED });

      await consumer.run({
        eachMessage: async ({ topic, message }) => {
          const data = JSON.parse(message.value.toString());

          console.log("📩 Event received:", topic, data);

          switch (topic) {
            case TOPICS.USER_CREATED:
              await handleUserCreated(data);
              break;
            case TOPICS.JOB_CREATED:
              await handleJobCreated(data);
              break;
            case TOPICS.APPLICATION_CREATED:
              await handleApplicationCreated(data);
              break;
            default:
              console.warn(`No handler for topic: ${topic}`);
          }
        },
      });

      console.log("✅ Consumer running");
      isConsumerRunning = true;
      break;

    } catch (err) {
      console.error("❌ Kafka not ready, retrying in 3s...", err.message);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
};