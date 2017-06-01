var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var request = require('request');
var MongoDBStore = require('connect-mongodb-session')(session);

require('dotenv').load();
require('./services/google-passport')(passport);

// var routes = require('./routes/index');
// var users = require('./routes/users');
const authRouter = require('./routes/auth-router')();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


mongoose.connect('mongodb://localhost/whendidiwork2');

var store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'mySessions'
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(cors());


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store
}));

app.use(passport.initialize());
app.use(passport.session());

// routes(app, passport);




app.use('/auth', authRouter);
// app.use('/api', routes);
// app.use('/users', users);

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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
