const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/signup", authController.getSignUp);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, {}) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("User already exists");
          }
        });
      }),
    body("password", "Please enter a valid password")
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword", "Please enter a valid password").custom(
      (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match");
        }
        return true;
      }
    ),
  ],
  authController.postSignUp
);

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password", "Please enter a valid password")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .withMessage(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.get("/new-password/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
