const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    inventory: [{
        type: String,
        required: true
    }],
    msg:[{
        type: String,
        required: false
    }]
})

const libraryUser = mongoose.model("libraryUserModel", userSchema)

module.exports = libraryUser