const express = require('express')
const router = express.Router()
const controller = require('../controllers/sessionController')
const middleware = require('../middleware/sessionMiddle')

router.post('/createUser', middleware.checkPassword, controller.register)
router.get('/checkLogin/:name', middleware.checkAuth, controller.checkLogin)
router.get('/getBook',middleware.checkAuth, controller.showAvailableBook)
router.post('/reserveBook',middleware.checkAuth, controller.reserveBook)
router.post('/giveBack', middleware.checkAuth,controller.giveBack)
router.get('/checkReservedBook/:name', middleware.checkAuth, controller.checkReservedBook)
router.post('/msg', controller.msg)
router.post('/deleteMsg', middleware.notificationStatus, controller.deleteMsg)
router.post('/findUser', controller.findUser)



module.exports = router