import kafkajs from 'kafkajs'
const { CompressionTypes, CompressionCodecs, Kafka } = kafkajs
import ZstdCodec from '@kafkajs/zstd'
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry'

CompressionCodecs[CompressionTypes.ZSTD] = ZstdCodec()

const registry = new SchemaRegistry({ host: 'http://localhost:8181' })

const keySchemaId = await registry.getRegistryId('kafka_example_movie_avro-key', 1)
const valueSchemaId = await registry.getRegistryId('kafka_example_movie_avro-value', 1)

const kafka = new Kafka({
  clientId: 'movie-producer-app',
  brokers: [ 'localhost:9093' ]
})

// silence kafkajs no partitioner warning
process.env['KAFKAJS_NO_PARTITIONER_WARNING'] = 1
const producer = kafka.producer({ allowAutoTopicCreation: false })

const startProducer = async () => {
  await producer.connect()
}

const convertReleaseDateToEpochDays = (data) => {
  return {
    id: data.id,
    title: data.title,
    release_date: Math.trunc(new Date(data.release_date) / (24 * 60 * 60 * 1000))
  }
}

const sendMessage = async (id, data)  => {
  const encodedKey = await registry.encode(keySchemaId, { id })
  const encodedValue = data ? await registry.encode(
    valueSchemaId,
    convertReleaseDateToEpochDays(data)
  ) : null

  await producer.send({
    topic: 'kafka_example_movie_avro',
    messages: [
      {
        key: encodedKey,
        value: encodedValue
      }
    ],
  })
}

export { startProducer, sendMessage }
