const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const { MONGO_URL } = require("./env");
const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./models/user");

// Configuration

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// Middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("645ce24e21acc55ad4c1ad14")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

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
