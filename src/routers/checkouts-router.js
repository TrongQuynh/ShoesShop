const express = require('express');
const router = express.Router();

// Controller
const checkoutController = require("../controllers/checkout-controller");

// [GET] /checkouts/province-api
router.get("/province-api", checkoutController.loadProvinceData);

// [GET] /checkouts
router.get("/", checkoutController.loadData);

// [POST] /checkouts
router.post("/", checkoutController.addNewOrder);

// [GET] /checkouts/payment
// router.get("/payment", checkoutController.payment);

// [POST] /checkouts/payment
// router.post("/payment", checkoutController.addNewOrder);

// [GET] /checkouts/order
router.get("/order/:orderCode", checkoutController.order);

module.exports = router;