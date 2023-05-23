const { body } = require("express-validator");

const createPostValidation = [
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
];

const updatePostValidation = [
  body("title").trim().isLength({ min: 5 }),
  body("content").trim().isLength({ min: 5 }),
];

const updateStatusValidation = [body("status").trim().isLength({ min: 1 })];

module.exports = {
  createPostValidation,
  updatePostValidation,
  updateStatusValidation,
};
