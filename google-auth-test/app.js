const express = require("express");
const authRouter = require("./routes/auth");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const { MONGO_URL } = require("./env");
require("./util/passport-conig");

// Configuration

const app = express();

const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: "sessions",
});

// Middleware

app.use(express.json());

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(passport.authenticate("session"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
  next();
});

app.use(authRouter);

// Startup

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongdoDB connection established.");
    app.listen(8080, () => {
      console.log(`Server listening at port ${8080}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
