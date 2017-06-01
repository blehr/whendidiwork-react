// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

'use strict';

var path = process.cwd();
// const passport = require('passport');
// require('../services/google-passport')(passport);

var GoogleApiHandler = require(path + '/controllers/appHandler.server.js');


module.exports = function(app, passport) {

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  }


  var googleApiHandler = new GoogleApiHandler();

  // app.route('/')
  //   .get(isLoggedIn, function(req, res) {
  //     res.send(req.user);
  //   });

  // app.route('/login')
  //   .get(function(req, res) {
  //     res.redirect('/login');
  //   });

  // app.route('/logout')
  //   .get(function(req, res) {
  //     req.logout();
  //     res.redirect('/login');
  //   });

  // app.route('/faq')
  //   .get(function(req, res) {
  //     res.redirect('/faq');
  //   });

  app.route('/:id')
    .get(function(req, res) {
      res.json(req.user);
    });

  // app.route(isLoggedIn, '/api/:id')
  //   .get(googleApiHandler.getUser);



  // Google routes
  app.route('/auth/google')
    .get(passport.authenticate('google', {
      scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/drive']
    }));

  app.route('/auth/google/callback')
    .get(passport.authenticate('google', {
        failureRedirect: '/login',
      }),
      function(req, res) {
        res.redirect("/auth/google/callback/" + req.user.id);
      });


  // get list of calendars
  app.route('/api/:id/calendarlist')
    .get(isLoggedIn, googleApiHandler.getCalendarList);

  // create calendar
  app.route('/api/:id/create-calendar')
    .post(isLoggedIn, googleApiHandler.createCalendar);

  // create sheet
  app.route('/api/:id/create-sheet')
    .post(isLoggedIn, googleApiHandler.createSheet);

  // get calendar events
  app.route('/api/:id/calendarevents/:calendarId')
    .get(isLoggedIn, googleApiHandler.getEvents);

  // create event to calendar and sheet
  app.route('/api/:id/create-event/:calendarId/:sheetId/:nextRow')
    .post(isLoggedIn, googleApiHandler.createEvent);

  // update event on calendar and sheet
  app.route('/api/:id/calendarevents/:calendarId/:eventId')
    .put(isLoggedIn, googleApiHandler.updateEvent);

  //retrieve sheets
  app.route('/api/:id/drivelist')
    .get(isLoggedIn, googleApiHandler.getFiles);

  // retrieve sheet meta data
  app.route('/api/:id/sheet/:sheetId')
    .get(isLoggedIn, googleApiHandler.getSheetMeta);

  // delete event calendar and sheet
  app.route('/api/:id/delete-event/:calendarId/:eventId')
    .delete(isLoggedIn, googleApiHandler.deleteEvent);

  app.route('/api/:id/check-token')
    .get(isLoggedIn, googleApiHandler.checkToken);

};
