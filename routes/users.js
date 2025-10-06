const express = require('express')
const router  = express.Router()

const UsersController = require('../controllers/UsersController')

router.get ('/',    UsersController.index)
router.post('/',    UsersController.create);
router.get ('/:id', UsersController.show);
router.put ('/:id', UsersController.update);

module.exports = router