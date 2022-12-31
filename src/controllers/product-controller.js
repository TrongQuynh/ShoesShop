//Get product in cart
const cartController = require("../controllers/shoppingCart-controller");

// Data
const productModel = require("../models/products.model");
const postModel = require("../models/post.model");

// Helper function
const helper = require("../helpers/index");

class productController {

    // [GET] /san-pham?page=
    async loadData(req, res, next) {

        try {
            let currentPage = req.query.page || 1;
            let perPage = 24;
            let totalPages = await productModel.find().countDocuments().exec();
            let skip = (perPage * currentPage) - perPage;

            let sidebarProduct = await productModel.find().getProductByType("Accessories").limit(8).lean();
            let sidebarPost = await postModel.find().limit(8).lean().exec();
            sidebarPost.map((val) => {
                let d = new Date(val.createdAt);
                val.date = helper.formatDate(d);
                val.time = helper.formatDateToTime(d);
            })

            let userId = req.userID;
            let cartProduct = userId == "" ? { cartProducts: [], totalBill: 0 } : await cartController.getCartProduct(userId);
            let products = await productModel.find()
                .skip(skip)
                .limit(perPage)
                .lean()
                .exec();
            return res.render("product", {
                cartProduct,
                products,
                totalPages,
                currentPage,
                sidebarProduct,
                sidebarPost,
                formatMoney: helper.formatToMoney,
                userData: req.userData
            });
        } catch (error) {
            console.log(error);
            return res.json(error);
        }
    }

    // [GET] /san-pham/:slug
    async loadProductDetail(req, res, next) {
        let slug = req.params.slug;
        let product = await productModel.findOne({ slug: slug });
        if (!product) {
            return res.json({ message: "404" });
        }
        let userId = req.userID;
        let cartProduct = userId == "" ? { cartProducts: [], totalBill: 0 } : await cartController.getCartProduct(userId);
        return res.render("product-detail", {
            product,
            cartProduct,
            userData: req.userData,
            formatMoney: helper.formatToMoney
        })
    }

    // [POST] /san-pham/product-detail
    async findProductbyID(req, res) {
        let productID = req.body.productID;
        let product = await productModel.findOne({ _id: productID });
        return res.json(product)
    }

    // [POST] /san-pham/delete-product
    async deleteProductByID(req, res) {
        console.log("Delete produt");
        let productID = req.body.productID;
        await productModel.delete({ _id: productID });
        return res.status(200).end();
    }

    // [POST] /san-pham/update-product
    async updateProduct(req, res) {
        let product = req.body.product;
        console.log(product);
        let productData = await productModel.findOne({ _id: product._id });
        if (!productData) {
            // send 404
            return res.status(200).json({ "message": "404" }).end();
        }
        // productData = product;
        console.log(productData);
        // productData.save();
        return res.status(200).json(productData).end();
    }

}

module.exports = new productController();