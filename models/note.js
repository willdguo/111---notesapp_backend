const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log("connecting to mongoDB")

mongoose.connect(url)
    .then(result => {
        console.log('connected to mongoDB')
    })
    .catch((error) => {
        console.log('error connecting to mongoDB')
    })


const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)

