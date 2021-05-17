const libraryUserDb = require('../schemes/registrationScheme')
const booksDB = require('../schemes/allBooksScheme')
const bcrypt = require('bcrypt')

module.exports = {
    register: async (req, res) => {
        let userName = await libraryUserDb.find({name: req.body.name})
        if (userName.length < 1){
            req.session.auth = true
            let user = new libraryUserDb
            user.name = req.body.name
            user.password = await bcrypt.hash(req.body.pass1, 10)
            user.inventory = "null"
            user.msg = ""
            user.save().then(() => {
                res.send({error: false, auth: req.session.auth, user})
            })
        } else {
            req.session.auth = false
            res.send({error: true, msg: 'User already exists'})
        }
    },
    checkLogin: async (req, res) => {
        console.log(req.params.name)
        let user =  await libraryUserDb.find({name: req.params.name})
        res.send({msg: "login successfully", auth: req.session.auth, user})

    },
    showAvailableBook: async (req,res) => {
        let book = await booksDB.find()
        let allUser = await libraryUserDb.find()

        res.send({book, allUser, auth: true})
    },
    reserveBook: async (req, res) => {
        console.log(req.body)
        await libraryUserDb.findByIdAndUpdate({_id: req.body.userId},
            {$push: { inventory: req.body.bookImg}
            },
            {returnOriginal: false})
            // .then(() => {
            //     res.send({error: false, msg: "book add successful"})
            // }).catch(e => {
            //     res.send({error: true, msg: "Wrong data", e})
            // })
        await booksDB.findByIdAndDelete({_id: req.body.bookId})

        res.send({error: false, msg: "book add successful"})
    },
    giveBack: async (req, res) => {
        console.log(req.body)
        let book = new booksDB
        book.book = req.body.bookImg
        await book.save()
            // .then(() => {
            //     res.send({error: false})
            // }).catch(res.send({msg: 'Kazkas blogai'}))

        await libraryUserDb.findByIdAndUpdate({_id: req.body.userId},
            {$pull: { inventory: req.body.bookImg}
            },
            {returnOriginal: false})
            // .then(() => {
            //     res.send({error: false, msg: "book add successful"})
            // }).catch(e => {
            //     res.send({error: true, msg: "Wrong data",e})
            // })
        res.send({error: false, msg: "book add successful"})
    },
    checkReservedBook: async (req, res) => {
        let user =  await libraryUserDb.find({name: req.params.name})
        res.send({msg: "users books", auth: req.session.auth, user})
    },
    msg: async (req, res) => {
        console.log(req.body)
        await libraryUserDb.findOneAndUpdate({name: req.body.userName},
            {
                $push: {msg: req.body.msgToUser}
            },
            {returnOriginal: false})
            .then(() => {
                res.send({error: false, msg: "msg update successful"})
            }).catch(e => {
                res.send({error: true, msg: "Wrong data", e})
            })
    },
    deleteMsg: async (req, res) => {
        await libraryUserDb.findOneAndUpdate({name: req.body.userName},
            {$set: {msg: ''}},
            {returnOriginal: false})
            .then(() => {
                res.send({error: false, msg: "Msg delete successful"})
            }).catch(e => {
                console.log(e)
                res.send({error: true, msg: "something wrong", e})
            })
    },
    findUser: async (req, res) => {
       let user = await libraryUserDb.findOne({_id: req.body.userId})
        res.send(user)
    },
}

