import {Kafka} from 'kafkajs';

const kafka = new Kafka({
    clientId : "application-service",
    brokers : [process.env.KAFKA_BROKER || "localhost:9092"]
})

export default kafka;