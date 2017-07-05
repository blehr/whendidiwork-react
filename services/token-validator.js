const User = require("../models/users.js");
const google = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const auth = require("./auth");
const moment = require("moment");

const oauth2Client = new OAuth2(
  auth.googleAuth.clientID,
  auth.googleAuth.clientSecret,
  auth.googleAuth.callbackURL
);

exports.checkToken = (req, res, next) => {
  if (!req.user) {
    console.log("NO USER");
    return next();
  }

  if (moment().subtract(req.user.google.expiry_date, "s").format("X") > -300) {
    oauth2Client.setCredentials({
      access_token: req.user.google.token,
      refresh_token: req.user.google.refreshToken
    });

    oauth2Client.refreshAccessToken(function(err, tokens) {
      if (err) return next(err);

      User.findOneAndUpdate(
        { "google.id": req.user.google.id },
        {
          "google.token": tokens.access_token,
          "google.expiry_date": tokens.expiry_date
        },
        {
          new: true,
          runValidators: true
        },
        function(err, doc) {
          if (err) return next(err);
          next();
        }
      );
    });
  }
  next();
};
