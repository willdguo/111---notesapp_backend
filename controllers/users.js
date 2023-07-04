const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('notes')

    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const {username, password} = request.body

    if(username.length >= 3 && password.length >= 8){
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            passwordHash
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } else {
        return response.status(401).send({error: 'Password must be >=8 characters & Username must be >=3 characters'})
    }
})

module.exports = usersRouter
