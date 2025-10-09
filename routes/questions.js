const express = require('express');
const router = express.Router();
const QuestionController = require('../controllers/QuestionController');

router.get('/', QuestionController.getAll);

router.get('/:id', QuestionController.getById);

router.patch('/gamequestions/:id', QuestionController.updateGameQuestion);

module.exports = router;
