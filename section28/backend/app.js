const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");

const { MONGO_URL } = require("./env");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");

// Configuration

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || "image/jpg" || "image/jpeg") {
    return cb(null, true);
  }
  cb(null, false);
};

// Middleware

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.json());

app.use(
  multer({
    storage: fileStorage,
    fileFilter,
  }).single("image")
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) return err;

      const data = err.originalError.data || null;
      const statusCode = err.originalError.statusCode || 500;
      const message = err.originalError.message || "An error occured.";

      return {
        message,
        data,
        status: statusCode,
      };
    },
  })
);

// Startup

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`Mongodb connection established.`);
    return new Promise((resolve, reject) => {
      app.listen(8080, () => {
        return resolve(8080);
      });
    });
  })
  .then((port) => {
    console.log(`Server listening on port ${port}`);
  })
  .catch((err) => {
    console.error(err);
  });
