const path = require("path");
const express = require("express");

const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const { connectToMongo } = require("./util/database");

// Configuration

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// Middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Listening

connectToMongo(() => {
  console.log("Mongdodb connection established.");
  app.listen(8080, () => {
    console.log(`Server listening at port ${8080}`);
  });
});
