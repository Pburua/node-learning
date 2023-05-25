const express = require("express");
const passport = require("passport");

const authController = require("../controllers/auth");
const isAuth = require("../middleware/isAuth");

const authRouter = express.Router();

authRouter.get("/", authController.getLoginPage);

authRouter.get("/welcome", isAuth, authController.getWelcomePage);

authRouter.get("/login", passport.authenticate("google"));

authRouter.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/callback/success",
    failureRedirect: "/callback/failure",
    failureMessage: true,
  })
);

authRouter.get("/callback/success", authController.handleLoginSuccess);

authRouter.get("/callback/failure", authController.handleLoginFailure);

authRouter.get("/logout", authController.logout);

module.exports = authRouter;
