const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const feedRouter = require("./routes/feed");
const { MONGO_URL } = require("./env");
const errorHandler = require("./middleware/error-handler");

// Configuration

const app = express();

// Middleware

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Contol-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRouter);

app.use(errorHandler);

// Startup

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`Mongodb connection established.`);
    app.listen(8080, () => {
      console.log(`Server listening on port ${8080}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
