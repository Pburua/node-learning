const User = require("../models/user");

const setUser = (req, res, next) => {
  User.findById(req.session.user?._id)
    .then((user) => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch((err) => {
      const newError = new Error(err);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};

module.exports = setUser;
