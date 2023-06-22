const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    date_created: Date,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)

