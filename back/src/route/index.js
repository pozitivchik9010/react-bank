const express = require('express')
const router = express.Router()

const auth = require('./auth')

router.use('/', auth)

router.get('/', (req, res) => {
  res.status(200).json('Hello World')
})

module.exports = router
