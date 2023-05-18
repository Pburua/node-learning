const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Order = require("../models/order");
const Product = require("../models/product");

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let productsCount = 0;

  Product.find()
    .countDocuments()
    .then((count) => {
      productsCount = count;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < productsCount,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(productsCount / ITEMS_PER_PAGE),
        firstPage: 1,
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
  const page = +req.query.page || 1;
  let productsCount = 0;

  Product.find()
    .countDocuments()
    .then((count) => {
      productsCount = count;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < productsCount,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(productsCount / ITEMS_PER_PAGE),
        firstPage: 1,
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

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        const newError = new Error("Get Invoice Error: Order not found.");
        newError.httpStatusCode = 404;
        return next(newError);
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        const newError = new Error("Get Invoice Error: Unauthorized.");
        newError.httpStatusCode = 401;
        return next(newError);
      }

      const invoiceFileName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceFileName);
      const pdfDoc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${invoiceFileName}"`
      );

      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });

      let totalPrice = 0;
      pdfDoc.fontSize(14).text("--------------------");
      order.items.forEach((orderItem) => {
        totalPrice = totalPrice + orderItem.quantity * orderItem.product.price;
        pdfDoc.text("Title: " + orderItem.product.title);
        pdfDoc.text("Price: $" + orderItem.product.price);
        pdfDoc.text("Quantity: " + orderItem.quantity);
        pdfDoc.text("--------------------");
      });

      pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`);

      pdfDoc.end();
    })
    .catch((err) => {
      const newError = new Error(err);
      newError.httpStatusCode = 404;
      return next(newError);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
