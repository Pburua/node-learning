const express = require("express");

const authController = require("../controllers/auth");
const { signupValidation } = require("../middleware/validation/auth");

const authRouter = express.Router();

authRouter.put("/signup", signupValidation, authController.signup);

authRouter.post("/login", signupValidation, authController.login);

module.exports = authRouter;
