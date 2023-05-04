const express = require("express");
const path = require("path");

const rootDir = require("../utils/path");

const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
  // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productsCSS: true,
    activeShop: false,
    activeAddProduct: true,
  });
});

router.post("/add-product", (req, res, next) => {
  products.push(req.body);
  res.redirect("/");
});

module.exports = { router, products };
