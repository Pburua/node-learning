const { body } = require("express-validator");

const postLoginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body("password", "Please enter a valid password")
    .isLength({ min: 5 })
    .isAlphanumeric()
    .withMessage()
    .trim(),
];

const postSignupValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, {}) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("User already exists");
        }
      });
    })
    .normalizeEmail(),
  body("password", "Please enter a valid password")
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  body("confirmPassword", "Please enter a valid password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match");
      }
      return true;
    })
    .trim(),
];

module.exports = { postLoginValidation, postSignupValidation };
