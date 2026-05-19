const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose') 
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const Note = require('./models/note')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'build')))

// GET all notes
app.get('/api/notes', (req, res, next) => {
  Note.find({})
    .then(notes => {
      res.json(notes)
    })
    .catch(error => next(error))
})


app.get('/info', (req, res, next) => {
  Note.countDocuments({})
    .then(count => {
      const date = new Date()

      res.send(`
        <p>Notes app has info for ${count} notes</p>
        <p>${date}</p>
      `)
    })
    .catch(error => next(error))
})

// GET one note
app.get('/api/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// ADD note
app.post('/api/notes', (req, res, next) => {
  const body = req.body

  const note = new Note({
    content: body.content,
    important: body.important ?? false,
  })

  note.save()
    .then(savedNote => {
      res.json(savedNote)
    })
    .catch(error => next(error))
})

// DELETE note
app.delete('/api/notes/:id', (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.put('/api/notes/:id', (req, res, next) => {
  const { content, important } = req.body

  const note = {
    content,
    important,
  }

  Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
})

// ERROR HANDLER (must be LAST)
app.use(middleware.errorHandler)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})