const notesRouter = require('express').Router()
const Note = require('../models/note')


notesRouter.get('/info', (request, response) => {
    Note.find({}).then(result => {
        response.send(`<p> Hello World! </p> <p> ${result.length} notes available </p> `)        
    })
})


notesRouter.get('/', (request, response) => {

    Note.find({}).then(notes => {
        response.json(notes)
    })

})


notesRouter.get('/:id', (request, response, next) => {
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


notesRouter.post('/', (request, response) => {
    const body = request.body

    const note = new Note({
        title: body.title,
        content: body.content
    })

    note.save().then(savedNote => {
        response.json(note)
    })

})


notesRouter.delete('/:id', (request, response, next) => {
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


notesRouter.put('/:id', (request, response, next) => {
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


module.exports = notesRouter