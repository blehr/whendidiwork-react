const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const expressValidator = require('express-validator');
const MongoDBStore = require('connect-mongodb-session')(session);
 
require('dotenv').load();
require('./services/google-passport')(passport);

const authRouter = require('./routes/auth-router')();
const apiRouter = require('./routes/api-router')();

const app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

mongoose.connect(process.env.MONGO_URI);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'mySessions'
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(cors({origin: true, credentials: true}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.get('/*', (req, res) => {
  console.log('here');
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.send(err);
});

module.exports = app;
