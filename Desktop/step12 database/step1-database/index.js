require('dotenv').config()
const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')
const http = require('http')
const Note = require('./models/note')

app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'notes-frontend', 'build')))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// GET all notes
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// GET a single note by id
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.error(error)
      response.status(400).json({ error: 'malformatted id' })
    })
})

// DELETE a note by id
app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      console.error(error)
      response.status(400).json({ error: 'malformatted id' })
    })
})

// POST a new note
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important ?? false,
  })

  note.save().then(savedNote => {
    response.status(201).json(savedNote)
  })
})

// PUT (update) a note by id
app.put('/api/notes/:id', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const updatedNote = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(
    request.params.id,
    updatedNote,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(result => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.error(error)
      response.status(400).json({ error: 'malformatted id' })
    })
})

// Fallback: serve frontend for any unmatched route
app.use((request, response) => {
  response.sendFile(path.join(__dirname, '..', 'notes-frontend', 'build', 'index.html'))
})

const PORT = process.env.PORT || 3001
const server = http.createServer({ maxHeaderSize: 64 * 1024 }, app)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})