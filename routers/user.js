const express = require("express");
const router = express.Router();
const User = require("../modals/user.js");
const passport = require("passport");
const { saveRedirecturl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signup);

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirecturl,passport.authenticate("local",{failureRedirect : "/login",failureFlash: true}),userController.login);

router.get("/logout",userController.logout);

module.exports = router;