const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  isAuth,
  [
    body("title").isString().isLength({ min: 1 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isString().isLength({ min: 1 }).trim(),
  ],
  adminController.postAddProduct
);

router.post(
  "/edit-product",
  isAuth,
  [
    body("title").isString().isLength({ min: 1 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isString().isLength({ min: 1 }).trim(),
  ],
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
