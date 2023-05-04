const express = require("express");
const path = require("path");

const rootDir = require("../utils/path");
const { products } = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("products", products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  const hasProducts = products.length > 0;
  res.render("shop", {
    products,
    hasProducts,
    pageTitle: "Shop",
    path: "/",
    formsCSS: false,
    productsCSS: true,
    activeShop: true,
    activeAddProduct: false,
  });
});

module.exports = router;
