import kafka from "./kafkaClient.js";

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "application-service-group" });

export const connectProducer = async() => {
    try {
        await producer.connect();
        console.log("Kafka producer connected");
    } catch (error) {
        console.error("Error connecting Kafka producer:", error);
    }
}

export const connectConsumer = async() => {
    try {
        await consumer.connect();
        console.log("Kafka consumer connected");
    } catch (error) {
        console.error("Error connecting Kafka consumer:", error);
    }
}   

export const startConsumer = async () => {
  await consumer.subscribe({ topic: "application.created" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Received event:");
      console.log(JSON.parse(message.value.toString()));
    },
  });
};  

startConsumer();
