const Order = require("../models/order");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const newError = new Error(err);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const newError = new Error(err);
      newError.httpStatusCode = 404;
      return next(newError);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch((err) => {
      const newError = new Error(err);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const cartProducts = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        cartProducts,
      });
    })
    .catch((err) => {
      const newError = new Error(err);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      console.log("Cart updated successfully.");
      res.redirect("/cart");
    })
    .catch((err) => {
      const newError = new Error(err);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};

exports.postDeleteCartItem = (req, res, next) => {
  const productId = req.body.productId;

  req.user
    .deleteItemFromCart(productId)
    .then(() => {
      console.log("Cart item deleted successfully.");
      res.redirect("/cart");
    })
    .catch((err) => {
      const newError = new Error(err);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};

exports.postCreateOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      console.log("Order created successfully.");
      res.redirect("/orders");
    })
    .catch((err) => {
      const newError = new Error(err);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};

exports.getOrders = (req, res, next) => {
  return Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
      });
    })
    .catch((err) => {
      const newError = new Error(err);
      newError.httpStatusCode = 500;
      return next(newError);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
