const { response } = require('../helpers')
const UserModel = require('../models/user')
const History = require('../models/history')
const { Op, Sequelize } = require('sequelize')
const bcrypt = require('bcrypt')
const path = './assets/pictures'
const fs = require('fs')
const { APP_UPLOAD_ROUTE, APP_URL } = process.env

module.exports = {

  getUserData: async (req, res) => {
    const data = req.authUser.result[0]
    console.log(req.authUser)
    try {
      const result = await UserModel.findByPk(data.id)
      const getResult = result.dataValues
      console.log(getResult)
      const newResult = {
        id: getResult.id, email: getResult.email, balance: getResult.balance, name: getResult.name, picture: getResult.picture, phone: getResult.phone, createdAt: getResult.createdAt, updatedAt: getResult.updatedAt
      }
      return response(res, true, newResult, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  },

  editProfile: async (req, res) => {
    const data = req.authUser.result[0]
    const setData = req.body
    try {
      const getUser = await UserModel.findByPk(data.id)
      if (req.file) {
        setData.picture = `${APP_UPLOAD_ROUTE}/${req.file.filename}`
      } else {
        setData.picture = getUser.dataValues.picture
      }
      if (req.file !== undefined && getUser.dataValues.picture !== null) {
        const slicePicture = getUser.dataValues.picture.slice('7')
        fs.unlinkSync(`${path}${slicePicture}`, (err, newData) => {
          if (!err) return response(res, true, newData, 200)
        })
      }
      const result = await UserModel.update(setData, { where: { id: getUser.dataValues.id } })
      console.log(result.length)
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  },

  confirmPassword: async (req, res) => {
    const data = req.authUser.result[0]
    const { password } = req.body
    try {
      console.log(req.authUser.result[0], 'result')
      const compare = await bcrypt.compare(password, data.password)
      if (!compare) return response(res, false, 'Incorrect password', 400)
      return response(res, true, compare, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  },

  updatePassword: async (req, res) => {
    const { id } = req.authUser.result[0]
    const { password, resendPassword } = req.body
    try {
      if (password.length < 8) return response(res, false, 'Password must be 8 or greater characters long', 400)
      if (resendPassword !== password) return response(res, false, 'Password did not match', 400)
      const result = await UserModel.update(password, { where: { id: id } })
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  },

  getUserByPhoneNumber: async (req, res) => {
    const setData = req.query
    setData.search = setData.search || ''
    console.log(setData, 'test123')
    try {
      const result = await UserModel.findOne({
        where: {
          phone: {
            [Op.like]: `${setData.search}`
          }
        }
      })
      if (result === null) {
        return response(res, false, 'User not found', 404)
      }
      const newResult = {
        email: result.dataValues.email,
        balance: result.dataValues.balance,
        name: result.dataValues.name,
        picture: result.dataValues.picture,
        phone: result.dataValues.phone
      }
      console.log(result, 'test length')
      return response(res, true, newResult, 200)
    } catch (err) {
      console.log(err, 'error')
      return response(res, false, 'An error occured', 500)
    }
  },

  getHistory: async (req, res) => {
    const data = req.authUser.result[0]
    const cond = req.query
    cond.search = cond.search || ''
    cond.sort = cond.sort || {}
    cond.sort.createdAt = cond.sort.createdAt || 'asc'
    cond.limit = parseInt(cond.limit) || 10
    cond.offset = parseInt(cond.offset) || 0
    cond.page = parseInt(cond.page) || 1
    cond.offset = (cond.page * cond.limit) - cond.limit
    const pageInfo = {}

    try {
      // const getUser = await History.findAll({ where: { receiver: data.id } })
      // const splitHistory = cond.sort.split(8)
      const result = await History.findAndCountAll({
        where: {
          receiver: data.id,
          [Op.and]: {
            sender: {
              [Op.like]: `%${cond.search}%`
            }
          }
        },
        limit: cond.limit,
        // order: [cond.sort.createdAt],
        order: Sequelize.literal(`createdAt ${cond.sort.createdAt}`),
        offset: cond.offset
      }, cond)
      // const getCount = await History.findAndCountAll(cond)
      const totalData = result
      const totalPage = Math.ceil(totalData.count / cond.limit)
      pageInfo.totalData = totalData
      pageInfo.currentPage = cond.page
      pageInfo.totalPage = totalPage
      pageInfo.limitData = cond.limit
      pageInfo.nextPage = cond.page < totalPage ? `${APP_URL}/user/history?page=${cond.page + 1}` : null
      pageInfo.prevPage = cond.page <= totalPage || cond.page === 1 ? `${APP_URL}/user/history?page=${cond.page - 1}` : null
      if (pageInfo.prevPage === `${APP_URL}/user/history?page=0`) pageInfo.prevPage = null
      if (result.length === 0) return response(res, false, 'there is no item anymore', 200)
      const cleanResult = result.rows.map(e => e.dataValues)
      console.log(cleanResult, 'data 123')
      return response(res, true, cleanResult, 200, pageInfo)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  },

  getHistoryById: async (req, res) => {
    const { id } = req.params
    try {
      const result = await History.findByPk(id)
      return response(res, true, result, 200)
    } catch (err) {
      return response(res, false, 'An error occured', 500)
    }
  }

}
