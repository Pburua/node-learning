const { body } = require("express-validator");

const postAddProductValidation = [
  body("title").isString().isLength({ min: 1 }).trim(),
  body("price").isFloat(),
  body("description").isString().isLength({ min: 1 }).trim(),
];

const postEditProductValidation = [
    body("title").isString().isLength({ min: 1 }).trim(),
    body("price").isFloat(),
    body("description").isString().isLength({ min: 1 }).trim(),
  ]

module.exports = { postAddProductValidation, postEditProductValidation};
