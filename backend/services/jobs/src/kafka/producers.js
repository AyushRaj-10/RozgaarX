import kafka from "./kafkaClient.js";

export const producer = kafka.producer();

export const consumer = kafka.consumer({groupId : "jobs-group"});

export const connectProducer = async() => {
    try {
        await producer.connect();
        console.log("Kafka producer Connected")
    } catch (error) {
        console.error("Error connecting to Kafka producer:", error)
    }
}

export const connectConsumer = async() => {
    try {
        await consumer.connect();
        console.log('Kafka consumer connected');
    } catch (error) {
        console.error("Error connecting to Kafka consumer:", error)
    }
}
