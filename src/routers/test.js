const express = require('express');
const router = express.Router();

const cartModel = require("../models/shoppingCart.model");
const postModel = require("../models/post.model");

// [GET] /san-pham/:name

/*
router.get("/", async (req,res,next)=>{
    try {
        let search = req.query.search ? String(req.query.search).toUpperCase() : false;
        let size = (req.query.size);
        let rangePrice = (req.query.rangePrice) ? String(req.query.rangePrice).split("-") : false;
        let sort = req.query.sort;
        let sortBys = ["name_asc","name_des","price_asc","price_des"];

        let products = productModel.find({},"productImgs productName newPrice oldPrice slug");
        if(search){
            products = products.searchProductByName(search);
        }
        if(size){
            products = products.fillterProductBySize(size);
        }
        if(rangePrice){
            products = products.fillterProductByPrice(rangePrice);
        }
        
        if(sortBys.includes(sort)){
            let sortBy = sort.includes("name") ? "Name" : "Price";
            let sortValue = sort.includes("asc") ? "asc" : "des";
            products = products.sortable(sortBy, sortValue);
        }
        let result = (await products.lean());
        return res.json({
            products:result
        });
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
    
    
})
*/

router.get("/", async function (req, res) {
    // let cartData = await cartModel.find().getCartBy_userID("636b82a560174ea8040be465");
    // console.log(cartData.products.length);
    // return res.json(cartData)
})

module.exports = router;