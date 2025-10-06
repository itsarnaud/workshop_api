const express      = require('express');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const createError  = require('http-errors');

const router = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', router);

app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
