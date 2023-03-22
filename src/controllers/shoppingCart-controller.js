
// Model
const shoppingCartModel = require("../models/shoppingCart.model");
const productModel = require("../models/products.model");
const userModel = require("../models/user.model");

// Helper function
const helper = require("../helpers/index");

function updateProductQuantity(cart, newProduct, isUpdate) {
    let productIndex = cart.products.findIndex((product) => (product.productID == newProduct.productID) && (product.size == newProduct.size));

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

async function getCartProduct(userID){
        
        let newCartProduct = [];
        let totalBill = 0;
        let totalProduct = 0;
        
        let cart = await shoppingCartModel.findOne({userID});

        if(!cart){
            return {cartProducts:newCartProduct, totalBill};
        }
        for (let cartProduct of cart.products) {
            let product = await productModel.findOne({ _id: cartProduct.productID });
            totalBill += ((product.newPrice) * (cartProduct.quantity));
            totalProduct += Number(cartProduct.quantity);
            newCartProduct.push({
                price: product.newPrice,
                productID: product._id,
                productCode: product.productCode,
                productName: product.productName,
                quantity: cartProduct.quantity,
                thumbnail: product.productImgs[0],
                size: cartProduct.size,
                slug: product.slug,
                cardID: cartProduct._id,
                totalPrice: (product.newPrice) * (cartProduct.quantity)
            })
        }
        return {cartProducts:newCartProduct, totalBill,totalProduct};
}

class cartController {

    // [GET] /gio-hang/
    async loadData(req, res, next) {
        let userID = req.userID;
        console.log("// [GET] /gio-hang/: " + req.userData != null);
        console.log("// [GET] /gio-hang/: " + userID);
        let cartProduct = userID == "" ? {cartProducts:[], totalBill:0} : await getCartProduct(userID);
        // return res.json(newCart)
        return res.render("shopping-cart", {
            cartProduct,
            userData: req.userData,
            formatMoney: helper.formatToMoney
        })
    }

    // [POST] /gio-hang/add-new-product
    async addNewProduct(req, res, next) {
        console.log("addNewProduct: ");
        console.log(req.userID);

        const userID = req.userID;
        if(!userID){
            return res.render("login");
        }
        const {productID, quantity, size } = req.body;
        // let userId = "62efa3490f31b54514b2baf2", productCode ="Mk23", quantity = 2, size = 45;
        let cart = await shoppingCartModel.findOne({ userID });
        let totalQuantity = 0;
        if (cart) {
            cart = updateProductQuantity(cart, {productID, quantity, size},false);
            cart = await cart.save();
        } else {
            await new shoppingCartModel({
                userID,
                products: [{ productID, quantity, size }]
            }).save();
        }
        cart = await shoppingCartModel.findOne({ userID });
        cart.products.forEach((product) => totalQuantity += product.quantity);
    
        return res.status(200).json({ "status": 200 }).end();
    }

    // [PATCH] /gio-hang/update-quantity-product
    async updateQuantityProduct(req, res) {
        let userID = req.userID;
        let {productID, quantity, size} = req.body;
        let cart = await shoppingCartModel.findOne({ userID });
        if (cart) {
              cart = updateProductQuantity(cart,{productID, quantity, size},true);
              cart = await cart.save();
              return res.status(200).json(cart); 
        } else {
            return res.json({ "Message": "Not found cart of user" });
        }
    }

    // [DELETE] /gio-hang/delete/:id
    async deleteProduct(req, res){
        let id = req.params.id;
        let userID = req.userID;
        let cart = await shoppingCartModel.findOne({ userID });
        let products = cart.products.filter((product) => product.productID != id);
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