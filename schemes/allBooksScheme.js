const mongoose = require('mongoose')

const Schema = mongoose.Schema

const booksSchema = new Schema({
    book: {
        type: String,
        required: true
    }
})

const books = mongoose.model("booksModel", booksSchema)

module.exports = books