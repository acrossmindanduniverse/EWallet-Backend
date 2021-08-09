const express = require('express')
const router = express.Router()
const detail = require('../controllers/productDetail')

router.post('/', detail.createProductDetail)
router.get('/product/:id', detail.getAllItemVariants)

module.exports = router
