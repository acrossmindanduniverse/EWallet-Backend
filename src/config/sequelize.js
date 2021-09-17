const Sequelize = require('sequelize')

const {
  DB_HOST_DEV,
  DB_NAME_DEV,
  DB_USER_DEV,
  DB_PASSWORD_DEV,
  JWT_SECRET_KEY_DEV,
  JWT_REFRESH_SECRET_DEV
} = process.env

// const {
//   DB_HOST,
//   DB_NAME,
//   DB_USER,
//   DB_PASSWORD,
//   JWT_SECRET_KEY,
//   JWT_REFRESH_SECRET
// } = process.env

const sequelize = {
  database: new Sequelize(DB_NAME_DEV, DB_USER_DEV, DB_PASSWORD_DEV, {
    host: DB_HOST_DEV,
    dialect: 'mysql'
  }),
  JWT: {
    secretKey: JWT_SECRET_KEY_DEV,
    refreshSecretKey: JWT_REFRESH_SECRET_DEV
  }
}

module.exports = sequelize
