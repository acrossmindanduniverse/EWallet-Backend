const Sequelize = require('sequelize')

const {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET
} = process.env

const sequelize = {
  database: new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
  }),
  JWT: {
    secretKey: JWT_SECRET_KEY,
    refreshSecretKey: JWT_REFRESH_SECRET
  }
}

module.exports = sequelize
