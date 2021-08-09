const admin = require('firebase-admin')
const serviceAccount = require('../config/ava-ewallet-firebase-adminsdk-z8cpm-79b4903939.json')

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

module.exports = { messaging: firebase.messaging() }
