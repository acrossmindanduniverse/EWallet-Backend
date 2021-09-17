const express = require('express')
const user = require('../controllers/user')
const router = express.Router()
const upload = require('../middlewares/upload')
const auth = require('../middlewares/auth')

router.get('/', auth.verifyJwt, user.getUserData)
router.get('/phone', auth.verifyJwt, user.getUserByPhoneNumber)
router.get('/history', auth.verifyJwt, user.getHistory)
router.put('/edit-profile', auth.verifyJwt, upload, user.editProfile)
router.post('/confirm-password', auth.verifyJwt, user.confirmPassword)
router.put('/update-password', auth.verifyJwt, user.updatePassword)
router.put('/upload-photo', auth.verifyJwt, upload, user.uploadPhoto)
router.get('/history-detail/:id', auth.verifyJwt, user.getHistoryById)

module.exports = router
