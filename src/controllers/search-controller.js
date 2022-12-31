const productModel = require("../models/products.model");
const postModel = require("../models/post.model");
// Helper function
const helper = require("../helpers/index");
const helperData = require("../helpers/data");
module.exports = {
    async searchProduct(req, res) {
        try {
            let userId = req.userID;
            let size = (req.query.size);
            let rangePrice = (req.query.rangePrice);
            let sort = req.query.sort;
            let search = req.query.search;
            let sortBys = ["name_asc", "name_des", "price_asc", "price_des"];

            let products = productModel.find();

            if (search) {
                search = String(search).toUpperCase();
                products = products.searchProductByName(search);
            }

            if (size) {
                products = products.fillterProductBySize(size);
            }
            if (rangePrice) {
                rangePrice = String(req.query.rangePrice).split("-");
                products = products.fillterProductByPrice(rangePrice);
            }

            if (sortBys.includes(sort)) {
                let sortBy = sort.includes("name") ? "Name" : "Price";
                let sortValue = sort.includes("asc") ? "asc" : "desc";
                products = products.sortable(sortBy, sortValue);
            }

            let currentPage = req.query.page || 1;
            let perPage = 24;
            let totalPages = await products.count().clone();

            let skip = (perPage * currentPage) - perPage;

            let result = await products.find().skip(skip).limit(perPage).lean();

            let sidebarProduct = await productModel.find().getProductByType("Accessories").limit(8).lean();
            let sidebarPost = await postModel.find().limit(8).lean().exec();
            sidebarPost.map((val) => {
                let d = new Date(val.createdAt);
                val.date = helper.formatDate(d);
                val.time = helper.formatDateToTime(d);
            });

            const cartProduct = await helperData.getDataProductInCart(userId);
            // return res.json(sidebarPost);
            return res.render("product", {
                products: result,
                cartProduct,
                totalPages,
                currentPage,
                sidebarProduct,
                sidebarPost,
                formatMoney: helper.formatToMoney,
                userData: req.user
            });
        } catch (error) {
            console.log(error);
            return res.json(error);
        }
    },

    async suggestProduct(req, res) {
        try {
            let search = req.body.search;
            console.log(search);
            let products = productModel.find({}, "productImgs productName newPrice oldPrice slug");
            if (search) {
                search = String(search).toUpperCase();
                products = products.searchProductByName(search).limit(4);
            }
            let result = (await products.lean());
            return res.json({
                products: result
            });
        } catch (error) {

        }
    },
}