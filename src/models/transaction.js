const Sequelize = require('sequelize')
const { database } = require('../config/sequelize')
const UserModel = require('./user')

const Transaction = database.define('transaction', {
  userId: Sequelize.INTEGER,
  refNo: Sequelize.STRING,
  itemName: Sequelize.STRING,
  deductedBalance: Sequelize.INTEGER,
  description: Sequelize.STRING,
  trxFee: Sequelize.INTEGER
})
Transaction.belongsTo(UserModel, { foreignKey: 'userId', sourceKey: 'id', as: 'userDetail' })

module.exports = Transaction
