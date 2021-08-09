const { response } = require('../helpers')
const Detail = require('../models/productDetail')
const ProductDetail = require('../models/productDetail')

module.exports = {

  createProductDetail: async (req, res) => {
    const setData = req.body
    try {
      const result = await Detail.create(setData)
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  },

  getAllItemVariants: async (req, res) => {
    const { id } = req.params
    try {
      const result = await ProductDetail.findAll({ where: { itemId: id } })
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  }

}
