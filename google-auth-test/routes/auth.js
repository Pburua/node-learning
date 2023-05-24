const express = require("express");

const authController = require("../controllers/auth");

const authRouter = express.Router();

authRouter.get("/", authController.getLoginPage);

authRouter.get("/welcome", authController.getWelcomePage);

authRouter.get("/login", authController.login);

authRouter.get("/callback/success", authController.handleSuccessCallback);

module.exports = authRouter;
