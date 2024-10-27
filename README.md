## Introduction
This project is an example of Kafka producing/consuming with Node.js and Avro format using a schema registry.

The repository contains two node projects :
- a kafka producer fed by a controller (REST API)
- a kafka consumer that displays the received records in the logs

## Run the project
### Kafka environment
To deploy the kafka required environment you will need docker installed and run the `docker/docker-compose.yml` file.

It will launch different containers:
- zookeeper
- kafka
- schema-registry
- akhq: a browser GUI to check out topics, messages and schemas
- init-kafka: init container to create the required Kafka topic and schemas


```
docker-compose -f docker/docker-compose.yml up -d
```

You will be able to access akhq on [this url](http://localhost:8190/)

### Application
Once the Kafka environment started and healthy, you can install the dependencies, start the node projects and try them out.

#### Consumer
Install the dependencies (inside the consumer directory)
```
npm i
```

Start the consumer
```
node consumer/main.js
```

#### Producer
Install the dependencies (inside the producer directory)
```
npm i
```

Start the producer
```
node producer/main.js
```

Save a movie
```
curl --request POST \
  --url http://localhost:8080/kafka-producer/movies \
  --header 'Content-Type: application/json' \
  --data '{
	"id": 26,
	"title": "Some movie title",
	"release_date": "2022-02-26"
}'
```

Delete a movie
```
curl --request DELETE \
  --url http://localhost:8080/kafka-producer/movies/26
```
