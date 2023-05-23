const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const newError = new Error("Validation error.");
    newError.statusCode = 422;
    newError.data = errors.array();
    throw newError;
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = User({ email, password: hashedPassword, name, posts: [] });
      return user.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "User was created successfully.",
        userId: result._id,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const authController = {
  signup,
};

module.exports = authController;
