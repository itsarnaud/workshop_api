const express = require('express')
const router  = express.Router()

const GuestsController = require('../controllers/GuestsController')

router.get('/', GuestsController.index)

module.exports = router