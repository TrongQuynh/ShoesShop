const productModel = require("../models/products.model");
const shoppingCartModel = require("../models/shoppingCart.model");
const userModel = require("../models/user.model");

const helper = require("../helpers/index");

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
    },

    /*
        * User
        * Home-Controller
    */
    async getUserInfoBy_ID(userID) {
        let data = await userModel.findOne({ _id: userID });
        let userData = {
            username: data.username,
            phonenumber: data.phonenumber,
            picture: data.picture,
            role: data.role
        }
        return userData;
    },

    // Order
    async getOrderDetailWithStatus(userList,reqStatus){
        let orders = [];
        
        // THE ORDER WAIT FOR CONFIRM
         for(let user of userList){
             for(let order of user.orders){
                let totalBill = 0;
                 for(let status of order.status){
                     if(status.key == reqStatus.key && status.value == reqStatus.value){
                         let products = [];
                         
                         for(let product of order.products){
                             let productData = await productModel.findOne({_id:product.productID});
                             products.push(
                                 {
                                     productName: productData.productName,
                                     slug: productData.slug,
                                     image: productData.productImgs[0],
                                     price: helper.formatToMoney(productData.newPrice),
                                     size: product.size,
                                     quantity: product.quantity
                                 }
                             )
                             totalBill += ((parseInt(productData.newPrice)) * (parseInt(product.quantity)));
                         }
                         
                         orders.push({
                             orderCode: order.orderCode,
                             userID: user.userID,
                             username: order.username,
                             note: order.note,
                             dateOrder:helper.formatDate(order.orderAt),
                             timeOrder:helper.formatDateToTime(order.orderAt),
                             products,
                             totalBill: helper.formatToMoney(totalBill),
                             stage: parseInt(reqStatus.number)
                         })
                     }
                 }
             }
         }
         return orders;
    },
    async getAllOrderDetail(userList,reqStatus){
        let orders = [];
        
        // THE ORDER WAIT FOR CONFIRM
         for(let user of userList){
             for(let order of user.orders){
                let products = [];
                let totalBill = 0;
                         
                for(let product of order.products){
                    let productData = await productModel.findOne({_id:product.productID});
                    products.push(
                        {
                            productName: productData.productName,
                            image: productData.productImgs[0],
                            slug: productData.slug,
                            price: helper.formatToMoney(productData.newPrice),
                            size: product.size,
                            quantity: product.quantity
                        }
                    )
                    totalBill += ((parseInt(productData.newPrice)) * (parseInt(product.quantity)));
                }
                
                orders.push({
                    orderCode: order.orderCode,
                    userID: user.userID,
                    username: order.username,
                    note: order.note,
                    dateOrder:helper.formatDate(order.orderAt),
                    timeOrder:helper.formatDateToTime(order.orderAt),
                    products,
                    totalBill: helper.formatToMoney(totalBill),
                    stage: parseInt(reqStatus.number)
                })
             }
         }
         return orders;
    },


    // Product
    // Generate random product code
    generateProductCode(productName){
        let tmp = String(productName.replaceAll(' ','')).toUpperCase();
        return (tmp.slice(tmp.length > 4 ? 4 : tmp.length)) + String(helper.getRandomNumber() + 55);
        
    },
    // Check whether this slug exist or not
    async isSlugExit(slug) {
        return await productModel.findOne({slug}) ? true : false;
    },
    async generateProductSlug(productName, productCode){
        productName = productName.includes("/") ? str.replaceAll("/","-") : productName;
    
        let slug = productName.toLocaleLowerCase().replaceAll(" ", "-");
        while (await this.isSlugExit(slug)) {
            slug = `${str}-${productCode}-${Date.now()}`;
        }
        return slug;
    }

}