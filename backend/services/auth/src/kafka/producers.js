import { kafka } from './kafkaClient.js'

const consumer = kafka.consumer({ groupId : "auth-group"});

export const startConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({topic: "user.created"});

    await consumer.run({
        eachMessage: async ({message}) => {
            console.log("Event :", message.value.toString());
        }
    })
}

export const producer = kafka.producer();

export const connectProducer = async () => {
    try {
        await producer.connect();   
        console.log("Kafka Producer connected")
    } catch (error) {
        console.error("Kafka Producer connection error:", error);
    }
}