const express = require('express');
const router = express.Router();
const multer = require('multer');

// Controller
const userController = require("../controllers/user-controller");

router.get("/tao-san-pham-moi", userController.showCreateNewProduct);

// [GET]/user/purchase
router.get("/purchase", userController.purchase);

// router.post("/add-roduct", upload.array("imageFiles",max),userController.addNewProduct);

module.exports = router;