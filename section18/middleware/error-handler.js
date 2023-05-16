const errorHandler = (err, req, res, next) => {
  console.error(err);
  switch (err.httpStatusCode) {
    case 404:
      res.status(404).render("404", {
        pageTitle: "Page Not Found",
        path: "/404",
      });
      break;

    default:
      res.status(500).render("500", {
        pageTitle: "Error",
        path: "/500",
      });
      break;
  }
};

module.exports = errorHandler;
