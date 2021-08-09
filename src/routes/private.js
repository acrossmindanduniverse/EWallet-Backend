const express = require('express')
const transaction = require('../controllers/private')
const auth = require('../middlewares/auth')
const router = express.Router()

// prefix

router.post('/transaction', auth.verifyJwt, transaction.createTransaction)
router.post('/transfer', auth.verifyJwt, transaction.createTransfer)
// router.get('/receive-transfer-history', auth.verifyJwt, transaction.detailTransfer)
// router.get('/history', auth.verifyJwt, transaction.detailTransaction)
router.patch('/top-up', auth.verifyJwt, transaction.createTopUp)
module.exports = router
