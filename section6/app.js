const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { engine } = require("express-handlebars");

const { router: adminRouter, products } = require("./routes/admin");
const shopRouter = require("./routes/shop");

const app = express();

// ejs
app.set("view engine", "ejs");
app.set("views", "views");

// handlebars
// app.engine(
//   "hbs",
//   engine({ layoutsDir: "views/layouts", defaultLayout: "main-layout.hbs" })
// );
// app.set("view engine", "hbs");
// app.set("views", "views");

// pug
// app.set('view engine', 'pug');
// app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/public")));

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use((req, res, next) => {
  res.status(404);
  // res.sendFile(path.join(__dirname, 'views', '404.html'));
  res.render("404", {
    path: '404',
    pageTitle: "404",
    formsCSS: false,
    productsCSS: false,
    activeShop: false,
    activeAddProduct: false,
  });
});

app.listen(8080);

console.log(`Server is listening on port ${8080}!`);
