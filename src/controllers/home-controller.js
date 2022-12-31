//Get product in cart
const cartController = require("../controllers/shoppingCart-controller");
const userController = require("../controllers/user-controller");

// Model
const productData = require("../models/products.model");
const postData = require("../models/post.model");

// Helper function
const helper = require("../helpers/index");

class homeController {
    // [GET] /
    async showHomePage(req, res, next) {
        let userId = req.userID;
        let cartProduct = userId == "" ? { cartProducts: [], totalBill: 0 } : await cartController.getCartProduct(userId);

        let hotProduct = await productData.find().getHotProduct().limit(10).exec();
        let discountProduct = await productData.find().getDiscountProduct().limit(10).exec();
        let accessProduct = await productData.find().getProductByType("Accessories").limit(10).exec();
        let news = await postData.find().limit(4).exec()
        let products = await productData.find().limit(20).lean().getNewProduct().exec();

        let userData = userId == "" ? null : await userController.getUserInfoBy_ID(userId);

        return res.render("home", {
            cartProduct,
            hotProduct,
            discountProduct,
            accessProduct,
            news,
            products,
            totalPages: 15,
            currentPage: 1,
            formatMoney: helper.formatToMoney,
            userData
        });
    }
}

module.exports = new homeController();