const bcrypt = require("bcryptjs");
const validator = require("validator");

const User = require("../models/user");

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
      throw newError;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ email, name, password: hashedPassword });

    const createdUser = await newUser.save();

    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
};

module.exports = graphqlResolver;
