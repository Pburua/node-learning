const setRenderLocals = (req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  next();
};

module.exports = setRenderLocals;
