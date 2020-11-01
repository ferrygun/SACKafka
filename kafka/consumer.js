const { Kafka } = require('kafkajs')
 
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})
 
const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'test-group' })
 
let topic = 'SACTopic'

const listenMessage = async () => {
    // Consuming
    await consumer.connect()
    await consumer.subscribe({
        topic: topic,
        fromBeginning: false
    })

    await consumer.run({
        eachMessage: async ({
            topic,
            partition,
            message
        }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
            })
        }
    })
}

listenMessage().catch(console.error)
