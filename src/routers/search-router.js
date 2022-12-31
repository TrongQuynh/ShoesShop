const express = require('express');
const router = express.Router();

// Controller
const searchController = require("../controllers/search-controller");

// /tim-kiem
router.post("/suggest-product", searchController.suggestProduct)
router.get("/", searchController.searchProduct);

module.exports = router;