const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { postAddProductValidation, postEditProductValidation } = require("../middleware/validation/admin");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  isAuth,
  postAddProductValidation,
  adminController.postAddProduct
);

router.post(
  "/edit-product",
  isAuth,
  postEditProductValidation,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
