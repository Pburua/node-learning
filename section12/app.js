const path = require("path");

const express = require("express");

const errorController = require("./controllers/error");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

// Configuration

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// Middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Setting up mysql db and listening

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

let curUser;

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) return User.create({ name: "Pavel", email: "test@mail.com" });
    return user;
  })
  .then((user) => {
    curUser = user;
    return Cart.findOne({ where: { userId: user.id } });
  })
  .then((cart) => {
    if (!cart) return curUser.createCart();
    return cart;
  })
  .then(() => {
    console.log("MySQL database is synced.");
    app.listen(8080, () => {
      console.log(`Server listening at port ${8080}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
