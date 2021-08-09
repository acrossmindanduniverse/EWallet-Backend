const { JWT } = require('../config/sequelize')
const { response } = require('../helpers')
const jwt = require('jsonwebtoken')

module.exports = {

  verifyJwt: (req, res, next) => {
    const headers = req.headers
    if (headers.authorization === undefined) {
      return response(res, false, 'Auth token needed', 400)
    }
    if (headers.authorization.startsWith('Bearer')) {
      try {
        const token = headers.authorization.slice(7)
        const user = jwt.verify(token, JWT.secretKey)
        req.authUser = user
        next()
      } catch (err) {
        console.log(err)
        return response(res, false, 'Session expired, you have to login first', 400)
      }
    } else {
      return response(res, false, 'Internal Server Error', 500)
    }
  }

}
