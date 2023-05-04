const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRouter = require("./routes/admin-route");
const shopRouter = require("./routes/shop-route");
const productController = require('./controllers/error-controller');

const app = express();

// ejs setup
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/public")));

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(productController.renderNotFoundPage);

app.listen(8080, () => {
  console.log(`Server is listening on port ${8080}!`);
});
