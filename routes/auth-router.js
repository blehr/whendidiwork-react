const express = require("express");
const passport = require("passport");
const path = process.cwd();
const cors = require("cors");
require("../services/google-passport")(passport);
require("../services/google-passport-token")(passport);

const authRouter = express.Router();
authRouter.use(cors({ origin: true, credentials: true }));

const requireAuth = passport.authenticate("google", {
  failureRedirect: "/login"
});


const routes = function routes() {
  authRouter.route("/google").get(
    passport.authenticate("google", {
      accessType: "offline",
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets"
      ]
    })
  );

  authRouter.route("/google/callback").get(requireAuth, function(req, res) {
    res.redirect("/auth/google/callback/" + req.user.id);
  });

  
  authRouter.route("/mobilelogin").post(
    passport.authenticate('google-authcode'),
    function(req, res) {
      // console.log('res', req.user);
      res.send(req.user);
    }
  )


  return authRouter;
};

module.exports = routes;
