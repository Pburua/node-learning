const Product = require('../models/product-model');

const renderAddProductPage = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

const addProduct = (req, res, next) => {
  const newProduct = new Product(req.body.title);
  newProduct.save();
  res.redirect("/");
};

const renderShopPage = (req, res, next) => {
  Product.fetchAll((products) => {
    console.log("products2", products);

    res.render("shop", {
      products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

module.exports = { renderAddProductPage, addProduct, renderShopPage };
