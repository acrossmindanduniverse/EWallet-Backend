const { response } = require('../helpers')
const { codeTransaction } = require('../helpers/codeTransaction')
const FCMToken = require('../models/fcmToken')
const Transfer = require('../models/transfer')
const Transaction = require('../models/transaction')
const UserModel = require('../models/user')
const Product = require('../models/product')
const History = require('../models/history')
const ProductDetail = require('../models/productDetail')
const firebase = require('../helpers/firebase')
const { APP_TRANSACTION_PREFIX } = process.env

module.exports = {

  createTransaction: async (req, res) => {
    const setData = req.body
    try {
      const getItemById = await Product.findByPk(setData.item_id)
      const itemData = getItemById.dataValues
      const itemVariant = await ProductDetail.findByPk(setData.item_variant)
      const code = codeTransaction(APP_TRANSACTION_PREFIX, 1)
      const total = itemVariant.dataValues.price
      const itemName = itemData.name
      const { variant } = itemVariant.dataValues
      const { id } = req.authUser.result[0]
      const finalData = {
        refNo: code, deductedBalance: total, itemName: itemName, description: variant, userId: id
      }
      const result = await Transaction.create(finalData)
      const updateUserBalance = await UserModel.findByPk(id)
      if (total > updateUserBalance.balance) return response(res, false, 'you have to top up first', 400)
      updateUserBalance.set('balance', (updateUserBalance.balance - total))
      await updateUserBalance.save()
      const historyData = {
        refNo: code, receiver: id, sender: itemName, balance: `-${total}`, message: 'payment success', description: variant
      }
      await History.create(historyData, (err, data) => {
        if (err) return response(res, false, 'An error occured', 500)
        return response(res, true, data, 200)
      })
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  },

  detailTransaction: async (req, res) => {
    const { id } = req.authUser.result[0]
    console.log(req.authUser.result[0])
    try {
      const result = await Transaction.findAll({ where: { userId: id } })
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  },

  createTransfer: async (req, res) => {
    const setData = req.body
    const { id, email } = req.authUser.result[0]
    try {
      const findUser = await UserModel.findOne({
        where: { phone: setData.phone },
        include: FCMToken
      })
      if (setData.deductedBalance < 10000) return response(res, false, 'transfer minimum is Rp.10.000', 400)
      setData.receiverId = findUser.id
      setData.userId = req.authUser.result[0].id
      const code = codeTransaction('TF', 1)
      const result = await Transfer.create(setData)
      if (setData.receiverId === id) return response(res, false, 'Failed to make transaction', 400)
      const toInt = parseInt(result.dataValues.deductedBalance)
      const senderUpdatedData = await UserModel.findByPk(id)
      if (setData.deductedBalance > senderUpdatedData.dataValues.balance) return response(res, false, 'You have to top up first', 400)
      senderUpdatedData.set('balance', (senderUpdatedData.dataValues.balance - toInt))
      await senderUpdatedData.save()
      const receiverUpdateData = await UserModel.findByPk(findUser.id)
      receiverUpdateData.set('balance', (receiverUpdateData.dataValues.balance + toInt))
      await receiverUpdateData.save()
      const historyData = {
        refNo: code, receiver: findUser.id, sender: email, balance: `${toInt}}`, message: setData.message, description: 'success'
      }
      await History.create(historyData, (err, data) => {
        if (err) return response(res, false, 'An error occured', 500)
        return response(res, true, data, 200)
      })
      console.log(findUser.fcm_token.dataValues.token, 'test token')
      if (findUser?.fcm_token.dataValues.token !== undefined) {
        firebase.messaging.sendToDevice(findUser?.fcm_token.dataValues.token, {
          notification: {
            title: 'AVA',
            body: `${req.authUser.result[0].name} mengirimkan dana sebesar Rp${Number(setData.deductedBalance).toLocaleString('en')} melalui aplikasi AVA`
          }
        })
      }
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 400)
    }
  },

  detailTransfer: async (req, res) => {
    const { id } = req.authUser.result[0]
    try {
      const result = await Transfer.findAll({ where: { receiverId: id } })
      if (parseInt(result[0].dataValues.receiverId) !== id) return response(res, false, 'you do not have permission to access this source', 400)
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'no top up yet', 400)
    }
  },

  createTopUp: async (req, res) => {
    const { id } = req.authUser.result[0]
    const setData = req.body
    try {
      if (setData.balance < 10000) return response(res, false, 'Transfer minimum is Rp.10.000', 400)
      const result = await UserModel.findByPk(id)
      result.set('balance', (parseInt(parseInt(setData.balance) + parseInt(result.dataValues.balance))))
      await result.save()
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  }

}
