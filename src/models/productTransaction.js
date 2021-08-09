const Sequelize = require('sequelize')
const { database } = require('../config/sequelize')

const ProductTransaction = database.define('product_transactions', {
  name: Sequelize.STRING,
  price: Sequelize.INTEGER,
  itemId: Sequelize.STRING,
  transactionId: Sequelize.STRING
})

module.exports = ProductTransaction
