const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("645ce24e21acc55ad4c1ad14")
    .then((user) => {
      req.session.user = user;
      req.session.isAuthenticated = true;
      res.redirect("/");
    })
    .catch((err) => {
      console.error(err);
    });
};
