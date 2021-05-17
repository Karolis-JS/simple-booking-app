module.exports = {
    checkPassword: (req, res, next) => {
        if (req.body.pass1 === req.body.pass2){
            next()
        } else {
            res.send({error: true, msg: "Password not matches"})
        }
    },
    checkAuth: (req, res, next) => {
        req.session.auth ? next() : res.send({msg: "authentication false", auth: false})
    },
    notificationStatus: (req, res, next) => {
        req.body.viewed ? next() : res.send({msg: 'pranesimas vis dar false'})
    },
}