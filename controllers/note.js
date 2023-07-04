const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')


notesRouter.get('/info', (request, response) => {
    Note.find({}).then(result => {
        response.send(`<p> Hello World! </p> <p> ${result.length} notes available </p> `)        
    })
})


notesRouter.get('/', async (request, response) => {
    console.log('user: ')
    console.log(request.user)
    const notes = await Note.find({'user': request.user}).populate('user')
    response.json(notes)
})


notesRouter.get('/:id', async (request, response, next) => {
    const id = request.params.id

    const note = await Note.findById(id).catch(error => next(error))
    
    if(note) {
        response.json(note)
    } else {
        response.status(404).end()
    }

})


notesRouter.post('/', async (request, response) => {
    const body = request.body

    if(!request.token){
        return response.status(401).json({error: 'no token found'})
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!decodedToken.id) {
        return response.status(401).json({error: 'token invalid'})
    }

    const user = request.user

    const note = new Note({
        title: body.title,
        content: body.content,
        date_created: body.date_created,
        user: user._id
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(201).json(note)
})


notesRouter.delete('/:id', async (request, response, next) => {
    const id = request.params.id

    console.log("id: ")
    console.log(id)

    if(!request.token) {
        return response.status(401).json({error: 'no token found'})
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    const note = await Note.findById(id)

    if(!decodedToken.id){
        return response.status(401).json({error: 'invalid token'})
    }

    if (decodedToken.id.toString() === note.user.toString()) {
        const result = await Note.findByIdAndDelete(id).catch(error => next(error))
        console.log('does this even work')

        const user = request.user
        console.log(user)
        console.log(user.notes)
        user.notes = user.notes.filter(note => note.id.toString() !== id)
        await user.save()

        response.status(204).end()
    } else {
        return response.status(401).json({error: "incorrect token"})
    }

})


notesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const newNote = {
        title: body.title,
        content: body.content,
        date_created: body.date_created
    }

    Note.findByIdAndUpdate(request.params.id, newNote, { new: true})
        .then(result => {
            response.json(newNote)
        })
        .catch(error => next(error))
})


module.exports = notesRouter