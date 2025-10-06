const express = require('express')
const router  = express.Router()

const InvitationsController = require('../controllers/InvitationsController')

router.get ('/',     InvitationsController.index)
router.post('/',    InvitationsController.create);
router.get ('/:id', InvitationsController.show);
router.put ('/:id', InvitationsController.update);

module.exports = router