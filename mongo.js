const mongoose = require('mongoose')

const url = 
    `mongodb+srv://willdguo-notesapp:<password>@cluster0.5qtlnin.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.conect(url)