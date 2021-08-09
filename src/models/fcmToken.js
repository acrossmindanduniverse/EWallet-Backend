const Sequelize = require('sequelize')
const { database } = require('../config/sequelize')
const UserModel = require('./user')

const FCMToken = database.define('fcm_token', {
  token: Sequelize.STRING,
  userId: Sequelize.STRING
})

FCMToken.belongsTo(UserModel, { foreignKey: 'userId', sourceKey: 'id' })
UserModel.hasOne(FCMToken)

module.exports = FCMToken
