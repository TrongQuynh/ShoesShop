const express = require('express');
const router = express.Router();

// Controller
const adminController = require("../controllers/admin-controller");

//[GET] /quan-ly/san-pham-moi
router.get("/san-pham-moi", adminController.showNewProductPage);

// [POST] /quan-ly/san-pham-moi
router.post("/san-pham-moi", adminController.newProduct);

// [GET] /quan-ly/quan-ly-san-pham
router.get("/quan-ly-san-pham", adminController.showProductManagementPage);

// [GET] /quan-ly
router.get("/", adminController.showAdminPage);

module.exports = router;