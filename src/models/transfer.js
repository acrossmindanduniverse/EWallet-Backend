const Sequelize = require('sequelize')
const { database } = require('../config/sequelize')
const UserModel = require('./user')

const Transfer = database.define('transfer', {
  phone: Sequelize.STRING,
  receiverId: Sequelize.STRING,
  userId: Sequelize.STRING,
  deductedBalance: Sequelize.INTEGER,
  message: Sequelize.STRING
})
Transfer.belongsTo(UserModel, { foreignKey: 'userId', sourceKey: 'id' })

module.exports = Transfer
