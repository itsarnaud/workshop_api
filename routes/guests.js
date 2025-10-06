const express = require('express')
const router  = express.Router()

const GuestsController = require('../controllers/GuestsController')

router.get ('/',    GuestsController.index)
router.post('/',    GuestsController.create);
router.get ('/:id', GuestsController.show);
router.put ('/:id', GuestsController.update);

module.exports = router