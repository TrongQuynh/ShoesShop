const productModel = require("../models/products.model");
const shoppingCartModel = require("../models/shoppingCart.model");
module.exports = {
    async getDataProductInCart(userId){
        
        let totalBill = 0;
        let totalProduct = 0;
        if(userId === "") return {cartProducts:[], totalBill};
        let cart = await shoppingCartModel.findOne({userId});
        if(!cart){
            return {cartProducts:[], totalBill};
        }
        let newCartProduct = cart.map(async function(productCart){
            let product = await productModel.findOne({ productCode: productCart.productCode },
                "newPrice productCode productName productImgs slug");
            totalBill += ((product.newPrice) * (productCart.quantity));
            totalProduct += Number(productCart.quantity);    
            return {
                price: product.newPrice,
                productCode: product.productCode,
                productName: product.productName,
                quantity: productCart.quantity,
                thumbnail: product.productImgs[0],
                size: productCart.size,
                slug: product.slug,
                id: productCart._id,
                totalPrice: (product.newPrice) * (productCart.quantity)
            };
        })
        return {cartProducts:newCartProduct, totalBill,totalProduct};
    }
}