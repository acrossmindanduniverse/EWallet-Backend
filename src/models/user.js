const Sequelize = require('sequelize')
const { database } = require('../config/sequelize')

const User = database.define('users', {
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  balance: Sequelize.INTEGER,
  name: Sequelize.STRING,
  picture: Sequelize.STRING,
  phone: Sequelize.STRING
})

module.exports = User
