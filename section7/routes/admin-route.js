const express = require("express");

const productController = require('../controllers/products-controller');

const router = express.Router();

router.get("/add-product", productController.renderAddProductPage);

router.post("/add-product", productController.addProduct);

module.exports = router;
