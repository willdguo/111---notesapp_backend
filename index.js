require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')

app.use(express.json())

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)


app.get('/', (request, response) => {
    Note.find({}).then(result => {
        response.send(`<p> Hello World! </p> <p> ${result.length} notes available </p> `)        
    })
})

app.get('/api/notes', (request, response) => {

    Note.find({}).then(notes => {
        response.json(notes)
    })

})

app.get('/api/notes/:id', (request, response, next) => {
    const id = request.params.id

    Note.findById(id)
        .then(note => {
            if(note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        }).catch(error => next(error))

})


app.post('/api/notes', (request, response) => {
    const body = request.body

    const note = new Note({
        title: body.title,
        content: body.content
    })

    note.save().then(savedNote => {
        response.json(note)
    })

})


app.delete('/api/notes/:id', (request, response, next) => {
    const id = request.params.id

    console.log("id: ")
    console.log(id)

    Note.findByIdAndDelete(id)
        .then(result => {
            console.log('deleted this mf')
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })

})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const newNote = {
        title: body.title,
        content: body.content
    }

    Note.findByIdAndUpdate(request.params.id, newNote, { new: true})
        .then(result => {
            response.json(newNote)
        })
        .catch(error => next(error))
})


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} hello da warudo`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: "unknown endpoint"})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}

app.use(errorHandler)