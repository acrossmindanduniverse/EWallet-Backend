const { response } = require('../helpers')
const Product = require('../models/product')

module.exports = {

  createProduct: async (req, res) => {
    const setData = req.body
    try {
      const result = await Product.create(setData)
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 400)
    }
  },

  getAllProduct: async (_req, res) => {
    try {
      const result = await Product.findAll()
      console.log(result)
      return response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  }

}
