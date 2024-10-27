import express from 'express'
import { startProducer, sendMessage } from './producer.js'

const app = express()
app.use(express.json()) 
app.listen(8080)

startProducer().catch(console.error)

app.post('/kafka-producer/movies', (req, res) => {
    sendMessage(req.body.id, req.body)
    res.end()
  })
  .delete('/kafka-producer/movies/:movieId', (req, res) => {
    const id = parseInt(req.params.movieId)
    sendMessage(id, null)
    res.end()
  })
