const express = require('express')

const app = express()
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



let notes = [
    {
        title: "New Note",
        content: "What's up?",
        id: 1
    },
    {
        title: "New Note 2",
        content: "The quick brown fox jumped over the lazy dog",
        id: 2
    }
]


app.get('/', (request, response) => {
    response.send(`<p> Hello World! </p> <p> ${notes.length} notes available </p> `)
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id == id)

    if(note){
        response.json(note)
    } else {
        response.send({error: "no note found. check id"})
    }
})

app.post('/api/notes', (request, response) => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0 

    const note = {...request.body, id: maxId + 1}
    notes = notes.concat(note)

    console.log(note)
    //console.log(notes)

    response.json(note)
})


app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id != id)

    console.log('deleted this mf')
    response.status(204).end()
})


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} hello da warudo`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: "unknown endpoint"})
}

app.use(unknownEndpoint)