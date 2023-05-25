const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../env");

const graphqlResolver = {
  createUser: async ({ userInput }, req) => {
    const email = userInput.email;
    const name = userInput.name;
    const password = userInput.password;

    const errors = [];
    if (!validator.isEmail(email))
      errors.push({
        message: "Email is invalid.",
      });
    if (validator.isEmpty(password))
      errors.push({
        message: "Password is invalid.",
      });
    if (validator.isEmpty(name))
      errors.push({
        message: "Name is invalid.",
      });

    if (errors.length > 0) {
      const newError = new Error("Invalid input");
      newError.data = errors;
      newError.statusCode = 422;
      throw newError;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const newError = new Error("User already exists.");
      newError.statusCode = 422;
      throw newError;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ email, name, password: hashedPassword });

    const createdUser = await newUser.save();

    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
      const newError = new Error("User not found.");
      newError.statusCode = 422;
      throw newError;
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordEqual) {
      const newError = new Error("Password is incorrect.");
      newError.statusCode = 422;
      throw newError;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return { token, userId: user._id.toString() };
  },
};

module.exports = graphqlResolver;
