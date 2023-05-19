const errorHandler = (err, req, res, next) => {
  const message = err.message;
  const statusCode = err.statusCode || 500;

  console.log(err);

  res.status(statusCode).json({
    message,
  });
};

module.exports = errorHandler;
