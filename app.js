const express = require('express')
const mongoose = require('mongoose')
const mainRouter = require('./routes/sessionRouter')
const app = express()
app.listen(3000)
const cors = require('cors')
app.use(express.json())
app.use(cors())

const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

// SESSIONS///////////////
const session = require('express-session')
const mongoDBSession = require('connect-mongodb-session')(session)


require('dotenv').config()

mongoose.connect(process.env.MONGO_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
        console.log('connection successful')
    }).catch(e => {
    console.log(e)
    console.log('error while connection to db')
})
const store = new mongoDBSession(({
    uri: process.env.MONGO_KEY,
    collection: "mySessions"
}))

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: store
}))
app.use(['/'], mainRouter)
