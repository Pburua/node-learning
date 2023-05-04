const express = require("express");

const productController = require('../controllers/products-controller')

const router = express.Router();

router.get("/", productController.renderShopPage);

module.exports = router;
