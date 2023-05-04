const renderNotFoundPage = (req, res, next) => {
  res.status(404);
  res.render("404", {
    path: "404",
    pageTitle: "404",
  });
};

module.exports = { renderNotFoundPage };
