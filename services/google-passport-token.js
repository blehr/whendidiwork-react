'use strict';

// const GoogleTokenStrategy = require('passport-google-token').Strategy;
var GoogleAuthCodeStrategy = require('passport-google-authcode').Strategy;

const User = require('../models/users');

const configAuth = require('./auth');

const moment = require("moment");


module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new GoogleAuthCodeStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, accessToken, refreshToken, profile, done) {
      const expiry_date = moment().add(3600, "s").format("x");  // one hour from now
      process.nextTick(function() {
        if (!req.user) {

          User.findOne({
            'google.id': profile.id
          }, function(err, user) {
            if (err) {
              return done(err);
            }

            if (user) {

              // if there is a user id already but no token (user was linked at one point and then removed)
              // just add our token and profile information
              if (!user.google.token) {

                user.google.token = accessToken;
                if (refreshToken && refreshToken != null) user.google.refreshToken = refreshToken;
                user.google.displayName = profile.displayName;
                user.google.email = profile.emails[0].value;
                user.google.profileImg = profile._json.picture;
                user.google.expiry_date = expiry_date;


                user.save(function(err) {
                  if (err)
                    throw new ERROR("Error saving user: " + err);
                  return done(null, user);
                });
              }
              //save new token
              user.google.profileImg = profile._json.picture;
              user.google.token = accessToken;
              if (refreshToken && refreshToken != null) user.google.refreshToken = refreshToken;
              user.google.expiry_date = expiry_date;
              user.save(function(err) {
                  if (err) throw new ERROR("Error saving new token: " + err);
                  return done(null, user);
                });

            } else {
              const newUser = new User();

              newUser.google.id = profile.id;
              newUser.google.token = accessToken;
              newUser.google.refreshToken = refreshToken;
              newUser.google.displayName = profile.displayName;
              newUser.google.email = profile.emails[0].value;
              newUser.google.profileImg = profile._json.picture;
              newUser.lastUsed.calendar = '';
              newUser.lastUsed.sheet = '';
              newUser.google.expiry_date = expiry_date;

              newUser.save(function(err) {
                if (err) {
                  throw new ERROR("Error saving new user: " + err);
                }

                return done(null, newUser);
              });
            }
          });
        } else {
          // user already exists and is logged in, we have to link accounts
          const user = req.user; // pull the user out of the session

          // update the current users google credentials
          user.google.id = profile.id;
          user.google.token = accessToken;
          if (refreshToken && refreshToken != null) user.google.refreshToken = refreshToken;
          user.google.displayName = profile.displayName;
          user.google.email = profile.emails[0].value;
          user.google.profileImg = profile._json.picture;
          user.google.expiry_date = expiry_date;
          // save the user
          user.save(function(err) {
            if (err)
              throw new ERROR("Error updating user: " + err);
            return done(null, user);
          });
        }
      });

    }
  ));
};
