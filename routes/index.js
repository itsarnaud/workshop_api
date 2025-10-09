const express = require('express');
const router  = express.Router();

const users       = require('./users');
const games       = require('./games');
const invitations = require('./invitations');
const guests      = require('./guests');
const questions   = require('./questions');


router.use('/users',       users);
router.use('/games',       games);
router.use('/invitations', invitations);
router.use('/guests',      guests);
router.use('/questions',   questions);

module.exports = router;
