const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const { MONGO_URL } = require("./env");
const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const User = require("./models/user");

// Configuration

const app = express();

const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: 'sessions'
});

app.set("view engine", "ejs");
app.set("views", "views");

// Middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store
}));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// Setting up mongodb and listening

mongoose
  .connect(MONGO_URL)
  .then(() => {
    return User.findOne();
  })
  .then((oldUser) => {
    if (!oldUser) {
      const user = new User({
        name: "Pavel",
        email: "test@mail.com",
        cart: {
          items: [],
        },
      });
      return user.save();
    }
  })
  .then(() => {
    console.log("MongdoDB connection established.");
    app.listen(8080, () => {
      console.log(`Server listening at port ${8080}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
