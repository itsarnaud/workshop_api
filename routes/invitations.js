const express = require('express')
const router  = express.Router()

const InvitationsController = require('../controllers/InvitationsController')

router.get('/', InvitationsController.index)

module.exports = router