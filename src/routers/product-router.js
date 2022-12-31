const express = require('express');
const router = express.Router();

// Controller
const productController = require("../controllers/product-controller");

// [POST] /san-pham/product-detail
// Get product info by ID
router.post("/product-detail", productController.findProductbyID);

// [POST] /san-pham/delete-product
router.delete("/delete-product", productController.deleteProductByID);

// [POST] /san-pham/update-product
router.patch("/update-product", productController.updateProduct);

// [GET] /san-pham/:name
router.get("/:slug", productController.loadProductDetail);
// [GET] /san-pham/
router.get("/", productController.loadData);


module.exports = router;