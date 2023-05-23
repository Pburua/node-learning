const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../env");

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

const login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        const newError = new Error("Invalid email.");
        newError.statusCode = 422;
        throw newError;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const newError = new Error("Invalid password.");
        newError.statusCode = 422;
        throw newError;
      }
      const token = jwt.sign(
        {
          userId: loadedUser._id.toString(),
          email: loadedUser.email,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token,
        userId: loadedUser._id.toString(),
      });
    })
    .catch((err) => {
      next(err);
    });
};

const authController = {
  signup,
  login,
};

module.exports = authController;
