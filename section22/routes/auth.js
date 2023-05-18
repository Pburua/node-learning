const express = require("express");

const authController = require("../controllers/auth");
const { postSignupValidation, postLoginValidation } = require("../middleware/validation/auth");

const router = express.Router();

router.get("/signup", authController.getSignUp);

router.post("/signup", postSignupValidation, authController.postSignUp);

router.get("/login", authController.getLogin);

router.post("/login", postLoginValidation, authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.get("/new-password/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
