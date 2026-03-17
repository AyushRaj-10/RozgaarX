import kafka from "./kafkaClient.js";
import { TOPICS } from "./topics.js";

import { handleUserCreated } from "../handler/userCreated.js";
import { handleJobCreated } from "../handler/jobCreated.js";
import { handleApplicationCreated } from "../handler/applicationCreated.js";

const consumer = kafka.consumer({ groupId: "notification-service-group" });

export const startConsumer = async () => {
    await consumer.connect();

    await consumer.subscribe({topic: TOPICS.USER_CREATED});
    await consumer.subscribe({topic: TOPICS.JOB_CREATED});
    await consumer.subscribe({topic: TOPICS.APPLICATION_CREATED});

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const data = JSON.parse(message.value.toString());
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
        }    
    })

}