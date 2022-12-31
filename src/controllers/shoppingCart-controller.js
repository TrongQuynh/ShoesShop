
// Model
const shoppingCartModel = require("../models/shoppingCart.model");
const productModel = require("../models/products.model");
const userModel = require("../models/user.model");

// Helper function
const helper = require("../helpers/index");

function updateProductQuantity(cart, newProduct, isUpdate) {
    let productIndex = cart.products.findIndex((product) => (product.productCode == newProduct.productCode) && (product.size == newProduct.size));

    if (productIndex > -1) {
        let quantity = cart.products[productIndex].quantity;
        quantity = isUpdate ? newProduct.quantity : quantity + newProduct.quantity;
        cart.products[productIndex].quantity = quantity;
    }
    else {
        cart.products.push(newProduct)
    }
    return cart;
}

async function getCartProduct(userId){
        
        let newCartProduct = [];
        let totalBill = 0;
        let totalProduct = 0;
        let cart = await shoppingCartModel.findOne({userId});

        if(!cart){
            return {cartProducts:newCartProduct, totalBill};
        }
        for (let cartProduct of cart.products) {
            let product = await productModel.findOne({ productCode: cartProduct.productCode });
            totalBill += ((product.newPrice) * (cartProduct.quantity));
            totalProduct += Number(cartProduct.quantity);
            newCartProduct.push({
                price: product.newPrice,
                productCode: product.productCode,
                productName: product.productName,
                quantity: cartProduct.quantity,
                thumbnail: product.productImgs[0],
                size: cartProduct.size,
                slug: product.slug,
                id: cartProduct._id,
                totalPrice: (product.newPrice) * (cartProduct.quantity)
            })
        }
        return {cartProducts:newCartProduct, totalBill,totalProduct};
}

class cartController {

    // [GET] /gio-hang/
    async loadData(req, res, next) {
        let userId = req.userID;
        
        let cartProduct = userId == "" ? {cartProducts:[], totalBill:0} : await getCartProduct(userId);
        // return res.json(newCart)
        return res.render("shopping-cart", {
            cartProduct,
            userData: req.user,
            formatMoney: helper.formatToMoney
        })
    }

    // [POST] /gio-hang/add-new-product
    async addNewProduct(req, res, next) {

        const userId = req.userID;
        const {productCode, quantity, size } = req.body;
        // let userId = "62efa3490f31b54514b2baf2", productCode ="Mk23", quantity = 2, size = 45;
        let cart = await shoppingCartModel.findOne({ userId });
        let totalQuantity = 0;
        if (cart) {
            cart = updateProductQuantity(cart, {productCode, quantity, size},false);
            cart = await cart.save();
        } else {
            await new shoppingCartModel({
                userId,
                products: [{ productCode, quantity, size }]
            }).save();
        }
        cart = await shoppingCartModel.findOne({ userId });
        cart.products.forEach((product) => totalQuantity += product.quantity);
    
        return res.status(200).end();
    }

    // [PATCH] /gio-hang/update-quantity-product
    async updateQuantityProduct(req, res) {
        let userId = req.userID;
        let {productCode, quantity, size} = req.body;
        let cart = await shoppingCartModel.findOne({ userId });
        if (cart) {
              cart = updateProductQuantity(cart,{productCode, quantity, size},true);
              cart = await cart.save();
              return res.status(200).json(cart); 
        } else {
            return res.json({ "Message": "Not found cart of user" });
        }
    }

    // [DELETE] /gio-hang/delete/:id
    async deleteProduct(req, res){
        let id = req.params.id;
        let userId = req.userID;
        let cart = await shoppingCartModel.findOne({ userId });
        let products = cart.products.filter((product) => product._id != id);
        cart.products = products;
        await cart.save();

        // Get URL of page has send request
        let fullUrl = req.headers.referer;
        return res.status(200).redirect(fullUrl);
    }

    // [GET] /gio-hang/test
    async test(req, res, next) {

    }
}

module.exports = {
    cartController: new cartController(),
    getCartProduct
}