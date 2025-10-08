const express      = require('express');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const createError  = require('http-errors');
const cors         = require('cors')

const router = require('./routes/index');
const authMiddleware = require('./middlewares/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(authMiddleware);

app.use('/api', router);

app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
