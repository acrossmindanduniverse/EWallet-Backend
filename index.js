require('dotenv').config()
const express = require('express')
const app = express()
const { APP_UPLOAD_ROUTE, APP_UPLOAD_PATH } = process.env
const port = process.env.PORT || 3001
const { database } = require('./src/config/sequelize')
const cors = require('cors')
const routes = require('./src/routes')

app.use(cors())

app.use(express.urlencoded({ extended: false }))

app.use('/', routes)
app.use(APP_UPLOAD_ROUTE, express.static(APP_UPLOAD_PATH))

app.listen(port, () => {
  console.log(`App running on port ${port}`)
  database.sync()
})
