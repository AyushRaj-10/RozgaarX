import {Kafka} from 'kafkajs'

const kafka = new Kafka({
    clientId : "jobs",
    brokers : ["localhost:9092"]
})

export default kafka;