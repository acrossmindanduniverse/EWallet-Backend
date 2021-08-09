const express = require('express')
const router = express.Router()
const product = require('../controllers/product')
// const auth = require('../middlewares/auth')

router.post('/', product.createProduct)
router.get('/', product.getAllProduct)

module.exports = router
