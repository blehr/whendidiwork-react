const express = require("express");
const passport = require("passport");
const path = process.cwd();
require('../services/google-passport')(passport);


const authRouter = express.Router();

const requireAuth = passport.authenticate("google", {
  failureRedirect: "/login"
});

const User = require("../models/users");
const AuthController = require("../controllers/auth.controller.js")();

const routes = function routes() {
  authRouter.route("/google").get(
    passport.authenticate("google", {
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/drive"
      ]
    })
  );

  authRouter.route("/google/callback").get(requireAuth, function(req, res) {
    res.redirect("/auth/google/callback/" + req.user.id);
  });

  authRouter.route("/user").get(AuthController.getUser);

  authRouter.route("/logout").get(AuthController.logout);

  return authRouter;
};

module.exports = routes;
