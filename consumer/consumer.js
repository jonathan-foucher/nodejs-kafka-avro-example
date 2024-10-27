import kafkajs from 'kafkajs'
const { CompressionTypes, CompressionCodecs, Kafka } = kafkajs
import ZstdCodec from '@kafkajs/zstd'
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry'

CompressionCodecs[CompressionTypes.ZSTD] = ZstdCodec()

const registry = new SchemaRegistry({ host: 'http://localhost:8181' })
const kafka = new Kafka({
  clientId: 'movie-consumer-app',
  brokers: [ 'localhost:9093' ]
})

const getValueToDisplay = (data) => {
  return data ? JSON.stringify({
    id: data.id,
    title: data.title,
    release_date: new Date(data.release_date * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }) : null
}

async function startConsumer() {
  const consumer = kafka.consumer({ groupId: 'movie-nodejs-consumer' })
  await consumer.connect()
  await consumer.subscribe({ topic: 'kafka_example_movie_avro', fromBeginning: true })

  await consumer.run({
    eachMessage: async({ message }) => {
      const decodedKey = await registry.decode(message.key)
      const decodedValue = message.value ? await registry.decode(message.value) : null
      console.info(`Received record: key ${decodedKey} and value ${getValueToDisplay(decodedValue)}`)
    }
  })
}

export { startConsumer }
