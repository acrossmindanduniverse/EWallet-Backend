const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(process.cwd(), 'assets', 'pictures'))
  },
  filename: function (_req, file, cb) {
    console.log(file, 'test')
    const ext = file.originalname.split('.')[1]
    const date = new Date()
    cb(null, `${date.getTime()}.${ext}`)
  }
})

module.exports = storage
