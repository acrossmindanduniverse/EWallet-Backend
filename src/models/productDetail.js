const Sequelize = require('sequelize')
const { database } = require('../config/sequelize')

const ProductDetail = database.define('product_detail', {
  itemId: Sequelize.STRING,
  variant: Sequelize.STRING,
  price: Sequelize.INTEGER
})

module.exports = ProductDetail
