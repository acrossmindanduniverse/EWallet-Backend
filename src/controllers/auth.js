const { response } = require('../helpers')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')
const { JWT } = require('../config/sequelize')
const createToken = require('../helpers/createToken')
const FCMToken = require('../models/fcmToken')
// const { APP_KEY } = process.env

module.exports = {

  signUp: async (req, res) => {
    const setData = req.body
    setData.password = await bcrypt.hash(setData.password, await bcrypt.genSalt())
    try {
      if (setData.password.length < 8) return response(res, false, 'Password must be 8 or greater characters long', 400)
      const result = await UserModel.create(setData)
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'an error occured', 500)
    }
  },

  signIn: async (req, res) => {
    const { email, password } = req.body
    try {
      const result = await UserModel.findOrCreate({
        where: { email }
      })
      const user = result[0]
      const compare = await bcrypt.compare(password, user.password)
      if (compare) {
        const token = jwt.sign({ ...result }, JWT.secretKey, {
          expiresIn: '1m'
        })
        const refreshToken = jwt.sign({ ...result }, JWT.refreshSecretKey, {
          expiresIn: '1h'
        })
        result.data = { refreshToken, token, id: user.id, phone: user.phone, email: user.email, picture: user.picture, name: user.name, balance: user.balance }
        console.log(typeof result.data, 'result length')
        return response(res, true, result.data, 200)
      }
    } catch (err) {
      return response(res, false, 'Email or password did not match to the record', 400)
    }
  },

  refreshToken: async (req, res) => {
    const refreshToken = req.body.refreshToken
    console.log(req.headers)
    console.log(req.body)
    try {
      const payload = jwt.verify(refreshToken, JWT.refreshSecretKey)
      const token = createToken(
        { ...payload },
        JWT.secretKey,
        '24h'
      )
      const result = {
        token: token
      }
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  },

  registerFCMToken: async (req, res) => {
    const { token } = req.body
    const { id } = req.authUser.result[0]
    console.log(req.headers)
    console.log(req.body)
    try {
      const [result, created] = await FCMToken.findOrCreate({
        where: { token },
        defaults: {
          userId: id
        }
      })
      if (!created) {
        result.dataValues.userId = id
        await result.save()
      }
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  }

}
