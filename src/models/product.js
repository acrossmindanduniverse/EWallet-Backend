const Sequelize = require('sequelize')
const { database } = require('../config/sequelize')

const Product = database.define('products', {
  name: Sequelize.STRING,
  description: Sequelize.STRING
})

module.exports = Product
