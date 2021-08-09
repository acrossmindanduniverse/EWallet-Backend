const Sequelize = require('sequelize')
const UserModel = require('./user')
const { database } = require('../config/sequelize')

const History = database.define('history', {
  refNo: Sequelize.STRING,
  receiver: Sequelize.STRING,
  sender: Sequelize.STRING,
  balance: Sequelize.INTEGER,
  message: Sequelize.STRING,
  description: Sequelize.STRING
})

History.belongsTo(UserModel, { foreignKey: 'receiver', sourceKey: 'id' })

module.exports = History
