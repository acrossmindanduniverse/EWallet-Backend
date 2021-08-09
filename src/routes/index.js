const express = require('express')
const router = express.Router()

const auth = require('./auth')
const privacy = require('./private')
const product = require('./product')
const detail = require('./productDetail')
const user = require('./user')

// prefix
router.use('/auth', auth)
router.use('/private', privacy)
router.use('/product', product)
router.use('/detail', detail)
router.use('/user', user)

module.exports = router
