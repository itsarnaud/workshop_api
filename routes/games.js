const express = require('express')
const router  = express.Router()

const GamesController = require('../controllers/GamesController')

router.get ('/',    GamesController.index);
router.post('/',    GamesController.create);
router.get ('/:id', GamesController.show);
router.put ('/:id', GamesController.update);

module.exports = router