const Sequelize = require('sequelize')
const { database } = require('../config/sequelize')

const TransferCategory = database.define('transfer-categories', {
  name: Sequelize.STRING
})

module.exports = TransferCategory
