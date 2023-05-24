const { body } = require("express-validator");

const User = require("../../models/user");

const signupValidation = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) return Promise.reject("Email already exists.");
      });
    }),
  body("password").trim().isLength({ min: 5 }),
  body("name").trim().not().isEmpty(),
];

module.exports = { signupValidation };
