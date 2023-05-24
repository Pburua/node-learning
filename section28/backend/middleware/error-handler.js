const errorHandler = (err, req, res, next) => {
  const message = err.message;
  const statusCode = err.statusCode || 500;
  const errData = err.data;

  console.log(err);

  res.status(statusCode).json({
    message,
    errData
  });
};

module.exports = errorHandler;
