
const helper = require("../helpers/index");

const billModel = require("../models/bill.model");
const userModel = require("../models/user.model");

const cartController = require("../controllers/shoppingCart-controller");
const productModel = require("../models/products.model");



module.exports = {

    // [GET] /user/purchase
    async purchase(req, res, next) {
        console.log("Debug 1");
        let userID = req.userID;
        const bill = await billModel.findOne({ userID: userID });
        console.log("Debug 2");
        let purchases = [];
        if (bill) {
            // if user have bill
            purchases = await helper.getProductBill(bill.orders);
            console.log("Debug 3");
        }
        let cartProduct = userID == "" ? { cartProducts: [], totalBill: 0 } : await cartController.getCartProduct(userID);
        console.log("Debug 4");
        // return res.json(purchases);
        return res.render("purchase", {
            purchases,
            cartProduct,
            userData: req.user,
            formatMoney: helper.formatToMoney
        })
    },

    // [GET] /user/tao-san-pham-moi
    showCreateNewProduct(req, res) {
        return res.render("admin");
    },

    // [POST] /user/products
    async addNewProduct(req, res, next) {
        let productData = req.body;

        let productCode = productData.productCode;
        try {
            let product = await productModel.findOne({ productCode });
            if (product) {
                product = productData;
                product.save();
            } else {
                await new productModel(productData).save();
                return res.status(200).end();
            }
        } catch (error) {
            console.log("Error when try to add new product");
        }

    },

    async getUserInfoBy_ID(userID) {
        let data = await userModel.findOne({ _id: userID });
        let userData = {
            username: data.username,
            phonenumber: data.phonenumber,
            picture: data.picture
        }
        return userData;
    }

}