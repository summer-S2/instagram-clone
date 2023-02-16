// IMPORT MODULES 
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const indexRouter = require('./routes/index');
const app = express();
const mongoose = require("mongoose");
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

// DATABASE Connection
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI)
  .catch(err => console.log(err));

// MIDDLEWARE
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet.crossOriginResourcePolicy({
  policy: "cross-origin" 
}));
app.use(compression()); // Compress all routes
app.use(cors());

// set static path in this app.
app.use('/api/static', express.static('public'));
app.use('/api/files', express.static('files'));

// ROUTER
app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json(err); 
})

module.exports = app;
