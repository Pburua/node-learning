const path = require("path");
const express = require("express");

const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { connectToMongo } = require("./util/database");
const User = require("./models/user");

// Configuration

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// Middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("645b8e71a90b071ab0c1b34e")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Listening

connectToMongo(() => {
  console.log("MongdoDB connection established.");
  app.listen(8080, () => {
    console.log(`Server listening at port ${8080}`);
  });
});
