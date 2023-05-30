const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postDeleteCartItem);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/orders/:orderId", isAuth, shopController.getInvoice);

router.get("/checkout", isAuth, shopController.getCheckout);

// Security issue here, endpoint is exposed to all users
// https://stripe.com/docs/payments/handling-payment-events
router.get("/checkout/success", isAuth, shopController.createOrder);

router.get("/checkout/cancel", isAuth, shopController.getCheckout);

module.exports = router;
