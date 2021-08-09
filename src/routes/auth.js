const express = require('express')
const auth = require('../controllers/auth')
const authMiddleware = require('../middlewares/auth')
const router = express.Router()

router.post('/sign-up', auth.signUp)
router.post('/sign-in', auth.signIn)
router.post('/refresh-token', auth.refreshToken)
router.post('/register-token', authMiddleware.verifyJwt, auth.registerFCMToken)

module.exports = router
