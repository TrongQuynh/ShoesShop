const express = require('express');
const router = express.Router();
const multer = require('multer');

// Controller
const userController = require("../controllers/user-controller");

// [GET]/user/purchase
router.get("/purchase", userController.purchase);

// [POST] user/repurchase
router.post("/repurchase", userController.repurchase);

// router.post("/add-roduct", upload.array("imageFiles",max),userController.addNewProduct);

module.exports = router;