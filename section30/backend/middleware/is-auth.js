const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../env");

const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const newError = new Error("Not authenticated.");
    newError.statusCode = 401;
    throw newError;
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(err);
  }

  if (!decodedToken) {
    const newError = new Error("Not authenticated.");
    newError.statusCode = 401;
    throw newError;
  }

  req.userId = decodedToken.userId;
  next();
};

module.exports = isAuth;
