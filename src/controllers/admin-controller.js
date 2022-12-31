
// Model
const productModel = require("../models/products.model");

// Middleware
const upload_middleware = require("../middlewares/upload");

// Helper
const helper = require("../helpers/index");

class adminController {

    // [GET] /quan-ly/san-pham-moi
    async showNewProductPage(req, res) {
        return res.render("newProduct")
    }

    // [POST] /quan-ly/san-pham-moi
    async newProduct(req, res, next) {
        let upload = upload_middleware.array("productImage", 6);
        upload(req, res, async function (err) {
            console.log(req.files)
            if (err) {
                console.log(err);
            }
            console.log("Request New Product");
            // let { groupName, members, avatar } = req.body.avatar ? req.body : JSON.parse(JSON.stringify(req.body));

            // await group_helper.newGroup({ groupName, members, avatar });
            // return res.status(200).end();
            console.log(JSON.parse(JSON.stringify(req.body)));
            return res.json(JSON.stringify(req.body))
        });
    }

    // [GET] /quan-ly/quan-ly-san-pham
    async showProductManagementPage(req, res) {
        let products = await productModel.find();
        return res.render("product-management", {
            "products": products,
            "formatToMoney": helper.formatToMoney
        });
    }

    // [GET] /quan-ly/
    showAdminPage(req, res) {
        return res.render("admin");
    }
}

module.exports = new adminController();