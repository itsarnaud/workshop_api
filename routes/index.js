const express = require('express');
const router  = express.Router();

const users       = require('./users');
const games       = require('./games');
const invitations = require('./invitations');
const guests      = require('./guests');

router.use('/users',       users);
router.use('/games',       games);
router.use('/invitations', invitations);
router.use('/guests',      guests);

module.exports = router;
