exports.getLogin = (req, res, next) => {
  const isAuthenticated = Boolean(req.session.isAuthenticated);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated,
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isAuthenticated = true;
  res.redirect("/");
};
