const express = require("express");
const mongoose = require("mongoose");

const feedRouter = require("./routes/feed");
const { MONGO_URL } = require("./env");

// Configuration

const app = express();

// Middleware

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Contol-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRouter);

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
