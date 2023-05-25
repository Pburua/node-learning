const path = require("path");

const getLoginPage = (req, res, next) => {
  res.status(200).render("index", {
    isAuthenticated: Boolean(req.user)
  });
};

const getWelcomePage = (req, res, next) => {
  res.status(200).render("welcome", {
    username: req.user.name,
  });
};

const handleLoginSuccess = async (req, res, next) => {
  console.log("Google login succeeded.");
  res.redirect("/welcome");
};

const handleLoginFailure = (req, res, next) => {
  console.log("Google login failed.");
  res.redirect("/");
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) console.error(err);
    res.redirect("/");
  });
};

const authController = {
  getLoginPage,
  getWelcomePage,
  handleLoginSuccess,
  handleLoginFailure,
  logout,
};

module.exports = authController;
