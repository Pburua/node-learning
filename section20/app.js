const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const { MONGO_URL } = require("./env");
const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const setUser = require("./middleware/set-user");
const errorHandler = require("./middleware/error-handler");
const setRenderLocals = require("./middleware/set-render-locals");

// Configuration

const app = express();

const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: "sessions",
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

// Middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(csrfProtection);

app.use(flash());

app.use(setRenderLocals);

app.use(setUser);

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use(errorHandler);

// Setting up mongodb and listening

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
