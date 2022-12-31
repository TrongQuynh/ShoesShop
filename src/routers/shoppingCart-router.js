const express = require('express');
const router = express.Router();

// Controller
const cartController = require("../controllers/shoppingCart-controller").cartController;

// /gio-hang/
router.patch("/update-quantity-product", cartController.updateQuantityProduct)
router.get("/test", cartController.test);
router.delete("/delete/:id", cartController.deleteProduct)
router.post("/add-new-product", cartController.addNewProduct);
router.get("/", cartController.loadData);

module.exports = router;