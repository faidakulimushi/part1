require('dotenv').config()

const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
  response.send('Phonebook backend is running')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(next)
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(next)
})

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  // Mongo connection issues are returned as a service error instead of crashing the process.
  if (error.name === 'MongooseError' || error.name === 'MongoServerError') {
    return response.status(503).json({ error: 'Database is unavailable' })
  }

  console.error(error.message)
  return response.status(500).json({ error: 'Internal server error' })
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})